import { cn } from "@/lib/utils"
import { DetailedHTMLProps, HTMLAttributes } from "react"

export const Section = ({
   className,
   ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) => {
   return <section {...props} className={cn("py-16", className)} />
}
