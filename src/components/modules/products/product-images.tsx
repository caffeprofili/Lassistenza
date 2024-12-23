'use client'

import { Media } from '@/components/extensive/media'
import { cn } from '@/lib/utils'
import type { Category, Media as IMedia, Product } from '@/payload-types'
import Image from 'next/image'
import { useState } from 'react'

export const ProductImages = (product: Product) => {
  const thumbnail = product.images?.[0]?.image || (product.category as Category)?.image

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
              {image && typeof image === 'object' ? (
                <Media imgClassName="mx-auto" priority={false} loading="lazy" resource={image} />
              ) : (
                <Image
                  src={'/assets/placeholder.svg'}
                  alt={product.name}
                  className="mx-auto"
                  width={150}
                  height={150}
                />
              )}
            </button>
          )
        })}
      </div>
      <div className="bg-card rounded-sm flex flex-col p-8 shadow order-1 sm:order-2">
        {selectedImage && typeof selectedImage === 'object' ? (
          <Media
            imgClassName="object-contain size-[500px]"
            priority={false}
            loading="lazy"
            resource={selectedImage}
          />
        ) : (
          <Image
            src={'/assets/placeholder.svg'}
            alt={product.name}
            className="object-contain size-[500px]"
            width={500}
            height={500}
          />
        )}
      </div>
    </div>
  )
}
