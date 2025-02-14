import { cn, price } from '@/lib/utils'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Category, Product } from '@/payload-types'
import { Media } from '@/components/extensive/media'
import Image from 'next/image'

export const ProductCard = ({ className, ...product }: Product & { className?: string }) => {
  const thumbnail = product.images?.[0]?.image || (product.category as Category)?.image

  return (
    <Link href={`/catalogo/${product.slug}`} className="group">
      <div
        className={cn(
          'rounded-sm flex flex-col p-0 border-2 border-primary-foreground overflow-hidden h-full group-hover:-translate-y-1 transition-all duration-300 relative',
          className,
        )}
      >
        <div className="absolute top-1 left-1 space-x-1">
          {product.tags?.map((tag) => {
            if (typeof tag === 'object') {
              return (
                <Badge key={tag.id} variant="secondary" className="text-sm">
                  {tag.name}
                </Badge>
              )
            }
          })}
        </div>
        <div className="flex-1 p-6 pb-0 flex justify-center items-center bg-primary-foreground">
          {thumbnail && typeof thumbnail === 'object' ? (
            <Media
              imgClassName="h-[150px] w-auto mx-auto p-4"
              priority={false}
              loading="lazy"
              resource={thumbnail}
            />
          ) : (
            <Image src={'/assets/placeholder.svg'} alt={product.name} width={150} height={150} />
          )}
        </div>
        <div className="bg-gray-50 p-4 space-y-2">
          <h5 className="text-primary font-bold">{product.name}</h5>
          <div className="flex justify-between items-center">
            {/* <StarRating value={product.quality ?? 0} /> */}
            <p className="font-semibold">{price(product.price)}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
