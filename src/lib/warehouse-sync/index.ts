'use server'
import { WarehouseArticle, DiffResponse } from './types'
import { articlesToProducts, slug } from './utils'
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
  const client = await apiClient()
  const products = articlesToProducts(articles)

  const ids = products.map((p) => p.warehouseId)

  // Get all existing products from DB
  const existingProducts = await client.find({
    collection: 'products',
    pagination: false,
    limit: 1000,
    select: {
      warehouseId: true,
      name: true,
    },
  })

  // Find products to delete (exist in DB but not in new ids)
  const toDelete = existingProducts.docs.filter((p) => !ids.includes(p.warehouseId))

  // Find products to add (exist in new ids but not in DB)
  const existingIds = existingProducts.docs.map((p) => p.warehouseId)
  const toAdd = products.filter((p) => !existingIds.includes(p.warehouseId))

  // Start transaction
  const transactionID = await client.db.beginTransaction()

  try {
    // Delete old products
    if (toDelete.length > 0) {
      await client.delete({
        collection: 'products',
        where: {
          warehouseId: {
            in: toDelete.map((p) => p.warehouseId),
          },
        },
        req: { transactionID: transactionID! },
      })
    }

    // Add new products
    for (const p of toAdd) {
      await client.create({
        collection: 'products',
        data: {
          name: p.name,
          warehouseId: p.warehouseId,
          slug: slug(`${p.name}-${p.warehouseId}`),
          price: 0,
        },
        req: { transactionID: transactionID! },
      })
    }
    await client.db.commitTransaction(transactionID!)
    return {
      status: 'SUCCESS',
      message: null,
      diff: { added: toAdd, removed: toDelete, updated: [], duplicates: [] },
    }
  } catch (err: any) {
    console.error(err)
    await client.db.rollbackTransaction(transactionID!)
    return {
      status: 'ERROR',
      message: err.message,
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
      <p>Lista prodotti RIMOSSI (Richiede azione manuale):</p>
      <ul>
        ${diff.removed
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
