import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { apiClient } from '@/lib/api-client'
import fs from 'fs'
import { randomUUID } from 'crypto'

const OLD_PROJECT_URL = 'https://lgtfjcvvlavoanfypcoz.supabase.co'
const OLD_PROJECT_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxndGZqY3Z2bGF2b2FuZnlwY296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzMTk5MjEsImV4cCI6MjAzOTg5NTkyMX0.i407x-GRace6I0TVRcVse3OgGr2xsdk7hkF4_IYwvDw'

type SupabaseProduct = {
  id: string
  name: string
  slug: string
  description: string
  warehouseId: string
  price: string
  images: string[]
  categoryId?: string
  status: 'BOZZA' | 'PUBBLICATO'
}

type SupabaseTag = {
  id: string
  name: string
  slug: string
  categoryId: string
}

type SupabaseCategory = {
  id: string
  name: string
  slug: string
  image: string
}

const supabaseStorageBasePath =
  'https://lgtfjcvvlavoanfypcoz.supabase.co/storage/v1/object/public/images/'

export async function POST(req: Request) {
  const accessKey = req.headers.get('X-Access-Key')
  if (!accessKey || accessKey !== process.env.UPLOAD_PRODUCTS_ACCESS_KEY)
    return NextResponse.json({ status: 'unauthorized' })

  const client = await apiClient()

  // !RESET DB
  await client.delete({
    collection: 'tags',
    where: { id: { exists: true } },
  })
  await client.delete({
    collection: 'categories',
    where: { id: { exists: true } },
  })
  await client.delete({
    collection: 'products',
    where: { id: { exists: true } },
  })
  // !

  const supabase = createClient(OLD_PROJECT_URL, OLD_PROJECT_SERVICE_KEY)

  const { data: _categories, error: _categoriesError } = await supabase.from('category').select()
  if (_categoriesError) throw new Error(_categoriesError.message)

  const supabaseCategories = _categories as SupabaseCategory[]

  const transactionID = await client.db.beginTransaction()

  const categoriesMap: Record<string, number> = {}

  try {
    //  CREATE CATEGORIES and TAGS
    for (const category of supabaseCategories) {
      let image: number | null = null
      if (category.image) {
        const images = await client.find({
          collection: 'media',
          limit: 1,
          where: {
            filename: { equals: category.image.split(supabaseStorageBasePath).reverse()[0] },
          },
        })

        image = images.docs[0]?.id || null
      }
      const payloadCategory = await client.create({
        collection: 'categories',
        data: {
          name: category.name,
          slug: category.slug,
          // @ts-expect-error
          image,
        },
        req: { transactionID: transactionID! },
      })

      Object.assign(categoriesMap, { [category.id]: payloadCategory.id })

      //  find al tags by category.id
      const { data: _tags, error: _tagsError } = await supabase
        .from('tag')
        .select()
        .eq('categoryId', category.id)

      const categoryTags = _tags as SupabaseTag[]

      // for each tag create a new tag with the same category id
      for (const tag of categoryTags) {
        await client.create({
          collection: 'tags',
          data: {
            name: tag.name,
            slug: tag.slug,
            category: payloadCategory.id,
          },
          req: { transactionID: transactionID! },
        })
      }
    }

    //  CREATE PRODUCTS
    const { data: _products, error: _productsError } = await supabase.from('product').select()
    if (_productsError) throw new Error(_productsError.message)
    const supabaseProducts = _products as SupabaseProduct[]

    const imagesQuery: string[] = []

    for (const product of supabaseProducts) {
      const payloadProduct = await client.create({
        collection: 'products',
        data: {
          name: product.name,
          slug: product.slug,
          warehouseId: product.warehouseId,
          price: isNaN(Number(product.price)) ? 0 : Number(product.price),
          category: categoriesMap[product.categoryId!],
          _status: product.status === 'BOZZA' ? 'draft' : 'published',
          description: {
            root: {
              children: [
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: product.description,
                      type: 'text',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  type: 'paragraph',
                  version: 1,
                  textFormat: 0,
                  textStyle: '',
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'root',
              version: 1,
            },
          },
        },
        req: { transactionID: transactionID! },
      })

      const images: number[] = []
      for (const image of product.images) {
        const filename = image.split(supabaseStorageBasePath).reverse()[0]
        const data = await client.find({
          collection: 'media',
          where: {
            filename: { equals: filename },
          },
        })
        if (data.docs[0]) images.push(data?.docs[0]?.id)
      }

      images.forEach((image, i) => {
        imagesQuery.push(
          `INSERT INTO "products_images" ("_order", "_parent_id", "id", "image_id") VALUES ('${i + 1}', '${payloadProduct.id}', '${randomUUID()}', '${image}')`,
        )
      })
    }

    fs.writeFileSync('images.sql', imagesQuery.join(';\n'))
    await client.db.commitTransaction(transactionID!)
    return NextResponse.json({ success: true, errors: null })
  } catch (err: any) {
    await client.db.rollbackTransaction(transactionID!)
    console.log(err)
    return NextResponse.json({ success: false, errors: err?.message })
  }
}
