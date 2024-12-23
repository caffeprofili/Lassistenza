'use client'
import { getAllCategories } from '@/app/(main)/catalogo/page'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { Category, Tag } from '@/payload-types'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'qs'
import { use, useEffect, useState } from 'react'

type CatalogoMenuListProps = {
  promise: ReturnType<typeof getAllCategories>
}

export function CatalogoMenuList({ promise }: CatalogoMenuListProps) {
  const categories = use(promise)
  const searchParams = useSearchParams()

  const categoryParam = searchParams.get('category')

  return (
    <ul className="py-4 flex flex-col gap-3 items-start min-w-52">
      <Button
        asChild
        variant={'ghost'}
        className={cn('font-bold', {
          '!bg-accent !text-accent-foreground': !categoryParam,
        })}
      >
        <div className="flex gap-2 items-center">
          {!categoryParam && <Checkbox checked />}
          <Link href={`/catalogo`}>Tutti i prodotti</Link>
        </div>
      </Button>
      {categories.map((category) => {
        const categoryId = category.id?.toString()
        const isActive = categoryParam === categoryId
        return (
          <li key={category.id}>
            <Button
              asChild
              variant={'ghost'}
              className={cn('font-bold', {
                '!bg-accent !text-accent-foreground': isActive,
              })}
            >
              <div className="flex gap-2 items-center">
                {isActive && <Checkbox checked />}
                <Link href={`?category=${category.id}`}>{category.name}</Link>
              </div>
            </Button>
            <div className="ml-3 py-1 flex flex-col gap-1 items-start">
              {category.tags?.docs?.map((tag) => {
                if (typeof tag === 'object')
                  return <TagLink key={tag.id} category={category} tag={tag} />
              })}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function TagLink({ tag, category }: { tag: Tag; category: Category }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const categoryParam = searchParams.get('category')
  const tagId = tag.id?.toString()
  const categoryId = category.id?.toString()
  const isActive =
    searchParams.get('tags')?.split('.').includes(tagId!) && categoryParam === categoryId

  const [selected, setSelected] = useState(!!isActive)

  function handleChange(value: boolean) {
    setSelected(value)
    const activeCategory = searchParams.get('category')
    const obj = qs.parse(searchParams.toString())
    if (value) {
      if (obj.tags && activeCategory === categoryId) obj.tags = `${obj.tags}.${tagId}`
      else obj.tags = tagId!
      obj.category = categoryId!
      router.push(`${pathname}?${qs.stringify(obj)}`)
    } else {
      if (!obj.tags) return
      // @ts-expect-error
      const tags: string[] = obj.tags.split('.')
      const newTags = tags.filter((t) => t !== tagId)
      obj.tags = newTags.join('.')
      router.push(`${pathname}?${qs.stringify(obj)}`)
    }
  }

  useEffect(() => {
    const obj = qs.parse(searchParams.toString())
    if (obj.tags) {
      // @ts-expect-error
      const tags = obj.tags.split('.')
      setSelected(tags.includes(tagId) && obj.category === categoryId)
    } else {
      setSelected(false)
    }
  }, [isActive])

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={tag.id.toString()}
        onCheckedChange={(val: boolean) => handleChange(val)}
        checked={selected}
      />
      <label
        htmlFor={tag.id.toString()}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {tag.name}
      </label>
    </div>
  )
}
