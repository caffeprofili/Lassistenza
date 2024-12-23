import { slugField } from '@/fields/slug'
import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      label: 'Nome',
      type: 'text',
      required: true,
    },
    {
      label: 'Categoria',
      name: 'category',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      relationTo: 'categories',
      required: true,
    },
    {
      label: 'Prodotti',
      name: 'products',
      type: 'join',
      hasMany: true,
      collection: 'products',
      on: 'tags',
    },
    ...slugField('name'),
  ],
}
