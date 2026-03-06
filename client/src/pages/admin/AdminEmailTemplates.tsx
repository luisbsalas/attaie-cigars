import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Mail, Edit2, Eye } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { apiRequest } from "@/lib/queryClient";

const defaultTemplates = [
  { id: "order_confirmation", name: "Order Confirmation", description: "Sent when a customer places an order" },
  { id: "shipping_notification", name: "Shipping Notification", description: "Sent when an order is shipped" },
  { id: "delivery_confirmation", name: "Delivery Confirmation", description: "Sent when an order is delivered" },
  { id: "welcome_email", name: "Welcome Email", description: "Sent to new newsletter subscribers" },
  { id: "password_reset", name: "Password Reset", description: "Sent when a password reset is requested" },
];

export default function AdminEmailTemplates() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editDialog, setEditDialog] = useState<{ open: boolean; template: any }>({ open: false, template: null });
  const [previewDialog, setPreviewDialog] = useState<{ open: boolean; template: any }>({ open: false, template: null });

  const { data: templates, isLoading } = useQuery({
    queryKey: ["/api/admin/email-templates"],
  });

  const saveMutation = useMutation({
    mutationFn: async (template: any) => {
      return apiRequest(`/api/admin/email-templates/${template.templateId}`, {
        method: "PUT",
        body: JSON.stringify(template),
      });
    },
    onSuccess: () => {
      toast({ title: "Template saved" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-templates"] });
      setEditDialog({ open: false, template: null });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save template", variant: "destructive" });
    },
  });

  const getTemplateData = (templateId: string) => {
    if (Array.isArray(templates)) {
      return templates.find((t: any) => t.templateId === templateId);
    }
    return null;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif text-white">Email Templates</h1>
          <p className="text-white/50">Customize automated email notifications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {defaultTemplates.map((template) => {
            const savedData = getTemplateData(template.id);
            return (
              <Card key={template.id} className="bg-[#111] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{template.name}</h3>
                        <p className="text-white/50 text-sm mt-1">{template.description}</p>
                        {savedData && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              savedData.isActive ? "bg-green-500/20 text-green-500" : "bg-white/10 text-white/40"
                            }`}>
                              {savedData.isActive ? "Active" : "Inactive"}
                            </span>
                            <span className="text-white/30 text-xs">
                              Last updated: {new Date(savedData.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-white/20 text-white"
                      onClick={() => setEditDialog({
                        open: true,
                        template: {
                          templateId: template.id,
                          name: template.name,
                          subject: savedData?.subject || `Your ${template.name}`,
                          body: savedData?.body || "",
                          isActive: savedData?.isActive ?? true,
                        }
                      })}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    {savedData && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white/60"
                        onClick={() => setPreviewDialog({ open: true, template: savedData })}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-[#111] border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Template Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/50 text-sm mb-4">
              You can use these variables in your email templates. They will be replaced with actual values when emails are sent.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { var: "{{customer_name}}", desc: "Customer's name" },
                { var: "{{order_number}}", desc: "Order number" },
                { var: "{{order_total}}", desc: "Order total" },
                { var: "{{tracking_number}}", desc: "Shipping tracking" },
                { var: "{{product_list}}", desc: "Ordered items" },
                { var: "{{shipping_address}}", desc: "Shipping address" },
                { var: "{{store_name}}", desc: "Store name" },
                { var: "{{current_date}}", desc: "Current date" },
              ].map((item) => (
                <div key={item.var} className="p-3 rounded bg-white/5">
                  <code className="text-[#C5A059] text-sm">{item.var}</code>
                  <p className="text-white/40 text-xs mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={editDialog.open} onOpenChange={(open) => !open && setEditDialog({ open: false, template: null })}>
          <DialogContent className="bg-[#111] border-white/10 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit {editDialog.template?.name}</DialogTitle>
            </DialogHeader>
            {editDialog.template && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/70">Subject Line</Label>
                  <Input
                    value={editDialog.template.subject}
                    onChange={(e) => setEditDialog({ ...editDialog, template: { ...editDialog.template, subject: e.target.value } })}
                    placeholder="Email subject"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Email Body (HTML supported)</Label>
                  <Textarea
                    value={editDialog.template.body}
                    onChange={(e) => setEditDialog({ ...editDialog, template: { ...editDialog.template, body: e.target.value } })}
                    placeholder="Enter email body content..."
                    className="bg-white/5 border-white/10 text-white font-mono text-sm"
                    rows={12}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={editDialog.template.isActive}
                    onCheckedChange={(checked) => setEditDialog({ ...editDialog, template: { ...editDialog.template, isActive: checked } })}
                  />
                  <Label className="text-white/70">Send this email automatically</Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialog({ open: false, template: null })} className="border-white/20 text-white">
                Cancel
              </Button>
              <Button onClick={() => saveMutation.mutate(editDialog.template)} className="bg-[#C5A059] text-black" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : "Save Template"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={previewDialog.open} onOpenChange={(open) => !open && setPreviewDialog({ open: false, template: null })}>
          <DialogContent className="bg-white text-black max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-black">Preview: {previewDialog.template?.subject}</DialogTitle>
            </DialogHeader>
            {previewDialog.template && (
              <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                {previewDialog.template.body}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
