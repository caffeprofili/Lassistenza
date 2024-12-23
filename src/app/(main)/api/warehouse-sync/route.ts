import { syncWarehouseProducts } from '@/lib/warehouse-sync'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 0

export async function POST(req: NextRequest) {
  const accessKey = req.headers.get('X-Access-Key')
  if (!accessKey || accessKey !== process.env.UPLOAD_PRODUCTS_ACCESS_KEY)
    return NextResponse.json({ status: 'unauthorized' })
  const { uploadResponse } = await syncWarehouseProducts()
  return NextResponse.json(uploadResponse)
}
