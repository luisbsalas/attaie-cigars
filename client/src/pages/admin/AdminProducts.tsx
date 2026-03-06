import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Edit2, Trash2, Package } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { apiRequest } from "@/lib/queryClient";

const defaultProduct = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  category: "Cigars",
  origin: "Dominican Republic",
  strength: "Medium",
  format: "Toro",
  featured: false,
  stock: 100,
  lowStockThreshold: 10,
};

export default function AdminProducts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editDialog, setEditDialog] = useState<{ open: boolean; product: any }>({ open: false, product: null });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; productId: number | null }>({ open: false, productId: null });

  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/admin/products"],
  });

  const createMutation = useMutation({
    mutationFn: async (product: any) => {
      return apiRequest("/api/admin/products", {
        method: "POST",
        body: JSON.stringify(product),
      });
    },
    onSuccess: () => {
      toast({ title: "Product created" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      setEditDialog({ open: false, product: null });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create product", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...product }: any) => {
      return apiRequest(`/api/admin/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(product),
      });
    },
    onSuccess: () => {
      toast({ title: "Product updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      setEditDialog({ open: false, product: null });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update product", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/products/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      toast({ title: "Product deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      setDeleteDialog({ open: false, productId: null });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
    },
  });

  const filteredProducts = Array.isArray(products)
    ? products.filter((p: any) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.origin.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleSave = () => {
    if (!editDialog.product) return;
    if (editDialog.product.id) {
      updateMutation.mutate(editDialog.product);
    } else {
      createMutation.mutate(editDialog.product);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif text-white">Products</h1>
            <p className="text-white/50">Manage your cigar inventory</p>
          </div>
          <Button
            onClick={() => setEditDialog({ open: true, product: { ...defaultProduct } })}
            className="bg-[#C5A059] text-black hover:bg-[#C5A059]/90"
            data-testid="button-add-product"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
            data-testid="input-search-products"
          />
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-8 text-white/50">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product: any) => (
              <Card key={product.id} className="bg-[#111] border-white/10 overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  {product.featured && (
                    <span className="absolute top-2 left-2 bg-[#C5A059] text-black text-xs px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                  {product.stock <= (product.lowStockThreshold || 10) && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Low Stock
                    </span>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="text-white font-medium mb-1">{product.name}</h3>
                  <p className="text-white/40 text-sm mb-2">{product.origin} | {product.strength}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#C5A059] font-bold">${Number(product.price).toFixed(2)}</span>
                    <span className="text-white/40 text-sm">Stock: {product.stock || 0}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-white/20 text-white"
                      onClick={() => setEditDialog({ open: true, product: { ...product } })}
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                      onClick={() => setDeleteDialog({ open: true, productId: product.id })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit/Create Dialog */}
        <Dialog open={editDialog.open} onOpenChange={(open) => !open && setEditDialog({ open: false, product: null })}>
          <DialogContent className="bg-[#111] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editDialog.product?.id ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            {editDialog.product && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/70">Name</Label>
                  <Input
                    value={editDialog.product.name}
                    onChange={(e) => setEditDialog({ ...editDialog, product: { ...editDialog.product, name: e.target.value } })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editDialog.product.price}
                    onChange={(e) => setEditDialog({ ...editDialog, product: { ...editDialog.product, price: e.target.value } })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-white/70">Description</Label>
                  <Textarea
                    value={editDialog.product.description}
                    onChange={(e) => setEditDialog({ ...editDialog, product: { ...editDialog.product, description: e.target.value } })}
                    className="bg-white/5 border-white/10 text-white"
                    rows={3}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-white/70">Image URL</Label>
                  <Input
                    value={editDialog.product.imageUrl}
                    onChange={(e) => setEditDialog({ ...editDialog, product: { ...editDialog.product, imageUrl: e.target.value } })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Origin</Label>
                  <Select
                    value={editDialog.product.origin}
                    onValueChange={(value) => setEditDialog({ ...editDialog, product: { ...editDialog.product, origin: value } })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dominican Republic">Dominican Republic</SelectItem>
                      <SelectItem value="Nicaragua">Nicaragua</SelectItem>
                      <SelectItem value="Honduras">Honduras</SelectItem>
                      <SelectItem value="Cuba">Cuba</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Strength</Label>
                  <Select
                    value={editDialog.product.strength}
                    onValueChange={(value) => setEditDialog({ ...editDialog, product: { ...editDialog.product, strength: value } })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mild">Mild</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Medium-Full">Medium-Full</SelectItem>
                      <SelectItem value="Full">Full</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Format</Label>
                  <Select
                    value={editDialog.product.format}
                    onValueChange={(value) => setEditDialog({ ...editDialog, product: { ...editDialog.product, format: value } })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Robusto">Robusto</SelectItem>
                      <SelectItem value="Toro">Toro</SelectItem>
                      <SelectItem value="Churchill">Churchill</SelectItem>
                      <SelectItem value="Corona">Corona</SelectItem>
                      <SelectItem value="Gordo">Gordo</SelectItem>
                      <SelectItem value="Torpedo">Torpedo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Stock</Label>
                  <Input
                    type="number"
                    value={editDialog.product.stock}
                    onChange={(e) => setEditDialog({ ...editDialog, product: { ...editDialog.product, stock: parseInt(e.target.value) || 0 } })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Low Stock Threshold</Label>
                  <Input
                    type="number"
                    value={editDialog.product.lowStockThreshold}
                    onChange={(e) => setEditDialog({ ...editDialog, product: { ...editDialog.product, lowStockThreshold: parseInt(e.target.value) || 10 } })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="flex items-center gap-3 md:col-span-2">
                  <Switch
                    checked={editDialog.product.featured}
                    onCheckedChange={(checked) => setEditDialog({ ...editDialog, product: { ...editDialog.product, featured: checked } })}
                  />
                  <Label className="text-white/70">Featured Product</Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialog({ open: false, product: null })} className="border-white/20 text-white">
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-[#C5A059] text-black" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, productId: null })}>
          <DialogContent className="bg-[#111] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
            </DialogHeader>
            <p className="text-white/70">Are you sure you want to delete this product? This action cannot be undone.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialog({ open: false, productId: null })} className="border-white/20 text-white">
                Cancel
              </Button>
              <Button
                onClick={() => deleteDialog.productId && deleteMutation.mutate(deleteDialog.productId)}
                className="bg-red-500 text-white hover:bg-red-600"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
