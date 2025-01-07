'use client'
import { cn } from '@/lib/utils'
import { syncWarehouseProducts } from '@/lib/warehouse-sync'
import { Button } from '@payloadcms/ui'
import { RotateCcwIcon } from 'lucide-react'
import { useTransition } from 'react'

export function WarehouseSyncButton() {
  const [isPending, startTransition] = useTransition()

  async function sync() {
    startTransition(async () => {
      const { uploadResponse } = await syncWarehouseProducts()
      console.log(uploadResponse)
    })
  }

  return (
    <div className="flex justify-end">
      <Button onClick={sync} disabled={isPending}>
        <RotateCcwIcon className={cn('size-4 mr-2', { 'animate-spin': isPending })} />
        Sincronizza
      </Button>
    </div>
  )
}
