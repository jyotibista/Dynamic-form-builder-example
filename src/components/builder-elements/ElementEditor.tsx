import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { FormElement } from '@/types/formBuilder'

interface ElementEditorProps {
  element: FormElement
  updateElement: (id: string, updates: Partial<FormElement>) => void
  setEditingElement: (element: FormElement | null) => void
}

interface Option {
  label: string;
  value: string | number;
}

export default function ElementEditor({
  element,
  updateElement,
  setEditingElement,
}: ElementEditorProps) {
  const handleChange = (field: keyof FormElement, value: string | number | boolean | Option[]) => {
    updateElement(element.id, { [field]: value })
  }

  const [newOptionLabel, setNewOptionLabel] = useState<string>('');
  const [newOptionValue, setNewOptionValue] = useState<string>('');

  const handleAddOption = () => {
    if (newOptionLabel && newOptionValue && element.options) {
      const newOption: Option = { label: newOptionLabel, value: newOptionValue };
      handleChange('options', [...element.options, newOption]);
      setNewOptionLabel('');
      setNewOptionValue('');
    }
  };

  const handleRemoveOption = (index: number) => {
    if (element.options) {
      const updatedOptions = [...element.options];
      updatedOptions.splice(index, 1);
      handleChange('options', updatedOptions);
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor={`${element.id}-label`}>Label</Label>
          <Input
            id={`${element.id}-label`}
            value={element.label}
            onChange={(e) => handleChange('label', e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id={`${element.id}-required`}
            checked={element.required}
            onCheckedChange={(checked) => handleChange('required', checked)}
          />
          <Label htmlFor={`${element.id}-required`}>Required</Label>
        </div>
        {(element.type === 'select' || element.type === 'radio' || element.type === 'checkbox') && (
          <div>
            <Label>Options</Label>
            {element.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <Input
                  value={option.label}
                  onChange={(e) => {
                    if (element.options) {
                      const updatedOptions = [...element.options];
                      updatedOptions[index].label = e.target.value;
                      handleChange('options', updatedOptions);
                    }
                  }}
                />
                <Input
                  value={option.value.toString()}
                  onChange={(e) => {
                    if (element.options) {
                      const updatedOptions = [...element.options];
                      updatedOptions[index].value = e.target.value;
                      handleChange('options', updatedOptions);
                    }
                  }}
                />
                <Button type="button" size="icon" onClick={() => handleRemoveOption(index)}>
                  -
                </Button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Option Label"
                value={newOptionLabel}
                onChange={(e) => setNewOptionLabel(e.target.value)}
              />
              <Input
                placeholder="Option Value"
                value={newOptionValue}
                onChange={(e) => setNewOptionValue(e.target.value)}
              />
              <Button type="button" onClick={handleAddOption}>
                Add Option
              </Button>
            </div>
          </div>
        )}

        {(element.type === 'text' || element.type === 'textarea' || element.type === 'email') && (
          <>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor={`${element.id}-minLength`}>Min Length</Label>
              <Input
                id={`${element.id}-minLength`}
                type="number"
                value={element.minLength || ''}
                onChange={(e) => handleChange('minLength', e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor={`${element.id}-maxLength`}>Max Length</Label>
              <Input
                id={`${element.id}-maxLength`}
                type="number"
                value={element.maxLength || ''}
                onChange={(e) => handleChange('maxLength', e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>

          </>
        )}
        {element.type === 'slider' && (
          <>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor={`${element.id}-min`}>Min Value</Label>
              <Input
                id={`${element.id}-min`}
                type="number"
                value={element.min || ''}
                onChange={(e) => handleChange('min', e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor={`${element.id}-max`}>Max Value</Label>
              <Input
                id={`${element.id}-max`}
                type="number"
                value={element.max || ''}
                onChange={(e) => handleChange('max', e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor={`${element.id}-step`}>Step</Label>
              <Input
                id={`${element.id}-step`}
                type="number"
                value={element.step || ''}
                onChange={(e) => handleChange('step', e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
          </>
        )}
        <Button onClick={() => setEditingElement(null)}>Done</Button>
      </CardContent>
    </Card>
  )
}

