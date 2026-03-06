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
import { Plus, Edit2, Trash2, Image, Megaphone, Eye } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { apiRequest } from "@/lib/queryClient";

export default function AdminContent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [bannerDialog, setBannerDialog] = useState<{ open: boolean; banner: any }>({ open: false, banner: null });
  const [announcementDialog, setAnnouncementDialog] = useState(false);

  const { data: banners, isLoading: bannersLoading } = useQuery({
    queryKey: ["/api/admin/banners"],
  });

  const { data: announcement } = useQuery({
    queryKey: ["/api/admin/announcement"],
  });

  const [announcementForm, setAnnouncementForm] = useState({
    text: "",
    linkUrl: "",
    linkText: "",
    isActive: false,
  });

  const saveBannerMutation = useMutation({
    mutationFn: async (banner: any) => {
      if (banner.id) {
        return apiRequest(`/api/admin/banners/${banner.id}`, {
          method: "PUT",
          body: JSON.stringify(banner),
        });
      }
      return apiRequest("/api/admin/banners", {
        method: "POST",
        body: JSON.stringify(banner),
      });
    },
    onSuccess: () => {
      toast({ title: "Banner saved" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banners"] });
      setBannerDialog({ open: false, banner: null });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save banner", variant: "destructive" });
    },
  });

  const deleteBannerMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/banners/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      toast({ title: "Banner deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banners"] });
    },
  });

  const saveAnnouncementMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/admin/announcement", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({ title: "Announcement saved" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcement"] });
      setAnnouncementDialog(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save announcement", variant: "destructive" });
    },
  });

  const defaultBanner = {
    title: "",
    subtitle: "",
    imageUrl: "",
    linkUrl: "",
    isActive: true,
    sortOrder: 0,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif text-white">Content Management</h1>
          <p className="text-white/50">Manage homepage banners and announcements</p>
        </div>

        {/* Announcement Bar */}
        <Card className="bg-[#111] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#C5A059]" />
              Announcement Bar
            </CardTitle>
            <Button
              onClick={() => {
                setAnnouncementForm({
                  text: announcement?.text || "",
                  linkUrl: announcement?.linkUrl || "",
                  linkText: announcement?.linkText || "",
                  isActive: announcement?.isActive || false,
                });
                setAnnouncementDialog(true);
              }}
              className="bg-[#C5A059] text-black"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            {announcement?.isActive ? (
              <div className="p-4 rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/30">
                <p className="text-white">{announcement.text}</p>
                {announcement.linkText && (
                  <p className="text-[#C5A059] text-sm mt-1">{announcement.linkText} →</p>
                )}
              </div>
            ) : (
              <p className="text-white/40 text-center py-4">No active announcement</p>
            )}
          </CardContent>
        </Card>

        {/* Homepage Banners */}
        <Card className="bg-[#111] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-white flex items-center gap-2">
              <Image className="w-5 h-5 text-[#C5A059]" />
              Homepage Banners
            </CardTitle>
            <Button
              onClick={() => setBannerDialog({ open: true, banner: { ...defaultBanner } })}
              className="bg-[#C5A059] text-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Banner
            </Button>
          </CardHeader>
          <CardContent>
            {bannersLoading ? (
              <p className="text-white/50 text-center py-8">Loading banners...</p>
            ) : !Array.isArray(banners) || banners.length === 0 ? (
              <p className="text-white/40 text-center py-8">No banners yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((banner: any) => (
                  <div key={banner.id} className="relative rounded-lg overflow-hidden group">
                    <div className="aspect-[16/9] bg-white/10">
                      {banner.imageUrl && (
                        <img src={banner.imageUrl} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                      <h3 className="text-white font-medium">{banner.title || "Untitled"}</h3>
                      <p className="text-white/60 text-sm">{banner.subtitle}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          banner.isActive ? "bg-green-500/20 text-green-500" : "bg-white/10 text-white/40"
                        }`}>
                          {banner.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setBannerDialog({ open: true, banner: { ...banner } })}
                        data-testid={`button-edit-banner-${banner.id}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteBannerMutation.mutate(banner.id)}
                        data-testid={`button-delete-banner-${banner.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Banner Dialog */}
        <Dialog open={bannerDialog.open} onOpenChange={(open) => !open && setBannerDialog({ open: false, banner: null })}>
          <DialogContent className="bg-[#111] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>{bannerDialog.banner?.id ? "Edit Banner" : "Add Banner"}</DialogTitle>
            </DialogHeader>
            {bannerDialog.banner && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/70">Title</Label>
                  <Input
                    value={bannerDialog.banner.title}
                    onChange={(e) => setBannerDialog({ ...bannerDialog, banner: { ...bannerDialog.banner, title: e.target.value } })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Subtitle</Label>
                  <Input
                    value={bannerDialog.banner.subtitle || ""}
                    onChange={(e) => setBannerDialog({ ...bannerDialog, banner: { ...bannerDialog.banner, subtitle: e.target.value } })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Image URL</Label>
                  <Input
                    value={bannerDialog.banner.imageUrl}
                    onChange={(e) => setBannerDialog({ ...bannerDialog, banner: { ...bannerDialog.banner, imageUrl: e.target.value } })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Link URL</Label>
                  <Input
                    value={bannerDialog.banner.linkUrl || ""}
                    onChange={(e) => setBannerDialog({ ...bannerDialog, banner: { ...bannerDialog.banner, linkUrl: e.target.value } })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={bannerDialog.banner.isActive}
                    onCheckedChange={(checked) => setBannerDialog({ ...bannerDialog, banner: { ...bannerDialog.banner, isActive: checked } })}
                  />
                  <Label className="text-white/70">Active</Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setBannerDialog({ open: false, banner: null })} className="border-white/20 text-white">
                Cancel
              </Button>
              <Button onClick={() => saveBannerMutation.mutate(bannerDialog.banner)} className="bg-[#C5A059] text-black" disabled={saveBannerMutation.isPending}>
                {saveBannerMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Announcement Dialog */}
        <Dialog open={announcementDialog} onOpenChange={setAnnouncementDialog}>
          <DialogContent className="bg-[#111] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Edit Announcement Bar</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/70">Announcement Text</Label>
                <Textarea
                  value={announcementForm.text}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, text: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Link URL (optional)</Label>
                <Input
                  value={announcementForm.linkUrl}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, linkUrl: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Link Text (optional)</Label>
                <Input
                  value={announcementForm.linkText}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, linkText: e.target.value })}
                  placeholder="e.g., Shop Now"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={announcementForm.isActive}
                  onCheckedChange={(checked) => setAnnouncementForm({ ...announcementForm, isActive: checked })}
                />
                <Label className="text-white/70">Show Announcement</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAnnouncementDialog(false)} className="border-white/20 text-white">
                Cancel
              </Button>
              <Button onClick={() => saveAnnouncementMutation.mutate(announcementForm)} className="bg-[#C5A059] text-black" disabled={saveAnnouncementMutation.isPending}>
                {saveAnnouncementMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
