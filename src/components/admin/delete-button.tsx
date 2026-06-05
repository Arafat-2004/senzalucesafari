'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export function DeleteButton() {
  return (
    <Button
      variant="destructive"
      size="sm"
      className="flex items-center gap-2"
    >
      <Trash2 className="w-4 h-4" />
      Delete
    </Button>
  );
}