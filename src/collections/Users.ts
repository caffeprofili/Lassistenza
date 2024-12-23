import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'emailNotifications',
      label: 'Notifca per email',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
