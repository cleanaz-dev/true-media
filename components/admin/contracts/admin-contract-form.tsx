"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, X, Users, UserPlus } from "lucide-react";

import { createContractAction } from "@/lib/actions/contracts/create-contract";
import { getAllContractTemplates } from "@/lib/actions/contracts/get-all-templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ContractTemplateOption = Awaited<
  ReturnType<typeof getAllContractTemplates>
>[number];

interface AdminContractFormProps {
  templates: ContractTemplateOption[];
}

const COMMON_ROLE_PRESETS = [
  "Social Media Page Manager",
  "Graphic Designer",
  "Client",
  "Contractor",
  "Athlete",
  "Agent",
  "Advisor",
  "Parent / Guardian",
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Invoking Lambda & Generating..." : "Generate Contract"}
    </Button>
  );
}

export function AdminContractForm({ templates }: AdminContractFormProps) {
  const [roles, setRoles] = useState<string[]>(["Client"]);
  const [roleInput, setRoleInput] = useState("");

  const handleAddRole = (roleToAdd?: string) => {
    const targetRole = (roleToAdd || roleInput).trim();
    if (!targetRole) return;

    if (!roles.includes(targetRole)) {
      setRoles((prev) => [...prev, targetRole]);
    }
    setRoleInput("");
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setRoles((prev) => prev.filter((r) => r !== roleToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Don't submit the entire form
      handleAddRole();
    }
  };

  return (
    <form action={createContractAction} className="max-w-2xl space-y-8">
      {/* Hidden inputs to pass the array to Server Action via formData.getAll("roles") */}
      {roles.map((role) => (
        <input key={role} type="hidden" name="roles" value={role} />
      ))}

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
            placeholder="e.g. Non-Disclosure Agreement (NDA), Sponsorship, Lease, etc."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="templateId">Template Reference (Optional)</Label>
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
              No active templates found — contract will be generated from scratch.
            </p>
          )}
        </div>
      </div>

      {/* Required Signer Roles */}
      <div className="space-y-3 p-4 rounded-lg border bg-muted/20">
        <div className="space-y-1">
          <Label className="flex items-center gap-2 text-sm font-semibold">
            <Users className="w-4 h-4 text-primary" />
            Required Signer Roles
          </Label>
          <p className="text-[0.8rem] text-muted-foreground">
            Define which party slots must sign this contract (e.g. Client, Athlete, Agent).
          </p>
        </div>

        {/* Custom Input + Plus Icon Button */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <UserPlus className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type role name and press Enter (or click +)"
              className="pl-9 text-sm"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={() => handleAddRole()}
            disabled={!roleInput.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[0.75rem] text-muted-foreground mr-1">Presets:</span>
          {COMMON_ROLE_PRESETS.map((preset) => {
            const isSelected = roles.includes(preset);
            return (
              <button
                type="button"
                key={preset}
                onClick={() => (isSelected ? handleRemoveRole(preset) : handleAddRole(preset))}
                className={`text-[0.75rem] px-2 py-0.5 rounded-md border transition-colors ${
                  isSelected
                    ? "bg-primary/10 border-primary/30 text-primary font-medium"
                    : "bg-background hover:bg-muted text-muted-foreground"
                }`}
              >
                + {preset}
              </button>
            );
          })}
        </div>

        {/* Active Roles Tag List */}
        <div className="pt-2">
          <Label className="text-[0.75rem] text-muted-foreground block mb-1.5">
            Active Signing Slots ({roles.length}):
          </Label>
          <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-background rounded-md border">
            {roles.length === 0 ? (
              <span className="text-xs text-muted-foreground italic">
                No roles defined. At least 1 role is recommended.
              </span>
            ) : (
              roles.map((role) => (
                <Badge
                  key={role}
                  variant="secondary"
                  className="gap-1.5 pl-2.5 pr-1.5 py-1 text-xs font-medium"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => handleRemoveRole(role)}
                    className="hover:bg-muted rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))
            )}
          </div>
        </div>
      </div>

      {/* AI Requirements for Lambda */}
      <div className="space-y-2">
        <Label htmlFor="requirements">
          Required Fields / Clauses (For the AI)
        </Label>
        <p className="text-[0.8rem] text-muted-foreground">
          Tell the Lambda exactly what terms or clauses need to be in this contract.
        </p>
        <Textarea
          id="requirements"
          name="requirements"
          required
          rows={7}
          placeholder="Payment is $5,000 upfront. Must include a 12-month non-compete clause..."
          className="resize-none overflow-y-auto"
        />
      </div>

      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}