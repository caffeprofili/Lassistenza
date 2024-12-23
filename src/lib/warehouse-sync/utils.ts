import { ExistingProduct, FormattedArticle, WarehouseArticle } from './types'
import slugify from 'slugify'

export function diff(_old: ExistingProduct[], _new: FormattedArticle[]) {
  const oldIds = new Set(_old.map((item) => item.warehouseId))
  const newIds = new Set(_new.map((item) => item.warehouseId))

  const newItems = _new.filter((item) => !oldIds.has(item.warehouseId))
  const oldItems = _old.filter((item) => !newIds.has(item.warehouseId))

  const updatedItems = _new.filter((item) => {
    const dbItem = _old.find((i) => i.warehouseId === item.warehouseId)
    return dbItem && dbItem.name !== item.name
  })

  return {
    added: newItems,
    removed: oldItems,
    updated: updatedItems,
  }
}

export function articlesToProducts(articles: WarehouseArticle[]): FormattedArticle[] {
  return articles.map((article) => ({
    name: article.DescrizioneArt._text,
    warehouseId: article.CodArt._text,
  }))
}

export function slug(str: string): string {
  return slugify(str, {
    replacement: '-', // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true, // convert to lower case, defaults to `false`
    strict: false, // strip special characters except replacement, defaults to `false`
    locale: 'it', // language code of the locale to use
    trim: true, // trim leading and trailing replacement chars, defaults to `true`
  })
}
