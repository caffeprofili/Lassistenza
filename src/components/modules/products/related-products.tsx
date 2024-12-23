import { Skeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'
import { Section } from '@/components/extensive/section'
import { ProductCard } from './product-card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { apiClient } from '@/lib/api-client'
import { Product } from '@/payload-types'

async function getRelatedProducts(product: Product) {
  const client = await apiClient()
  return client.find({
    collection: 'products',
    limit: 5,
    draft: false,
    where: {
      and: [
        {
          tags: {
            in:
              product.tags?.map((t) => {
                if (typeof t === 'object') return t.id
              }) || [],
          },
        },
        { id: { not_equals: product.id } },
        { _status: { equals: 'published' } },
      ],
    },
  })
}

export const RelatedProductsSection = (product: Product) => {
  return (
    <Suspense fallback={<RelatedProductsSkeleton />}>
      <RelatedProducts {...product} />
    </Suspense>
  )
}

export const RelatedProducts = async (product: Product) => {
  const products = await getRelatedProducts(product)
  if (products.docs.length === 0) return <></>

  return (
    <Section className="bg-primary-foreground px-4 pt-28 pb-0">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <h3 className="text-primary font-bold text-2xl uppercase">Potrebbe anche interessarti</h3>
        <Carousel>
          <CarouselContent>
            {products.docs.map((product) => (
              <CarouselItem key={product.id} className="lg:basis-1/3 basis-1/1">
                <ProductCard {...product} className="border-muted" />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="lg:flex hidden" />
          <CarouselNext className="lg:flex hidden" />
        </Carousel>
      </div>
    </Section>
  )
}

export const RelatedProductsSkeleton = () => {
  return (
    <Section className="bg-primary-foreground px-4">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <h3 className="text-primary font-bold text-2xl uppercase">Potrebbe anche interessarti</h3>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
          {[{ n: 1 }, { n: 2 }, { n: 3 }].map(({ n }) => (
            <div key={n} className="flex items-center justify-center">
              <Skeleton className="w-full h-[200px] bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
