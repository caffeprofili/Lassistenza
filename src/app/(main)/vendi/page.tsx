import Image from 'next/image'
import { Metadata } from 'next'
import { Banner } from '@/components/extensive/banner'
import { SellMachinery } from '@/components/modules/contact/sell-machinery'
import { AlertCircle } from 'lucide-react'

export const dynamic = 'force-static'

export function generateMetadata(): Metadata {
  return {
    title: `Vendi | L'Assistenza`,
    description: "L'Assistenza - Vendita attrezzature usate, sicure e garantite",
  }
}

const VendiPage = () => {
  return (
    <>
      <Banner size="sm" src="/assets/home-banner.png" className="flex justify-center items-center">
        <h1 className="max-w-[800px] text-primary-foreground flex flex-col gap-1">
          <span className="uppercase md:text-[50px] text-[34px] font-bold text-center">
            Acquistiamo <br className="lg:hidden" /> il tuo usato
          </span>
        </h1>
      </Banner>
      <div className="pt-12 pb-4">
        <div className="flex-1 flex flex-col items-center -translate-y-20 gap-8 md:order-2 order-1">
          <div className="bg-card rounded-sm flex p-8 shadow max-w-4xl flex-col items-center sm:flex-row gap-12">
            <div className="flex flex-col space-y-6 max-w-md">
              <div className="space-y-1">
                <h4 className="text-2xl font-bold text-primary">Non lo usi più?</h4>
                <p className="font-semibold uppercase text-sm text-muted">Dallo a noi.</p>
              </div>
              <p>
                Un macchinario per te obsoleto può essere una soluzione per qualcun altro! <br />
                <b>Noi de L’Assistenza divisione Usato</b>, acquistiamo e ricondizionamo i tuoi
                macchinari per dargli <b>una seconda vita</b>, aiutando anche l’ambiente.
              </p>
              <div className="max-sm:self-center">
                <SellMachinery />
              </div>
            </div>
            <Image
              className="max-w-[250px] w-full"
              src={'/assets/vendi.png'}
              alt="Vendi Macchinari"
              width={400}
              height={400}
            />
          </div>
        </div>
      </div>
      <div className="mb-12 p-4 max-w-3xl mx-auto bg-card rounded-sm shadow flex items-center gap-2">
        <AlertCircle className="size-6 text-destructive" />
        <p>
          Non acquistiamo macchinari al di fuori della <span className="font-bold">Regione Lazio</span>.
        </p>
      </div>
    </>
  )
}

export default VendiPage
