import { Children } from "react"

type EachProps<T> = {
   render: (item: T, index?: number | keyof T) => React.ReactNode
   of: T[]
   key?: keyof T
}
export const Each = <T extends Record<string, unknown>>({
   render,
   of,
   key,
}: EachProps<T>) => {
   return Children.toArray(of.map((item, index) => render(item, key ?? index)))
}
