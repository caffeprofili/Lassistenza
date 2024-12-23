'use client'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { NavLinks } from './navigation-links'
import { MenuIcon } from 'lucide-react'

export const MobileNav = () => {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger className="lg:hidden block">
        <MenuIcon className="size-6 text-primary-foreground" />
      </SheetTrigger>
      <SheetContent
        side={'left'}
        className="bg-primary"
        // closeIconClassname="text-primary-foreground"
      >
        <SheetHeader>
          <SheetTitle className="text-primary-foreground">L'Assistenza</SheetTitle>
          <SheetDescription className="text-primary-foreground">
            Vendita attrezzature usate, sicure e garantite
          </SheetDescription>
        </SheetHeader>
        <div className="mt-12">
          <NavLinks
            orientation="vertical"
            className="md:text-left text-center"
            setOpen={setSheetOpen}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
