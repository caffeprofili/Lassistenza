'use client'

import { Media } from '@/components/extensive/media'
import { cn } from '@/lib/utils'
import type { Category, Media as IMedia, Product } from '@/payload-types'
import { useState } from 'react'

export const ProductImages = (product: Product) => {
  const thumbnail =
    product.images?.[0]?.image || (product.category as Category)?.image || '/assets/placeholder.png'

  const [selectedImage, setSelectedImage] = useState<IMedia | string | number>(thumbnail)
  return (
    <div className="flex flex-col md:flex-row items-start gap-4">
      <div className="flex md:flex-col flex-row gap-1 order-2 sm:order-1">
        {product.images?.map(({ image, id }) => {
          const isActive = selectedImage === image
          return (
            <button
              key={id}
              className={cn(
                'overflow-hidden size-[70px] shadow rounded transition-all duration-300',
                {
                  'opacity-30': !isActive,
                },
              )}
              onClick={() => setSelectedImage(image)}
            >
              <Media imgClassName="mx-auto" priority={false} loading="lazy" resource={image} />
            </button>
          )
        })}
      </div>
      <div className="bg-card rounded-sm flex flex-col p-8 shadow order-1 sm:order-2">
        <Media
          imgClassName="object-contain size-[500px]"
          priority={false}
          loading="lazy"
          resource={selectedImage}
        />
      </div>
    </div>
  )
}
