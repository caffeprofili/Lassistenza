'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductCard } from './product-card'
import { use } from 'react'
import { getProducts } from '@/app/(main)/catalogo/page'

type CatalogoProductListProps = {
  promise: ReturnType<typeof getProducts>
}

export function CatalogoProductList({ promise }: CatalogoProductListProps) {
  const products = use(promise)
  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
      {products?.docs.map((product) => <ProductCard key={product.id} {...product} />)}
    </div>
  )
}

export function CatalogoProductListSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
      {[...Array(12)].map((_, index) => (
        <Skeleton key={index} className="h-64" />
      ))}
    </div>
  )
}
