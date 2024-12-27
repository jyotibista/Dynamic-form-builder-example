import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { FormElement, Layout } from '@/types/formBuilder'

import { getGridClass } from '@/helpers/helper'
import { log } from 'console'


interface FormPreviewProps {
    elements: FormElement[]
    layout: Layout
}

export default function FormPreview({ elements, layout }: FormPreviewProps) {
    const [formData, setFormData] = useState<Record<string, string | number | string[]>>({})
    const [errors, setErrors] = useState<Record<string, string>>({})
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newErrors: Record<string, string> = {}

        elements.forEach((element) => {
            const value = formData[element.id]
            if (element.required && !value) {
                newErrors[element.id] = 'This field is required'
            } else if (element.minLength && typeof value === 'string' && value.length < element.minLength) {
                newErrors[element.id] = `Minimum length is ${element.minLength}`
            } else if (element.maxLength && typeof value === 'string' && value.length > element.maxLength) {
                newErrors[element.id] = `Maximum length is ${element.maxLength}`
            } else if (element.min !== undefined && typeof value === 'number' && value < element.min) {
                newErrors[element.id] = `Minimum value is ${element.min}`
            } else if (element.max !== undefined && typeof value === 'number' && value > element.max) {
                newErrors[element.id] = `Maximum value is ${element.max}`
            }
        })

        setErrors(newErrors)
        if (Object.keys(newErrors).length === 0) {
            console.log('Form submitted:', formData)
            toast.success(`Form submitted successfully! ${JSON.stringify(formData)}`)
        }
    }

    const handleChange = (id: string, value: string | number | string[]) => {
        setFormData((prev) => ({ ...prev, [id]: value }))
    }

    const renderFormElement = (element: FormElement) => {
        switch (element.type) {
            case 'text':
            case 'email':
            case 'phone':
                return (
                    <Input
                        id={element.id}
                        type={element.type === 'phone' ? 'tel' : element.type}
                        value={formData[element.id] as string || ''}
                        onChange={(e) => handleChange(element.id, e.target.value)}
                        placeholder={element.placeholder || `Enter ${element.label.toLowerCase()}`}
                    />
                )
            case 'textarea':
                return (
                    <Textarea
                        id={element.id}
                        value={formData[element.id] as string || ''}
                        onChange={(e) => handleChange(element.id, e.target.value)}
                        placeholder={element.placeholder || `Enter ${element.label.toLowerCase()}`}
                    />
                )
            case 'file':
                return (
                    <Input
                        id={element.id}
                        type="file"
                        onChange={(e) => handleChange(element.id, e.target.value)}
                    />
                )
            case 'location':
                return (
                    <Input
                        id={element.id}
                        type="text"
                        value={formData[element.id] as string || ''}
                        onChange={(e) => handleChange(element.id, e.target.value)}
                        placeholder={element.placeholder || "Enter location"}
                    />
                )
            case 'datetime':
                return (
                    <Input
                        id={element.id}
                        type="datetime-local"
                        value={formData[element.id] as string || ''}
                        onChange={(e) => handleChange(element.id, e.target.value)}
                    />
                )
            case 'slider':
                return (
                    <Slider
                        id={element.id}
                        min={element.min || 0}
                        max={element.max || 100}
                        step={element.step || 1}
                        value={[formData[element.id] as number || 0]}
                        onValueChange={(value) => handleChange(element.id, value[0])}
                    />
                )
            case 'radio':
                return (
                    <RadioGroup
                        value={formData[element.id] as string}
                        onValueChange={(value) => handleChange(element.id, value)}
                    >
                        {element.options?.map((option) => (
                            <div className="flex items-center space-x-2" key={option.value}>
                                <RadioGroupItem value={option.value} id={`${element.id}-${option.value}`} checked={formData[element.id] as string === option.value as string} />
                                <Label htmlFor={`${element.id}-${option.value}`}>{option.label}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                )
            case 'checkbox':
                return (
                    <div className="space-y-2">
                        {element.options?.map((option) => (
                            <div className="flex items-center space-x-2" key={option.value}>
                                <Checkbox
                                    id={`${element.id}-${option.value}`}
                                    checked={(formData[element.id] as string[] || []).includes(option.value)}
                                    onCheckedChange={(checked) => {
                                        const currentValues = formData[element.id] as string[] || []
                                        const newValues = checked
                                            ? [...currentValues, option.value]
                                            : currentValues.filter((v) => v !== option.value)
                                        handleChange(element.id, newValues)
                                    }}
                                />
                                <Label htmlFor={`${element.id}-${option.value}`}>{option.label}</Label>
                            </div>
                        ))}
                    </div>
                )
            case 'select':
            case 'combobox':
                return (
                    <Select
                        value={formData[element.id] as string}
                        onValueChange={(value) => handleChange(element.id, value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={`Select ${element.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {element.options?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )
            default:
                return null
        }
    }



    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Form Preview</CardTitle>
            </CardHeader>
            <CardContent>
                <form ref={formRef} onSubmit={handleSubmit} className={`grid gap-4 ${getGridClass(layout)}`}>
                    {elements.map((element) => (
                        <div key={element.id} className="flex flex-col space-y-1.5">
                            <Label htmlFor={element.id}>{element.label}</Label>
                            {renderFormElement(element)}
                            {errors[element.id] && <p className="text-red-500 text-sm">{errors[element.id]}</p>}
                        </div>
                    ))}

                </form>
                <Button
                    type="submit"
                    className="mt-4"
                    onClick={() => formRef.current?.requestSubmit()}
                >
                    Submit
                </Button>
            </CardContent>
        </Card>
    )
}

