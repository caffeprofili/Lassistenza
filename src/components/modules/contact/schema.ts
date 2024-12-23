import { z } from 'zod'

export const ContactFormSchema = z.object({
  nome: z.string().min(1, 'Obbligatorio'),
  cognome: z.string().min(1, 'Obbligatorio'),
  email: z.string().email('Email invalida.').min(1, 'Obbligatorio'),
  telefono: z.string().optional(),
  messaggio: z.string().min(1, 'Obbligatorio'),
})

export const SellMachineFormSchema = z.object({
  ...ContactFormSchema.shape,
  attachments: z.any(),
})

export const RequestProductInfoFormSchema = z.object({
  ...ContactFormSchema.shape,
  nome_prodotto: z.string().min(1, 'Obbligatorio'),
  codice_prodotto: z.string().min(1, 'Obbligatorio'),
})
