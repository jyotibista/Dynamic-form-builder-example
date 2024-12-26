import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormElement, Layout } from '@/types/formBuilder'

interface CodeGeneratorProps {
  elements: FormElement[]
  layout: Layout
}

export default function CodeGenerator({ elements, layout }: CodeGeneratorProps) {
  const generateCode = () => {
    const imports = `import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Combobox } from '@/components/ui/combobox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'`

    const schema = `const formSchema = z.object({
${elements
        .map((element) => {
          let validation = `z.string()`
          if (element.required) {
            validation += `.min(1, { message: "Required" })`
          } else {
            validation += `.optional()`
          }
          if (element.minLength) {
            validation += `.min(${element.minLength}, { message: "Minimum length is ${element.minLength}" })`
          }
          if (element.maxLength) {
            validation += `.max(${element.maxLength}, { message: "Maximum length is ${element.maxLength}" })`
          }
          if (element.type === 'email') {
            validation += `.email("Invalid email address")`
          }
          if (element.type === 'phone') {
            validation += `.regex(/^\\+?[1-9]\\d{1,14}$/, { message: "Invalid phone number" })`
          }
          if (element.type === 'slider') {
            validation = `z.number()`
            if (element.min !== undefined) {
              validation += `.min(${element.min}, { message: "Minimum value is ${element.min}" })`
            }
            if (element.max !== undefined) {
              validation += `.max(${element.max}, { message: "Maximum value is ${element.max}" })`
            }
          }
          if (element.type === 'checkbox') {
            validation = `z.array(z.string()).min(1, { message: "Select at least one option" })`
          }
          return `${element.id.replace('-', '_')}: ${validation}`
        })
        .join(',\n  ')}
})`

    const component = `
export default function GeneratedForm() {
const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    ${elements.map((element) => {
      if (element.type === 'slider') {
        return `${element.id.replace('-', '_')}: ${element.min || 0}`
      } else if (element.type === 'checkbox') {
        return `${element.id.replace('-', '_')}: []`
      } else {
        return `${element.id.replace('-', '_')}: ""`
      }
    }).join(',\n    ')}
  },
})

function onSubmit(values: z.infer<typeof formSchema>) {
  console.log(values)
}

return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 ${layout === '4' ? 'sm:grid-cols-2' : 'grid-cols-1'}">
      ${elements
        .map(
          (element) => `
      <FormField
        control={form.control}
        name="${element.id.replace('-', '_')}"
        render={({ field }) => (
          <FormItem>
            <FormLabel>${element.label}</FormLabel>
            <FormControl>
              ${(() => {
              switch (element.type) {
                case 'textarea':
                  return '<Textarea {...field} placeholder="${element.placeholder || ""}" />'
                case 'file':
                  return '<Input type="file" {...field} value={field.value || ""} />'
                case 'location':
                  return '<Input {...field} placeholder="${element.placeholder || "Enter location"}" />'
                case 'datetime':
                  return '<Input type="datetime-local" {...field} />'
                case 'slider':
                  return `<Slider min={${element.min || 0}} max={${element.max || 100}} step={${element.step || 1}} value={[field.value]} onValueChange={(value) => field.onChange(value[0])} />`
                case 'radio':
                  return `<RadioGroup onValueChange={field.onChange} defaultValue={field.value}>${element.options?.map(option => `<div className="flex items-center space-x-2"><RadioGroupItem value="${option.value}" id="${element.id}-${option.value}" /><FormLabel htmlFor="${element.id}-${option.value}">${option.label}</FormLabel></div>`).join('\n                ')}</RadioGroup>`
                case 'checkbox':
                  return `<div className="space-y-2">${element.options?.map(option => `<div className="flex items-center space-x-2"><Checkbox id="${element.id}-${option.value}" checked={field.value?.includes('${option.value}')} onCheckedChange={(checked) => { return checked ? field.onChange([...field.value, '${option.value}']) : field.onChange(field.value?.filter((value) => value !== '${option.value}')) }} /><FormLabel htmlFor="${element.id}-${option.value}">${option.label}</FormLabel></div>`).join('\n                ')}</div>`
                default:
                  return `<Input type="${element.type}" {...field} placeholder="${element.placeholder || ""}" />`
              }
            })()}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />`
        )
        .join('')}
      <Button type="submit">Submit</Button>
    </form>
  </Form>
)
}`

    return `${imports}\n\n${schema}\n\n${component}`
  }

  return (
    <Card className="mt-4 max-w-full lg:max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle>Generated Code</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
          <code className="text-sm whitespace-pre-wrap">{generateCode()}</code>
        </pre>
      </CardContent>
    </Card>
  )
}
