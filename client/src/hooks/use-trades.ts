import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type Trade } from "@shared/routes";
import { type InsertTrade } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useTrades() {
  return useQuery<Trade[]>({
    queryKey: [api.trades.list.path],
    queryFn: async () => {
      const res = await fetch(api.trades.list.path);
      if (!res.ok) throw new Error("Failed to fetch trades");
      return await res.json();
    },
  });
}

export function useAnalytics() {
  return useQuery({
    queryKey: [api.analytics.get.path],
    queryFn: async () => {
      const res = await fetch(api.analytics.get.path);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return await res.json();
    },
  });
}

export function useCreateTrade() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertTrade) => {
      const res = await fetch(api.trades.create.path, {
        method: api.trades.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create trade");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.trades.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.analytics.get.path] });
      toast({ title: "Trade Logged", description: "Your trade has been successfully recorded." });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });
}

export function useUpdateTrade() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertTrade>) => {
      const url = buildUrl(api.trades.update.path, { id });
      const res = await fetch(url, {
        method: api.trades.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to update trade");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.trades.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.analytics.get.path] });
      toast({ title: "Trade Updated", description: "Changes saved successfully." });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Update Failed", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });
}

export function useDeleteTrade() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.trades.delete.path, { id });
      const res = await fetch(url, { method: api.trades.delete.method });
      if (!res.ok) throw new Error("Failed to delete trade");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.trades.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.analytics.get.path] });
      toast({ title: "Trade Deleted", description: "The trade record has been removed." });
    },
  });
}
