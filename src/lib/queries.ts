import { Where } from 'payload'
import { apiClient } from './api-client'
import { z } from 'zod'

export async function getProductBySlug(slug?: string) {
  if (!slug) return null
  const client = await apiClient()
  const products = await client.find({
    collection: 'products',
    draft: false,
    limit: 1,
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
  })

  return products.docs[0]
}

export async function getAllCategories() {
  const client = await apiClient()
  const categories = await client.find({
    collection: 'categories',
    limit: 500,
    draft: false,
  })

  return categories.docs
}

export async function getProducts(search: unknown) {
  const { data: searchParams } = z
    .object({
      name: z.string().optional(),
      warehouseId: z.string().optional(),
      tags: z.string().optional(),
      category: z.string().optional(),
    })
    .safeParse(search)

  const client = await apiClient()

  const where: Where = {
    and: [
      { _status: { equals: 'published' } },
      searchParams?.category ? { category: { equals: Number(searchParams.category) } } : {},
      searchParams?.name ? { name: { contains: searchParams.name } } : {},
      searchParams?.warehouseId ? { warehouseId: { contains: searchParams.warehouseId } } : {},
      searchParams?.tags ? { tags: { in: searchParams.tags.split('.') } } : {},
    ],
  }

  const products = await client.find({
    collection: 'products',
    limit: 500,
    draft: false,
    where,
  })

  return products
}
