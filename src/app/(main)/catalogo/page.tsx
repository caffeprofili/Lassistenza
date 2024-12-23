import { Container } from '@/components/extensive/container'
import { SearchInput } from '@/components/ui/search-input'
import { CatalogoMobileNavigation } from '@/components/modules/products/catalogo-mobile-navigation'
import { CatalogoNavigation } from '@/components/modules/products/catalogo-navigation'
import {
  CatalogoProductList,
  CatalogoProductListSkeleton,
} from '@/components/modules/products/catalogo-product-list'
import { Suspense } from 'react'
import { apiClient } from '@/lib/api-client'
import { z } from 'zod'
import { Where } from 'payload'

export const revalidate = 0

type PageProps = {
  searchParams: Promise<Record<string, string>>
  params: Promise<Record<string, string>>
}

const CatalogoPage = async (props: PageProps) => {
  const categories = getAllCategories()
  const searchParams = await props.searchParams
  const products = getProducts(searchParams)
  return (
    <Container className="flex items-start py-12 max-md:flex-col">
      <CatalogoNavigation promise={categories} />
      <CatalogoMobileNavigation promise={categories} />
      <Container className="space-y-12 pt-0">
        <section className="flex lg:flex-row flex-col justify-between gap-4 lg:items-center md:mt-0 mt-12">
          <h1 className="text-lg font-bold">Catalogo Usato</h1>
          <div className="flex md:flex-row flex-col gap-4 lg:justify-end flex-1">
            <SearchInput
              name="warehouseId"
              placeholder="Cerca codice prodotto"
              className="bg-primary-foreground max-w-60 w-full"
            />
            <SearchInput
              name="name"
              placeholder="Cerca per nome"
              className="bg-primary-foreground max-w-60 w-full"
            />
          </div>
        </section>
        <Suspense key={JSON.stringify(searchParams)} fallback={<CatalogoProductListSkeleton />}>
          <CatalogoProductList promise={products} />
        </Suspense>
      </Container>
    </Container>
  )
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

export default CatalogoPage
