import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Hook per gestire i compensi ISF
export function useCompensations(filters: {
  month?: number;
  year?: number;
  informatoreId?: string;
  type?: string;
} = {}) {
  return useQuery({
    queryKey: ["/api/compensations", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.month) params.set("month", filters.month.toString());
      if (filters.year) params.set("year", filters.year.toString());
      if (filters.informatoreId) params.set("informatoreId", filters.informatoreId);
      if (filters.type) params.set("type", filters.type);

      const response = await fetch(`/api/compensations?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch compensations");
      return response.json();
    },
  });
}

// Hook per le statistiche dei compensi
export function useCompensationStats(month: number, year: number) {
  return useQuery({
    queryKey: ["/api/compensations/stats", month, year],
    queryFn: async () => {
      const params = new URLSearchParams({ 
        month: month.toString(), 
        year: year.toString() 
      });
      const response = await fetch(`/api/compensations/stats?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch compensation stats");
      return response.json();
    },
  });
}

// Hook per calcolare i compensi
export function useCalculateCompensations() {
  return useMutation({
    mutationFn: async (params: { month: number; year: number; informatoreId?: string }) => {
      const response = await apiRequest("POST", "/api/compensations/calculate", params);
      return response.json();
    },
    onSuccess: () => {
      // Invalida tutte le query dei compensi
      queryClient.invalidateQueries({ queryKey: ["/api/compensations"] });
    },
  });
}

// Hook per il compenso personale dell'informatore
export function useMyCompensation(month: number, year: number) {
  return useQuery({
    queryKey: ["/api/informatori/my-compensation", month, year],
    queryFn: async () => {
      const params = new URLSearchParams({ 
        month: month.toString(), 
        year: year.toString() 
      });
      const response = await fetch(`/api/informatori/my-compensation?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch my compensation");
      return response.json();
    },
  });
}

// Hook per i log delle commissioni personali
export function useMyCommissionLogs(filters: {
  month: number;
  year: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ["/api/informatori/commission-logs", filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        month: filters.month.toString(),
        year: filters.year.toString(),
      });
      if (filters.search) params.set("search", filters.search);

      const response = await fetch(`/api/informatori/commission-logs?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch commission logs");
      return response.json();
    },
  });
}

// Hook per le card dei dottori personali
export function useMyDoctorCards() {
  return useQuery({
    queryKey: ["/api/informatori/doctor-cards"],
    queryFn: async () => {
      const response = await fetch("/api/informatori/doctor-cards");
      if (!response.ok) throw new Error("Failed to fetch doctor cards");
      return response.json();
    },
  });
}

// Hook per le performance personali
export function useMyPerformance(year: number) {
  return useQuery({
    queryKey: ["/api/informatori/performance", year],
    queryFn: async () => {
      const params = new URLSearchParams({ year: year.toString() });
      const response = await fetch(`/api/informatori/performance?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch performance");
      return response.json();
    },
  });
}