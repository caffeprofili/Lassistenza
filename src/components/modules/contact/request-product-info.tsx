'use client'
import { useState, useTransition } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Product } from '@/payload-types'
import { FormFields } from '@/components/ui/form-fields'
import { RequestProductInfoFormSchema } from './schema'

const Sheet = dynamic(
  async () => {
    const { Sheet } = await import('@/components/ui/sheet')
    return { default: Sheet }
  },
  { ssr: false },
)
const SheetContent = dynamic(
  async () => {
    const { SheetContent } = await import('@/components/ui/sheet')
    return { default: SheetContent }
  },
  { ssr: false },
)
const SheetDescription = dynamic(
  async () => {
    const { SheetDescription } = await import('@/components/ui/sheet')
    return { default: SheetDescription }
  },
  { ssr: false },
)
const SheetHeader = dynamic(
  async () => {
    const { SheetHeader } = await import('@/components/ui/sheet')
    return { default: SheetHeader }
  },
  { ssr: false },
)
const SheetTitle = dynamic(
  async () => {
    const { SheetTitle } = await import('@/components/ui/sheet')
    return { default: SheetTitle }
  },
  { ssr: false },
)
const SheetTrigger = dynamic(
  async () => {
    const { SheetTrigger } = await import('@/components/ui/sheet')
    return { default: SheetTrigger }
  },
  { ssr: false },
)

export const RequestProductInfo = (product: Product) => {
  const [open, setOpen] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof RequestProductInfoFormSchema>>({
    mode: 'onBlur',
    resolver: zodResolver(RequestProductInfoFormSchema),
    defaultValues: {
      codice_prodotto: product?.warehouseId,
      nome_prodotto: product?.name,
    },
  })

  const onSubmit = async (data: z.infer<typeof RequestProductInfoFormSchema>) => {
    startTransition(async () => {
      const res = await fetch('/api/mail/product', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      const result = await res.json()

      if (result.success) {
        toast.success('Richiesta inviata!')
        setOpen(false)
        form.reset()
      } else {
        toast.error("Richiesta non inviata, contatta l'assistenza.")
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant={'secondary'} size={'lg'}>
          Richiedi Disponibilitá
        </Button>
      </SheetTrigger>
      <SheetContent
        side={'bottom'}
        className="max-w-2xl w-full mx-auto bg-primary-foreground rounded-t space-y-8"
      >
        <SheetHeader>
          <SheetTitle className="text-primary">Richiedi informazioni</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Compila il modulo e sarai ricontattato il prima possibile riguardo la disponibilità del
            prodotto.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="lg:h-auto h-80 rounded-md">
              <div className="space-y-2">
                <FormFields.Input name="nome" label="Nome" />
                <FormFields.Input name="cognome" label="Cognome" />
                <FormFields.Input name="email" label="Email" />
                <FormFields.Input name="telefono" label="Telefono" />
                <FormFields.TextArea name="messaggio" label="Messaggio" />
              </div>
            </ScrollArea>
            <div className="py-8">
              <Button
                type="submit"
                size={'lg'}
                variant={'secondary'}
                className="w-full"
                disabled={isPending}
              >
                Invia
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
