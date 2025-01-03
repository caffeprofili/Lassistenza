'use client'
import { cn } from '@/lib/utils'
import { Button } from '@payloadcms/ui'
import { RotateCcwIcon } from 'lucide-react'
import { useTransition } from 'react'

export function WarehouseSyncButton() {
  const [isPending, startTransition] = useTransition()

  async function sync() {
    startTransition(async () => {
      const response = await fetch('/api/warehouse-sync', {
        method: 'POST',
      })
      const data = await response.json()
      console.log(data)
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
