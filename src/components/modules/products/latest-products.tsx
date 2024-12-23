import { Each } from '@/components/extensive/each'
import { Section } from '@/components/extensive/section'
import { Skeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'
import { ProductCard } from './product-card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { apiClient } from '@/lib/api-client'

export const LatestProductsSection = () => {
  return (
    <Suspense fallback={<LatestProductsSkeleton />}>
      <LatestProducts />
    </Suspense>
  )
}

export const LatestProducts = async () => {
  const client = await apiClient()
  const products = await client.find({
    collection: 'products',
    limit: 3,
    sort: 'createdAt',
    where: {
      _status: { equals: 'published' },
    },
  })

  return (
    <Section className="bg-primary-foreground px-4 py-28">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <h3 className="text-primary font-bold text-2xl uppercase">Ultimi Arrivi</h3>
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
        <div className="grid md:grid-cols-3 grid-cols-1 gap-6"></div>
      </div>
    </Section>
  )
}

export const LatestProductsSkeleton = () => {
  return (
    <Section className="bg-primary-foreground px-4">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <h3 className="text-primary font-bold text-2xl uppercase">Ultimi Arrivi</h3>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
          <Each
            of={[{ n: 1 }, { n: 2 }, { n: 3 }]}
            render={() => (
              <div className="flex items-center justify-center">
                <Skeleton className="w-full h-[200px] bg-gray-200" />
              </div>
            )}
          />
        </div>
      </div>
    </Section>
  )
}
