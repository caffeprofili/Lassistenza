import { RequestProductInfoFormSchema } from '@/components/modules/contact/schema'
import { sendMail } from '@/lib/mailjet'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = (await request.json()) as unknown
  const result = RequestProductInfoFormSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json({
      success: false,
      errors: result.error.flatten(),
    })
  }

  const { nome, cognome, email, telefono, messaggio, codice_prodotto, nome_prodotto } = result.data

  try {
    await sendMail({
      subject: 'Richiesta informazioni prodotto - Assistenza Usato',
      to: 'info@lassistenza.net',
      html: `
      <p>Tramite: "Richiesta informazioni prodotto"</p>
      <br/>
      <p>PRODOTTO: ${nome_prodotto}</p>
      <p>CODICE PRODOTTO: ${codice_prodotto}</p>
      <p>Nome: ${nome}</p>
      <p>Cognome: ${cognome}</p>
      <p>Email: ${email}</p>
      <p>Telefono: ${telefono ?? '-'}</p>
      <br/>
      <p>Messaggio:</p>
      <p>${messaggio}</p>
    `,
    })

    return NextResponse.json({ success: true, errors: null })
  } catch (err: any) {
    return NextResponse.json({ success: false, errors: err?.message })
  }
}
