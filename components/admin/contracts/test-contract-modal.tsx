// app/admin/contracts/test-contract-modal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TestContractModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TestContractModal({
  open,
  onOpenChange,
}: TestContractModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Test Modal</DialogTitle>
          <DialogDescription>
            This is a minimal modal to test the Dialog component.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            If you can see this, the Dialog is working.
          </p>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
