import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'
import { apiClient } from '@/lib/api-client'
import { Media } from '@/components/extensive/media'

export const CategoriesGrid = () => {
  return (
    <section className="max-w-4xl w-full mx-auto -translate-y-16 px-4">
      <div>
        <Suspense fallback={<CategorieSkeleton />}>
          <Categorie />
        </Suspense>
      </div>
    </section>
  )
}

const Categorie = async () => {
  const client = await apiClient()
  const categorie = await client.find({
    collection: 'categories',
  })

  return (
    <div className="relative">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
        {categorie.docs.map((category) => (
          <Link href={`/catalogo?category=${category.id}`} key={category.id}>
            <div className="items-center shadow group space-y-4 bg-card rounded-sm flex flex-col p-8">
              <h3 className="text-muted-foreground font-semibold text-sm uppercase">
                {category.name}
              </h3>
              <Media
                imgClassName="size-32 text-destructive transition-all duration-300 group-hover:-translate-y-1"
                priority={false}
                loading="lazy"
                resource={category.image || '/assets/placeholder.svg'}
              />
            </div>
          </Link>
        ))}
      </div>
      <Button
        asChild
        size={'lg'}
        variant={'secondary'}
        className="absolute -bottom-24 translate-x-[-50%] left-[50%]"
      >
        <Link href={'/catalogo'}>Vai al catalogo completo</Link>
      </Button>
    </div>
  )
}

const CategorieSkeleton = () => {
  const items = [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }, { n: 5 }, { n: 6 }]

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
      {items.map((item) => (
        <div className="flex items-center justify-center" key={item.n}>
          <Skeleton className="h-[232px] w-full bg-card" />
        </div>
      ))}
    </div>
  )
}
