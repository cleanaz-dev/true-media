// components/admin/contracts/admin-contract-form.tsx
"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { Plus, X } from "lucide-react"

import { createContractAction } from "@/lib/actions/contracts/create-contract"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full sm:w-auto"
    >
      {pending ? "Invoking Lambda & Generating..." : "Generate Contract"}
    </Button>
  )
}

export function AdminContractForm() {
  const [signers, setSigners] = useState([{ name: "", email: "" }])

  const addSigner = () => setSigners([...signers, { name: "", email: "" }])
  const removeSigner = (index: number) => setSigners(signers.filter((_, i) => i !== index))

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
      </div>

      {/* AI Requirements for Lambda */}
      <div className="space-y-2">
        <Label htmlFor="requirements">Required Fields / Clauses (For the AI)</Label>
        <p className="text-[0.8rem] text-muted-foreground">
          Tell the Lambda exactly what needs to be in this contract.
        </p>
        <Textarea 
          id="requirements"
          name="requirements" 
          required
          rows={5}
          placeholder="Jurisdiction is Texas. Payment is $5,000 upfront. Must include a 12-month non-compete clause..."
          className="resize-none"
        />
      </div>

      {/* Signers */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Signers</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addSigner}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Signer
          </Button>
        </div>
        
        <div className="space-y-3">
          {signers.map((_, index) => (
            <div key={index} className="flex gap-3 items-center">
              <Input 
                type="text" 
                name={`signers[${index}].name`} 
                required 
                placeholder="Name" 
                className="flex-1"
              />
              <Input 
                type="email" 
                name={`signers[${index}].email`} 
                required 
                placeholder="Email" 
                className="flex-1"
              />
              {index > 0 && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => removeSigner(index)}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  )
}