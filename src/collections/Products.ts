import { slugField } from '@/fields/slug'
import {
  BoldFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  ParagraphFeature,
  UnderlineFeature,
} from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Informazioni',
          fields: [
            {
              name: 'name',
              label: 'Nome',
              type: 'text',
              required: true,
            },
            {
              label: 'Descrizione',
              name: 'description',
              type: 'richText',
              editor: lexicalEditor({
                features: () => {
                  return [
                    ParagraphFeature(),
                    BoldFeature(),
                    ItalicFeature(),
                    UnderlineFeature(),
                    InlineToolbarFeature(),
                  ]
                },
              }),
            },
            {
              name: 'warehouseId',
              label: 'ID Magazzino',
              type: 'text',
              required: true,
            },
            {
              name: 'price',
              label: 'Prezzo',
              type: 'number',
              required: true,
            },
          ],
        },
        {
          label: 'Immagini',
          fields: [
            {
              name: 'images',
              label: 'Immagini',
              type: 'array',
              fields: [
                {
                  name: 'image',
                  label: 'Immagine',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Documenti',
          fields: [
            {
              name: 'docs',
              label: 'Documenti',
              type: 'array',
              fields: [
                {
                  name: 'doc',
                  label: 'Documento',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    ...slugField('name'),
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
      label: 'Tags',
      name: 'tags',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      filterOptions({ siblingData }: any) {
        return {
          category: { equals: siblingData.category },
        }
      },
      hasMany: true,
      relationTo: 'tags',
    },
  ],
}
