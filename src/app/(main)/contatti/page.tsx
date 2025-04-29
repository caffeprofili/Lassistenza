import { Banner } from '@/components/extensive/banner'
import { ContactForm } from '@/components/modules/contact/contact-form'
import { PhoneIcon, MapPinIcon, CalendarIcon, MessageCircleMore } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  return {
    title: `Contatti | L'Assistenza`,
    description: "L'Assistenza - Vendita attrezzature usate, sicure e garantite",
  }
}

const ContattiPage = () => {
  return (
    <>
      <Banner size="sm" src="/assets/home-banner.png" className="flex justify-center items-center">
        <h1 className="max-w-[800px] text-primary-foreground flex flex-col gap-1">
          <span className="uppercase md:text-[50px] text-[34px] font-bold text-center">
            Contattaci
          </span>
        </h1>
      </Banner>
      <div className="py-12 pb-4">
        <div className="flex-1 flex flex-col items-center -translate-y-20 gap-8 md:order-2 order-1">
          <div className="bg-card rounded-sm flex shadow max-w-6xl w-full flex-col items-center sm:flex-row p-0">
            <div className="p-8 max-w-md w-full sm:border-r border-gray-100 flex flex-col items-center justify-start gap-6 text-center">
              <PhoneIcon className="size-10 text-primary" />
              <h3 className="font-medium text-sm text-primary">Chiamaci</h3>
              <div className="space-y-1">
                <p className="text-sm">
                  Telefono:{' '}
                  <Link href="tel:+390666012321" className="underline">
                    06 66012321
                  </Link>
                </p>
                <p className="text-sm">
                  Whatsapp:{' '}
                  <Link href="https://wa.me/3661901703" target="_blank" className="underline">
                    366 1901703
                  </Link>
                </p>
              </div>
            </div>
            <div className="p-8 max-w-md w-full sm:border-r border-gray-100 flex flex-col items-center justify-start gap-6 text-center">
              <MessageCircleMore className="size-10 text-primary" />
              <h3 className="font-medium text-sm text-primary">Scrivici</h3>
              <div className="space-y-1">
                <p className="text-sm">
                  <Link href="mailto:info@lassistenzausato.net" className="underline block">
                    info@lassistenzausato.net
                  </Link>
                </p>
                <p className="text-sm">
                  Whatsapp:{' '}
                  <Link href="https://wa.me/3661901703" target="_blank" className="underline">
                    366 1901703
                  </Link>
                </p>
              </div>
            </div>
            <div className="p-8 max-w-md w-full sm:border-r border-gray-100 flex flex-col items-center justify-start gap-6 text-center">
              <MapPinIcon className="size-10 text-primary" />
              <h3 className="font-medium text-sm text-primary">Vieni a trovarci</h3>
              <Link
                href="https://www.google.com/maps/search/?api=1&query=Via+Francesco+Aquilanti+58,+00166,+Roma+(RM),+Italia"
                target="_blank"
                className="underline text-sm"
              >
                Via Francesco Aquilanti 58, 00166, Roma (RM), Italia
              </Link>
            </div>
            <div className="p-8 max-w-md w-full flex flex-col items-center justify-start gap-6 text-center">
              <CalendarIcon className="size-10 text-primary" />
              <h3 className="font-medium text-sm text-primary">Orari</h3>
              <div>
                <p className="text-sm">Lunedi - Venerdi 08:30 - 17:00</p>
                <p className="text-sm">Sabato 08:30 - 13:00</p>
                <p className="text-sm">Domenica chiusi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <ContactForm />
      </div>
    </>
  )
}

export default ContattiPage
