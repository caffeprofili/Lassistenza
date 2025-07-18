import { SellMachineFormSchema } from '@/components/modules/contact/schema'
import { sendMail } from '@/lib/mailjet'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = (await request.json()) as unknown
  const result = SellMachineFormSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json({
      success: false,
      errors: result.error.flatten(),
    })
  }

  const { nome, cognome, email, telefono, messaggio, attachments } = result.data

  try {
    await sendMail({
      subject: 'Richiesta vendita macchinario - Assistenza Usato',
      to: 'ordini@lassistenza.net',
      html: `
      <p>Tramite: "Modulo Vendita Macchinario"</p>
      <br/>
      <p>Nome: ${nome}</p>
      <p>Cognome: ${cognome}</p>
      <p>Email: ${email}</p>
      <p>Telefono: ${telefono ?? '-'}</p>
      <br/>
      <p>Messaggio:</p>
      <p>${messaggio}</p>
    `,
      attachments,
    })

    return NextResponse.json({ success: true, errors: null })
  } catch (err: any) {
    return NextResponse.json({ success: false, errors: err?.message })
  }
}
