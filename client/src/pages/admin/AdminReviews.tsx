import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Star, Check, X, Eye, Filter } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { apiRequest } from "@/lib/queryClient";

export default function AdminReviews() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["/api/admin/reviews"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest(`/api/admin/reviews/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      toast({ title: "Review updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update review", variant: "destructive" });
    },
  });

  const filteredReviews = Array.isArray(reviews)
    ? reviews.filter((r: any) => statusFilter === "all" || r.status === statusFilter)
    : [];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? "fill-[#C5A059] text-[#C5A059]" : "text-white/20"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif text-white">Reviews</h1>
            <p className="text-white/50">Moderate customer product reviews</p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-white/50">Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <Card className="bg-[#111] border-white/10">
            <CardContent className="py-12 text-center">
              <Star className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/50">No reviews found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review: any) => (
              <Card key={review.id} className="bg-[#111] border-white/10">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 font-bold">
                          {(review.customerName?.[0] || "?").toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium">{review.customerName || "Anonymous"}</p>
                          <p className="text-white/40 text-sm">{review.customerEmail}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        {renderStars(review.rating)}
                        <span className="text-white/40 text-sm">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          review.status === "approved" ? "bg-green-500/20 text-green-500" :
                          review.status === "rejected" ? "bg-red-500/20 text-red-500" :
                          "bg-yellow-500/20 text-yellow-500"
                        }`}>
                          {review.status}
                        </span>
                      </div>

                      <p className="text-white/70 text-sm mb-2">
                        <span className="text-white/40">Product: </span>
                        {review.productName || `Product #${review.productId}`}
                      </p>

                      {review.title && (
                        <p className="text-white font-medium mb-1">{review.title}</p>
                      )}
                      <p className="text-white/60 text-sm">{review.content}</p>
                    </div>

                    <div className="flex gap-2">
                      {review.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => updateStatusMutation.mutate({ id: review.id, status: "approved" })}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                            onClick={() => updateStatusMutation.mutate({ id: review.id, status: "rejected" })}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {review.status !== "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white"
                          onClick={() => updateStatusMutation.mutate({ id: review.id, status: "pending" })}
                        >
                          Reset to Pending
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
