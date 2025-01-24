'use server'
import { WarehouseArticle, DiffResponse, FormattedArticle } from './types'
import { articlesToProducts, diff, slug } from './utils'
import { sendMail } from '@/lib/mailjet'
import { getWarehouseArticles } from './data'
import { apiClient } from '../api-client'

export async function syncWarehouseProducts() {
  const client = await apiClient()
  const articles = await getWarehouseArticles()
  console.log('Articles: ', articles.length)
  const res = await uploadWarehouseProducts(articles)
  console.log('Upload Res: ', res.status)
  const newProductImport = await client.create({
    collection: 'imports',
    data: { status: res.status, error: res.message, diff: res.diff },
  })
  console.log('New Product Import: ', newProductImport.id)
  await sendAddedProductsNotification(res.diff)
  return {
    importResponse: newProductImport,
    uploadResponse: res,
  }
}

export async function uploadWarehouseProducts(articles: WarehouseArticle[]): Promise<{
  diff: DiffResponse
  status: string
  message: string | null
}> {
  try {
    const client = await apiClient()
    const products = articlesToProducts(articles)

    console.log('PRODUCTS: ', products.length)

    const _dbProducts = await client.find({
      collection: 'products',
      pagination: false,
      limit: 1000,
      select: {
        warehouseId: true,
        name: true,
      },
    })

    console.log('DB PRODUCTS: ', _dbProducts.docs.length)

    const dbProducts = _dbProducts.docs

    const _diff = diff(dbProducts, products)

    const transactionID = await client.db.beginTransaction()

    const inserted: { name: string; warehouseId: string }[] = []
    try {
      for (const p of _diff.updated) {
        await client.update({
          collection: 'products',
          where: { warehouseId: { equals: p.warehouseId } },
          data: { slug: slug(`${p.name}-${p.warehouseId}`) },
          req: { transactionID: transactionID! },
        })
      }

      await client.delete({
        collection: 'products',
        where: { warehouseId: { in: _diff.removed.map((p) => p.warehouseId) } },
        req: { transactionID: transactionID! },
      })

      for (const p of _diff.added) {
        const res = await client.create({
          collection: 'products',
          data: {
            name: p.name,
            warehouseId: p.warehouseId,
            slug: slug(`${p.name}-${p.warehouseId}`),
            price: 0,
          },
          req: { transactionID: transactionID! },
        })

        inserted.push({ name: res.name, warehouseId: res.warehouseId })

        await client.db.commitTransaction(transactionID!)
      }
    } catch (err) {
      await client.db.rollbackTransaction(transactionID!)
    }

    const duplicates = _diff.added
      .map((a) => {
        if (inserted.some((i) => i.warehouseId === a.warehouseId)) {
          return null
        }
        return a
      })
      .filter(Boolean) as FormattedArticle[]

    return {
      status: 'SUCCESS',
      message: null,
      diff: { ..._diff, added: inserted, duplicates },
    }
  } catch (error: any) {
    return {
      status: 'ERROR',
      message: error.message,
      diff: { added: [], removed: [], updated: [], duplicates: [] },
    }
  }
}

export async function sendAddedProductsNotification(diff: DiffResponse) {
  if (process.env.NODE_ENV === 'development') return

  if (diff.added.length === 0 && diff.updated.length === 0) return
  const client = await apiClient()
  const users = await client.find({
    collection: 'users',
    pagination: false,
    limit: 1000,
  })
  const notifiableUsers = users.docs.filter((u) => u.emailNotifications)
  const emailAddresses = notifiableUsers.map((u) => u.email).filter(Boolean) as string[]

  if (emailAddresses.length === 0) return

  const res = await sendMail({
    subject: 'Nuovi articoli sono stati aggiornati.',
    to: emailAddresses,
    html: `
      <h3>Nuovi articoli sono stati aggiornati dal magazzino.</h3>
      <p>I nuovi prodotti sono stati creati in stato di BOZZA.</p>
      <p>Per renderli visibili sul sito web, compila le informazioni del prodotto e imposta lostato a PUBBLICATO.</p>
      <br />
      <p>Lista prodotti aggiunti:</p>
      <ul>
        ${diff.added
          .map(
            (p) =>
              `<a href="https://lassistenzausato.net/admin/products/${slug(
                p.name,
              )}">${p.name} - ${p.warehouseId}</a>`,
          )
          .join('<br/>')}
      </ul>
      <br />
      <p>Lista prodotti aggiornati:</p>
      <ul>
        ${diff.updated
          .map(
            (p) =>
              `<a href="https://lassistenzausato.net/admin/products/${slug(
                p.name,
              )}">${p.name} - ${p.warehouseId}</a>`,
          )
          .join('<br/>')}
      </ul>
    `,
  })

  return res
}
