'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PlusCircle, LayoutGrid, Eye, Code, GripVertical, Trash2, Edit } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import FormPreview from './FormPreview'
import CodeGenerator from './CodeGenerator'
import ElementEditor from './ElementEditor'
import { ElementType, FormElement, Layout } from '@/types/formBuilder'
import SortableElement from './SortableElement'

const initialElements: FormElement[] = [
    { id: 'input-1684761600000', type: 'text', label: 'Name', required: true },
    { id: 'input-1684761600001', type: 'email', label: 'Email', required: true },
    { id: 'input-1684761600002', type: 'textarea', label: 'Message', required: false },
]

export default function FormBuilder() {
    const [elements, setElements] = useState<FormElement[]>(initialElements)
    const [layout, setLayout] = useState<Layout>('responsive')
    const [activeTab, setActiveTab] = useState('editor')
    const [editingElement, setEditingElement] = useState<FormElement | null>(null)



    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = elements.findIndex((item) => item.id === active.id);
            const newIndex = elements.findIndex((item) => item.id === over?.id);

            const updatedElements = [...elements];
            const [movedItem] = updatedElements.splice(oldIndex, 1);
            updatedElements.splice(newIndex, 0, movedItem);
            setElements(updatedElements);
        }
    };

    const addElement = useCallback((type: ElementType) => {
        const newElement: FormElement = {
            id: `input-${Date.now()}`,
            type,
            label: `New ${type} input`,
            required: false,
        }

        if (type === 'radio' || type === 'checkbox' || type === 'select' || type === 'combobox') {
            newElement.options = [
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
            ]
        }

        setElements((prevElements) => [...prevElements, newElement])
    }, [])

    const removeElement = useCallback((id: string) => {
        setElements((prevElements) => prevElements.filter((element) => element.id !== id))
        if (editingElement && editingElement.id === id) {
            setEditingElement(null)
        }
    }, [editingElement])

    const updateElement = useCallback((id: string, updates: Partial<FormElement>) => {
        setElements((prevElements) =>
            prevElements.map((element) =>
                element.id === id ? { ...element, ...updates } : element
            )
        )
        setEditingElement((prevEditingElement) =>
            prevEditingElement && prevEditingElement.id === id
                ? { ...prevEditingElement, ...updates }
                : prevEditingElement
        )
    }, [])

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <h1 className="text-3xl font-bold mb-6 text-center">Form Builder</h1>
            <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
                <Select value={layout} onValueChange={(value: Layout) => setLayout(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select layout" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="responsive">Responsive</SelectItem>
                        <SelectItem value="1">One Column</SelectItem>
                        <SelectItem value="2">Two Columns</SelectItem>
                        <SelectItem value="3">Three Columns</SelectItem>
                        <SelectItem value="4">Four Columns</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2">
                    {(['text', 'email', 'textarea', 'file', 'location', 'datetime', 'slider', 'checkbox', 'radio', 'select'] as const).map((type) => (
                        <Button key={type} onClick={() => addElement(type)} variant="outline" size="sm">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Button>
                    ))}
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="editor">
                        <LayoutGrid className="w-4 h-4 mr-2" />
                        Editor
                    </TabsTrigger>
                    <TabsTrigger value="preview">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </TabsTrigger>
                    <TabsTrigger value="code">
                        <Code className="w-4 h-4 mr-2" />
                        Code
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="editor" className="border-none p-0">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Form Elements</h2>
                            <DndContext onDragEnd={handleDragEnd}>
                                <SortableContext items={elements.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                                    {elements.map((element) => (
                                        <SortableElement
                                            key={element.id}
                                            id={element.id}
                                            element={element}
                                            updateElement={updateElement}
                                            setEditingElement={setEditingElement}
                                            removeElement={removeElement}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Element Editor</h2>
                            {editingElement && (
                                <ElementEditor
                                    key={editingElement.id}
                                    element={editingElement}
                                    updateElement={updateElement}
                                    setEditingElement={setEditingElement}
                                />
                            )}
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="preview" className="border-none p-0">
                    <FormPreview elements={elements} layout={layout} />
                </TabsContent>
                <TabsContent value="code" className="border-none p-0">
                    <CodeGenerator elements={elements} layout={layout} />
                </TabsContent>
            </Tabs>
        </div>
    )
}