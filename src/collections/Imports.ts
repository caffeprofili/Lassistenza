import { slugField } from '@/fields/slug'
import type { CollectionConfig } from 'payload'

export const Imports: CollectionConfig = {
  slug: 'imports',
  labels: {
    singular: 'Storico',
    plural: 'Storico',
  },
  admin: {
    useAsTitle: 'id',
  },
  fields: [
    {
      name: 'status',
      label: 'Esito',
      type: 'text',
      admin: {
        readOnly: true,
      },
      required: true,
    },
    {
      name: 'error',
      label: 'Errore',
      type: 'textarea',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'diff',
      label: 'Dati',
      type: 'json',
      admin: {
        readOnly: true,
      },
    },
  ],
}
