import type { CollectionConfig } from 'payload'

export const Imports: CollectionConfig = {
  slug: 'imports',
  labels: {
    singular: 'Storico',
    plural: 'Storico',
  },
  access: {
    create: () => false,
    update: () => false,
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['id', 'status', 'createdAt'],
    components: {
      beforeListTable: [
        {
          path: '/components/admin/warehouse-sync-button',
          exportName: 'WarehouseSyncButton',
        },
      ],
    },
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
