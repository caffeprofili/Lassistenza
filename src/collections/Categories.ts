import { slugField } from '@/fields/slug'
import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Generale',
          fields: [
            {
              name: 'name',
              label: 'Nome',
              type: 'text',
              required: true,
            },
            {
              name: 'image',
              label: 'Immagine',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
        {
          label: 'Tags',
          fields: [
            {
              name: 'tags',
              type: 'join',
              collection: 'tags',
              on: 'category',
            },
          ],
        },
        {
          label: 'Prodotti',
          fields: [
            {
              name: 'products',
              type: 'join',
              collection: 'products',
              on: 'category',
            },
          ],
        },
      ],
    },
    ...slugField('name'),
  ],
}
