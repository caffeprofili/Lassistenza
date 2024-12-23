import { ContactFormSchema } from '@/components/modules/contact/schema'
import { sendMail } from '@/lib/mailjet'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = (await request.json()) as unknown
  const result = ContactFormSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json({
      success: false,
      errors: result.error.flatten(),
    })
  }

  const { nome, cognome, email, telefono, messaggio } = result.data

  try {
    await sendMail({
      subject: 'Richiesta di Contatto - Assistenza Usato',
      to: 'info@lassistenza.net',
      html: `
      <p>Tramite: "Modulo di Contatto"</p>
      <br/>
      <p>Nome: ${nome}</p>
      <p>Cognome: ${cognome}</p>
      <p>Email: ${email}</p>
      <p>Telefono: ${telefono ?? '-'}</p>
      <p>Messaggio:</p>
      <p>${messaggio}</p>
    `,
    })

    return NextResponse.json({ success: true, errors: null })
  } catch (err: any) {
    return NextResponse.json({ success: false, errors: err?.message })
  }
}
