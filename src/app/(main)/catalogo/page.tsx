import { Container } from '@/components/extensive/container'
import { SearchInput } from '@/components/ui/search-input'
import { CatalogoMobileNavigation } from '@/components/modules/products/catalogo-mobile-navigation'
import { CatalogoNavigation } from '@/components/modules/products/catalogo-navigation'
import {
  CatalogoProductList,
  CatalogoProductListSkeleton,
} from '@/components/modules/products/catalogo-product-list'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { getAllCategories, getProducts } from '@/lib/queries'

export const dynamic = 'force-static'
export const revalidate = 600

export function generateMetadata(): Metadata {
  return {
    title: `Catalogo | L'Assistenza`,
    description: "L'Assistenza - Vendita attrezzature usate, sicure e garantite",
  }
}

type PageProps = {
  searchParams: Promise<Record<string, string>>
  params: Promise<Record<string, string>>
}

const CatalogoPage = async (props: PageProps) => {
  const searchParams = await props.searchParams
  const categories = getAllCategories()
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

export default CatalogoPage
