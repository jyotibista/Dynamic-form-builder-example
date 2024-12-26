import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormElement } from '@/types/formBuilder';


import { Edit, GripVertical, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';


interface SortableElementProps {
    id: string;
    element: FormElement;
    updateElement: (id: string, updates: Partial<FormElement>) => void;
    setEditingElement: (element: FormElement | null) => void;
    removeElement: (id: string) => void;
}

const SortableElement: React.FC<SortableElementProps> = ({ id, element, setEditingElement, removeElement }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    if (!element) return null;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Card>
                <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                        <GripVertical className="mr-2" {...attributes} {...listeners} />
                        <span>{element.label}</span>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditingElement(element);
                            }}
                        >
                            <Edit />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeElement(element.id);
                            }}
                        >
                            <Trash2 />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SortableElement;
