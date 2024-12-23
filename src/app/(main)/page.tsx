import { Banner } from '@/components/extensive/banner'
import { CategoriesGrid } from '@/components/modules/category/categories-grid'

import type { Metadata } from 'next'

export const dynamic = 'force-static'
export const revalidate = 600

export function generateMetadata(): Metadata {
  return {
    title: `Home | L'Assistenza`,
    description: "L'Assistenza - Vendita attrezzature usate, sicure e garantite",
  }
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Banner src="/assets/home-banner.png" className="flex justify-center items-center">
        <h1 className="max-w-[800px] text-primary-foreground flex flex-col gap-1">
          <span className="uppercase md:text-[50px] text-[34px] font-bold text-center">
            L'Assistenza
          </span>
          <span className="uppercase md:text-[20px] text-[16px] font-semibold text-center">
            Vendita attrezzature usate, sicure e garantite
          </span>
        </h1>
      </Banner>
      <CategoriesGrid />
    </main>
  )
}
