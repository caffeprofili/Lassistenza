import Mailjet from 'node-mailjet'

export const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC || 'public-api-key',
  process.env.MJ_APIKEY_PRIVATE || 'private-api-key',
  {
    config: {},
    options: {},
  },
)

type SendMailParams = {
  to: string | string[]
  subject: string
  html: string
  attachments?: {
    ContentType: string
    Filename: string
    Base64Content: string
  }[]
}
export async function sendMail({ to, subject, html, attachments }: SendMailParams) {
  return mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'ordini@lassistenzausato.net',
          Name: "Sito Web - L'Assistenza",
        },
        To: Array.isArray(to) ? to.map((addr) => ({ Email: addr })) : [{ Email: to }],
        Subject: subject,
        HTMLPart: html,
        Attachments: attachments,
      },
    ],
  })
}
