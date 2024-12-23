'use client'
import { useFormContext } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form'
import { Input } from './input'
import { Checkbox } from './checkbox'
import { cn } from '@/lib/utils'
import { Textarea } from './textarea'
import { HTMLInputTypeAttribute } from 'react'

type FormFieldProps = {
  name: string
  label?: string
  placeholder?: string
  description?: string | React.ReactNode
  type?: HTMLInputTypeAttribute
  disabled?: boolean
  className?: string
}

function FormFieldInput(props: FormFieldProps) {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name={props.name}
      disabled={props.disabled}
      render={({ field }) => (
        <FormItem className="w-full">
          {props.label && <FormLabel>{props.label}</FormLabel>}
          <FormControl>
            <Input placeholder={props.placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function FormFieldCheckBox(props: FormFieldProps) {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={props.disabled}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            {props.label && <FormLabel className="text-sm">{props.label}</FormLabel>}
            {props.description && <FormDescription>{props.description}</FormDescription>}
          </div>
        </FormItem>
      )}
    />
  )
}

function FormFieldTextArea(props: FormFieldProps) {
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          {props.label && <FormLabel>{props.label}</FormLabel>}
          <FormControl>
            <Textarea
              placeholder={props.placeholder}
              className={cn('resize-none', props.className)}
              {...field}
            />
          </FormControl>
          {props.description && <FormDescription>{props.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export const FormFields = {
  Input: FormFieldInput,
  Checkbox: FormFieldCheckBox,
  TextArea: FormFieldTextArea,
}
