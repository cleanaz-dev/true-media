"use client";

import { useState, useMemo } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { inviteSignee } from "@/lib/actions/contracts/invite-signee";

interface InviteSigneesDrawerProps {
  contractId: string;
  availableRoles?: string[]; // 💡 Pass contract.roles here
}

export function InviteSigneesDrawer({
  contractId,
  availableRoles = ["Client", "Contractor", "Athlete", "Agent"],
}: InviteSigneesDrawerProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState(availableRoles[0] || "Client");

  // Base UI's Select needs an `items` array ({ label, value }) so SelectValue
  // can resolve the displayed label itself, instead of reading it off the
  // matching SelectItem's children the way Radix used to.
  const roleItems = useMemo(
    () => availableRoles.map((r) => ({ label: r, value: r })),
    [availableRoles]
  );

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name.trim()) {
      toast.error("Please provide both name and email.");
      return;
    }

    try {
      setLoading(true);

      // Call the server action with contractId, email, name, role
      await inviteSignee({
        contractId,
        email: email.trim(),
        name: name.trim(),
        role,
      });

      toast.success(`Invitation sent to ${name} (${email})`);
      setEmail("");
      setName("");
      setRole(availableRoles[0] || "Client");
      setOpen(false);
    } catch (err) {
      console.error("Invite error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to send invite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        render={
          <Button className="gap-2">
            <UserPlus className="w-4 h-4" />
            Invite Signee
          </Button>
        }
      />

      <DrawerContent className="max-w-lg mx-auto">
        <form onSubmit={handleInvite}>
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Invite Signee
            </DrawerTitle>
            <DrawerDescription>
              Personalizes the contract preamble and sends a secure signature request link.
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 space-y-4">
            {/* 1. Full Legal Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Legal Name *</Label>
              <Input
                id="name"
                required
                placeholder="e.g. John Michael Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* 2. Email Address */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* 3. Signing Role Slot */}
            <div className="space-y-1.5">
              <Label htmlFor="role">Signer Role Slot *</Label>
              <Select
                items={roleItems}
                value={role}
                onValueChange={(value) => setRole(value as string)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role slot" />
                </SelectTrigger>
                <SelectContent>
                  {roleItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[0.75rem] text-muted-foreground">
                This role is injected into the preamble and signature line for this person.
              </p>
            </div>
          </div>

          <DrawerFooter className="flex-row justify-end gap-2">
            <DrawerClose
              render={
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              }
            />
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Invitation
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}