'use client'
import { cn } from '@/lib/utils'
import { Each } from '../extensive/each'
import Link from 'next/link'

type NavLink = {
  label: string
  href: string
}

export const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Catalogo Usato', href: '/catalogo' },
  { label: 'Vendi Macchinari', href: '/vendi' },
  { label: 'Contatti', href: '/contatti' },
]

type NavLinksProps = {
  orientation?: 'vertical' | 'horizontal'
  className?: string
  setOpen?: (open: boolean) => void
}
export const NavLinks = ({ orientation = 'horizontal', className, setOpen }: NavLinksProps) => {
  const orientationCn = {
    vertical: 'flex-col',
    horizontal: 'flex-row',
  }

  return (
    <ul className={cn('flex text-primary-foreground gap-8', orientationCn[orientation], className)}>
      {navLinks.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="font-medium border-b border-primary hover:border-muted-foreground transition-all duration-300"
            onClick={() => setOpen && setOpen(false)}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}
