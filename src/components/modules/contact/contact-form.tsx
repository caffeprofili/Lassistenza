'use client'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { FormFields } from '@/components/ui/form-fields'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

export const ContactFormSchema = z.object({
  nome: z.string().min(1, 'Obbligatorio'),
  cognome: z.string().min(1, 'Obbligatorio'),
  email: z.string().email('Email invalida.').min(1, 'Obbligatorio'),
  telefono: z.string().optional(),
  messaggio: z.string().min(1, 'Obbligatorio'),
})

export const ContactForm = () => {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof ContactFormSchema>>({
    mode: 'onBlur',
    resolver: zodResolver(ContactFormSchema),
  })

  async function handleContact(data: z.infer<typeof ContactFormSchema>) {
    startTransition(async () => {
      const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/mail/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      const result = await res.json()

      if (result.success) {
        toast.success('Richiesta inviata!')
        form.reset()
      } else {
        toast.error("Richiesta non inviata, contatta l'assistenza.")
      }
    })
  }

  return (
    <div className="max-w-3xl w-full mx-auto space-y-10 mb-32 bg-card py-6 px-2">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-primary">Facci sapere</h2>
        <p className="text-md text-muted-foreground">
          Compila il modulo e un esperto ti ricontatterá.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleContact)} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 px-8">
            <FormFields.Input name="nome" label="Nome" />
            <FormFields.Input name="cognome" label="Cognome" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 px-8">
            <FormFields.Input name="email" label="Email" />
            <FormFields.Input name="telefono" label="Telefono" />
          </div>
          <div className="px-8">
            <FormFields.TextArea name="messaggio" label="Messaggio" />
          </div>
          <div className="flex items-center justify-center">
            <Button
              type="submit"
              variant={'secondary'}
              size={'lg'}
              className="min-w-44"
              disabled={isPending}
            >
              Invia
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
