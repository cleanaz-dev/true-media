"use client";

import { useState } from "react";
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
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import InviteSigneeEmail from "@/lib/email/templates/invite-signee-email";
import { inviteSignee } from "@/lib/actions/contracts/invite-signee";

interface InviteSigneesDrawerProps {
  contractId: string;
}

export function InviteSigneesDrawer({ contractId }: InviteSigneesDrawerProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");


const handleInvite = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email) return;

  try {
    setLoading(true);

    // Call the server action with contractId, email, name
    await inviteSignee({ contractId, email, name });

    toast.success(`Invite sent to ${email}`);
    setEmail("");
    setName("");
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
      {/* Base UI uses the `render` prop instead of `asChild` */}
      <DrawerTrigger
        render={
          <Button className="gap-2">
            <UserPlus className="w-4 h-4" />
            Invite Signees
          </Button>
        }
      />

      <DrawerContent className="max-w-lg mx-auto">
        <form onSubmit={handleInvite}>
          <DrawerHeader>
            <DrawerTitle>Invite Signee</DrawerTitle>
            <DrawerDescription>
              Send a secure signature request link to the recipient.
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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