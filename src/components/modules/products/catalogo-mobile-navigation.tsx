'use client'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Sliders } from 'lucide-react'
import { Suspense } from 'react'
import { CatalogoMenuList } from './menu-list'
import { SheetClose, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getAllCategories } from '@/lib/queries'

const Sheet = dynamic(
  async () => {
    const { Sheet } = await import('@/components/ui/sheet')
    return { default: Sheet }
  },
  { ssr: false },
)
const SheetContent = dynamic(
  async () => {
    const { SheetContent } = await import('@/components/ui/sheet')
    return { default: SheetContent }
  },
  { ssr: false },
)

const SheetTrigger = dynamic(
  async () => {
    const { SheetTrigger } = await import('@/components/ui/sheet')
    return { default: SheetTrigger }
  },
  { ssr: false },
)
export const CatalogoMobileNavigation = (props: {
  promise: ReturnType<typeof getAllCategories>
}) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden px-4" asChild>
        <Button className="flex gap-2" variant={'outline'} size={'sm'}>
          <Sliders className="size-4" />
          <p>Filtra</p>
        </Button>
      </SheetTrigger>
      <SheetContent side={'left'} className="flex flex-col gap-4">
        <Suspense fallback={<p>Loading...</p>}>
          <ScrollArea>
            <CatalogoMenuList promise={props.promise} />
          </ScrollArea>
        </Suspense>
        <SheetFooter>
          <SheetClose asChild>
            <Button className="flex gap-2 w-full" variant={'outline'} size={'sm'}>
              Filtra
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
