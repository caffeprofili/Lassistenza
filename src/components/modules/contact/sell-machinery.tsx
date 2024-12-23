'use client'
import { useEffect, useState, useTransition } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { z } from 'zod'

import { toast } from 'sonner'
import { useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormFields } from '@/components/ui/form-fields'
import { Form } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { PlusIcon, X } from 'lucide-react'
import Image from 'next/image'
import { cn, formatBytes } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

export const SellMachineFormSchema = z.object({
  nome: z.string().min(1, 'Obbligatorio'),
  cognome: z.string().min(1, 'Obbligatorio'),
  email: z.string().email('Email invalida.').min(1, 'Obbligatorio'),
  telefono: z.string().optional(),
  messaggio: z.string().min(1, 'Obbligatorio'),
  attachments: z.any(),
})

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

export const SellMachinery = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof SellMachineFormSchema>>({
    mode: 'onBlur',
    resolver: zodResolver(SellMachineFormSchema),
  })

  const onSubmit = async (data: z.infer<typeof SellMachineFormSchema>) => {
    startTransition(async () => {
      const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/mail/vendi-usato', {
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
      <SheetTrigger>
        <Button variant={'secondary'} size={'lg'}>
          Contattaci
        </Button>
      </SheetTrigger>
      <SheetContent
        side={'bottom'}
        className="max-w-2xl w-full mx-auto bg-primary-foreground rounded-t space-y-8"
      >
        <SheetHeader>
          <SheetTitle className="text-primary">Contattaci per vendere i tuoi macchinari</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Compila il modulo e sarai ricontattato il prima possibile.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="lg:h-auto h-80 max-h-screen rounded-md">
              <div className="space-y-2 pb-6">
                <div className="flex gap-2">
                  <FormFields.Input name="nome" label="Nome" />
                  <FormFields.Input name="cognome" label="Cognome" />
                </div>
                <div className="flex gap-2">
                  <FormFields.Input name="email" label="Email" />
                  <FormFields.Input name="telefono" label="Telefono" />
                </div>
                <FormFields.TextArea name="messaggio" label="Messaggio" />
                <SellMachineryFileInput />
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

function SellMachineryFileInput() {
  const form = useFormContext()
  const [files, setFiles] = useState<File[]>([])

  useEffect(() => {
    ;(async () => {
      if (!files) form.setValue('attachments', [])
      const formFiles = await Promise.all(
        files.map(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader()
              reader.onloadend = () => {
                const base64String = reader.result as string
                resolve({
                  ContentType: file.type,
                  Filename: file.name,
                  Base64Content: base64String.split(',')[1],
                })
              }
              reader.onerror = reject
              reader.readAsDataURL(file)
            }),
        ),
      )
      form.setValue('attachments', formFiles)
    })()
  }, [files])

  async function handleChange(f: React.ChangeEvent<HTMLInputElement>) {
    if (!f.target.files) return
    const _files = Array.from(f.target.files)
    setFiles(_files)
  }

  return (
    <div className="border border-input p-4 rounded gap-4">
      <Label
        htmlFor="attachments"
        className="cursor-pointer flex gap-2 items-center  font-semibold hover:bg-muted"
      >
        <PlusIcon className="size-4" />
        Allega Immagini
      </Label>
      <input
        type="file"
        accept="image/*"
        multiple
        max={5}
        id="attachments"
        className="sr-only"
        onChange={handleChange}
      />
      {files?.length > 0 && (
        <ScrollArea className="h-32 mt-4">
          <div className={cn('space-y-2')}>
            {files?.map((file, i) => (
              <div key={`${file.name}-${i}`} className="flex justify-between items-center">
                <section className="flex gap-2 flex-1">
                  <Image
                    src={URL.createObjectURL(file) || ''}
                    alt={file.name}
                    width={50}
                    height={50}
                    className="size-12 object-cover rounded"
                  />
                  <div>
                    <p className="text-xs line-clamp-1">{file.name}</p>
                    <pre className="text-xs text-muted-foreground">{formatBytes(file.size)}</pre>
                  </div>
                </section>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setFiles((prev) => prev.filter((_, idx) => idx !== i))
                  }}
                >
                  <X className="size-3" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
