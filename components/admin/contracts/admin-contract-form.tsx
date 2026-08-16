// components/admin/contracts/admin-contract-form.tsx
"use client";

import { useFormStatus } from "react-dom";

import { createContractAction } from "@/lib/actions/contracts/create-contract";
import { getAllContractTemplates } from "@/lib/actions/contracts/get-all-templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Exact payload shape returned by the query — stays in sync automatically
// if the select clause in getAllContractTemplates changes.
export type ContractTemplateOption = Awaited<
  ReturnType<typeof getAllContractTemplates>
>[number];

interface AdminContractFormProps {
  templates: ContractTemplateOption[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Invoking Lambda & Generating..." : "Generate Contract"}
    </Button>
  );
}

export function AdminContractForm({ templates }: AdminContractFormProps) {
  return (
    <form action={createContractAction} className="max-w-2xl space-y-8">
      {/* Basic Details */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Contract Title</Label>
          <Input
            id="title"
            type="text"
            name="title"
            required
            placeholder="e.g. Freelance Web Dev Agreement"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contractType">Contract Type</Label>
          <Input
            id="contractType"
            type="text"
            name="contractType"
            required
            placeholder="e.g. Non-Disclosure Agreement (NDA), Lease, etc."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="templateId">Template</Label>
          <Select name="templateId">
            <SelectTrigger id="templateId">
              <SelectValue placeholder="Select a template (optional)" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {templates.length === 0 && (
            <p className="text-[0.8rem] text-muted-foreground">
              No active templates found — the contract will be generated from
              scratch based on the requirements below.
            </p>
          )}
        </div>
      </div>

      {/* AI Requirements for Lambda */}
      <div className="space-y-2">
        <Label htmlFor="requirements">
          Required Fields / Clauses (For the AI)
        </Label>
        <p className="text-[0.8rem] text-muted-foreground">
          Tell the Lambda exactly what needs to be in this contract.
        </p>
        <Textarea
          id="requirements"
          name="requirements"
          required
          rows={8}
          placeholder="Jurisdiction is Texas. Payment is $5,000 upfront. Must include a 12-month non-compete clause..."
          className="resize-none max-h-64 overflow-y-auto"
        />
      </div>

      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}