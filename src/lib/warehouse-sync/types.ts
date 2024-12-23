import { Product } from '@/payload-types'

export type ExistingProduct = Pick<Product, 'name' | 'warehouseId'>
export type FormattedArticle = Pick<Product, 'name' | 'warehouseId'>
export type WarehouseArticle = {
  CodArt: {
    _text: string
  }
  DescrizioneArt: {
    _text: string
  }
}

export type DiffResponse = {
  added: Pick<Product, 'name' | 'warehouseId'>[]
  removed: Pick<Product, 'name' | 'warehouseId'>[]
  updated: Pick<Product, 'name' | 'warehouseId'>[]
  duplicates: Pick<Product, 'name' | 'warehouseId'>[]
}
