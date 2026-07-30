"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { updateAdminSettings } from "@/lib/actions/update-admin-settings";
import { AdminSettings } from "@/lib/generated/prisma/client";

interface AdminSettingsPageProps {
  adminSettings: AdminSettings | null;
}

export function AdminSettingsPage({ adminSettings }: AdminSettingsPageProps) {
  const [loading, setLoading] = useState(false);

  // Initialize form with database values or safe defaults
  const [formData, setFormData] = useState({
    businessName: adminSettings?.businessName || "",
    supportEmail: adminSettings?.supportEmail || "",
    supportPhone: adminSettings?.supportPhone || "",
    enableStripe: adminSettings?.enableStripe ?? true,
    enableCash: adminSettings?.enableCash ?? true,
    enableEtransfer: adminSettings?.enableEtransfer ?? true,
    eTransferEmail: adminSettings?.eTransferEmail || "",
    eTransferInstructions: adminSettings?.eTransferInstructions || "",
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateAdminSettings(formData);
      alert("Settings saved successfully!"); 
    } catch (error) {
      console.error(error);
      alert("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Platform Settings</h2>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="team">Team (Admins)</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* GENERAL SETTINGS */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Configure the contact info shown to tenants.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input 
                  id="businessName" 
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input 
                    id="supportEmail" 
                    type="email"
                    value={formData.supportEmail}
                    onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input 
                    id="supportPhone" 
                    value={formData.supportPhone}
                    onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PAYMENT SETTINGS */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Enable or disable payment providers globally.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Credit Card (Stripe)</Label>
                    <p className="text-sm text-muted-foreground">Allow users to pay online via Stripe.</p>
                  </div>
                  <Switch 
                    checked={formData.enableStripe} 
                    onCheckedChange={(checked) => setFormData({ ...formData, enableStripe: checked })}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Cash / In-Person</Label>
                    <p className="text-sm text-muted-foreground">Allow users to reserve now and pay on arrival.</p>
                  </div>
                  <Switch 
                    checked={formData.enableCash} 
                    onCheckedChange={(checked) => setFormData({ ...formData, enableCash: checked })}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">E-Transfer</Label>
                    <p className="text-sm text-muted-foreground">Allow users to pay via Interac E-Transfer.</p>
                  </div>
                  <Switch 
                    checked={formData.enableEtransfer} 
                    onCheckedChange={(checked) => setFormData({ ...formData, enableEtransfer: checked })}
                  />
                </div>
              </div>

              {formData.enableEtransfer && (
                <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
                  <div className="space-y-2">
                    <Label htmlFor="eTransferEmail">E-Transfer Email Address</Label>
                    <Input 
                      id="eTransferEmail" 
                      value={formData.eTransferEmail}
                      onChange={(e) => setFormData({ ...formData, eTransferEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eTransferInstructions">Checkout Instructions</Label>
                    <Textarea 
                      id="eTransferInstructions" 
                      rows={4}
                      value={formData.eTransferInstructions}
                      onChange={(e) => setFormData({ ...formData, eTransferInstructions: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TEAM SETTINGS */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>Manage staff who have access to this dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add an "Invite Admin" button and a list of Users where role === 'ADMIN' */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* INTEGRATIONS SETTINGS */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hapio & Stripe</CardTitle>
              <CardDescription>Manage external provider webhooks and sync status.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* 
                - Button: "Force Sync Rooms from Hapio"
                - Table/List: Recent failed WebhookEvents
              */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}