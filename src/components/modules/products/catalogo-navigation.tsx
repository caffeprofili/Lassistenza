import { Suspense } from 'react'
import { CatalogoMenuList } from './menu-list'
import { Skeleton } from '@/components/ui/skeleton'
import { getAllCategories } from '@/app/(main)/catalogo/page'

export async function CatalogoNavigation(props: { promise: ReturnType<typeof getAllCategories> }) {
  return (
    <aside className="p-8 bg-primary-foreground rounded sticky top-14 max-md:hidden">
      <Suspense
        fallback={
          <div className="space-y-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-48 bg-black/10" />
            ))}
          </div>
        }
      >
        <CatalogoMenuList promise={props.promise} />
      </Suspense>
    </aside>
  )
}
