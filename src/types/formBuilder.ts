export type ElementType = 'text' | 'email' | 'textarea' | 'file' | 'location' | 'datetime' | 'slider' | 'radio' | 'checkbox' | 'select' | 'combobox' | 'phone'

export interface ElementOption {
    label: string
    value: string
}

export interface FormElement {
    id: string
    type: ElementType
    label: string
    required: boolean
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    step?: number
    options?: ElementOption[]
    placeholder?: string
}

export type Layout = '1' | '2' | '3' | '4' | 'responsive'



