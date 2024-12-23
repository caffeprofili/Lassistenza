// import { loggedInUser } from "@/modules/auth/data";
import { Logo } from './logo'
import { NavLinks } from './navigation-links'
import { MobileNav } from './navigation-mobile'
import Link from 'next/link'

export const Navigation = async () => {
  // const user = await loggedInUser();
  return (
    <nav className="relative bg-primary">
      <div className="container px-4 flex justify-between items-center h-[87px]">
        <Logo />
        <div className="flex gap-8">
          {/* {user?.role === "ADMIN" && (
            <Link
              href="/admin/products"
              className="text-primary-foreground font-medium"
            >
              Amministrazione
            </Link>
          )} */}
          <NavLinks className="lg:flex hidden justify-end items-center flex-1" />
        </div>
        <MobileNav />
      </div>
    </nav>
  )
}
