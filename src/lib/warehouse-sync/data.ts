'use server'
import { PassThrough } from 'stream'
import { WarehouseArticle } from './types'
import { Client } from 'basic-ftp'
import convert from 'xml-js'

export async function getWarehouseArticles(): Promise<WarehouseArticle[]> {
  const client = new Client()
  client.ftp.verbose = false
  await client.access({
    host: '82.145.98.160',
    user: 'lassistenza',
    password: '*AsSi!2024_p',
  })

  const myWritableStream = new PassThrough()

  await client.downloadTo(myWritableStream, 'compatta.xml')

  return new Promise((resolve, reject) => {
    let data = ''

    myWritableStream.on('data', (chunk) => {
      data += chunk
    })

    myWritableStream.on('end', () => {
      try {
        const stringValue = convert.xml2json(data, {
          compact: true,
          spaces: 2,
          ignoreDeclaration: true,
        })

        const result = JSON.parse(stringValue)
        resolve(result.Compatta?.Articoli?.Articolo)
      } catch (error) {
        reject(error)
      }
    })

    myWritableStream.on('error', (error) => {
      reject(error)
    })
  })
}
