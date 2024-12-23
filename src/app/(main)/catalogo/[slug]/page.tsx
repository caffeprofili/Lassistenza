import { notFound } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { RelatedProductsSection } from '@/components/modules/products/related-products'
import { ProductImages } from '@/components/modules/products/product-images'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { FileIcon } from 'lucide-react'
import { price } from '@/lib/utils'
import { Media } from '@/payload-types'
import RichText from '@/components/extensive/richtext'
import { RequestProductInfo } from '@/components/modules/contact/request-product-info'
import { Metadata } from 'next'
import { generateMeta } from '@/lib/generate-meta'
import { getProductBySlug } from '@/lib/queries'

type Args = { params: Promise<{ slug?: string }> }

export async function generateStaticParams() {
  const client = await apiClient()
  const courses = await client.find({
    collection: 'products',
    draft: false,
    limit: 1000,
    pagination: false,
    where: {
      _status: { equals: 'published' },
    },
    select: {
      slug: true,
    },
  })

  const params = courses.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  if (!slug) return { title: 'Prodotto non trovato', description: '404' }
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Prodotto non trovato', description: '404' }
  return generateMeta({ doc: product })
}

const ProductPage = async (props: Args) => {
  const params = await props.params
  const product = await getProductBySlug(params.slug)
  if (!product) return notFound()

  return (
    <>
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto w-full flex items-start flex-col md:flex-row gap-4">
          {/* mobile-title */}
          <div className="space-y-4 sm:hidden">
            <h1 className="font-bold text-3xl">{product.name}</h1>
            <pre className="text-sm text-muted-foreground">
              Codice prodotto: {product.warehouseId}
            </pre>
          </div>
          {/* top-left */}
          <div className="flex-1">
            <ProductImages {...product} />
          </div>
          {/* top-right */}
          <div className="max-w-sm space-y-8">
            <div className="space-y-4 max-sm:hidden">
              <h1 className="font-bold text-3xl">{product.name}</h1>
              <pre className="text-sm text-muted-foreground">
                Codice prodotto: {product.warehouseId}
              </pre>
            </div>
            <div>{product.description && <RichText content={product.description} />}</div>
            <div className="space-x-2">
              {product.tags?.map((tag) => {
                if (typeof tag === 'object') return <Badge key={tag.id}>{tag.name}</Badge>
              })}
            </div>
            {product.docs && product.docs.length > 0 && (
              <div className="flex flex-col gap-2">
                {product.docs.map(({ doc, id }, i) => (
                  <Link key={id} href={(doc as Media).url || ''} target="_blank">
                    <Card className="group">
                      <CardContent className="flex items-center pt-6 gap-4">
                        <div className="bg-primary p-2 rounded group-hover:bg-muted duration-200">
                          <FileIcon className="text-primary-foreground group-hover:text-primary duration-200" />
                        </div>
                        <p>PDF - {i + 1}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
            <h3 className="font-bold text-2xl font-price">{price(product.price)}</h3>
            <RequestProductInfo {...product} />
          </div>
        </div>
      </section>
      <RelatedProductsSection {...product} />
    </>
  )
}

export default ProductPage
