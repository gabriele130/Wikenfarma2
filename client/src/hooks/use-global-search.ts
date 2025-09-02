import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface SearchResult {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  icon: string;
  route: string;
}

export function useGlobalSearch(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 200); // Reduced debounce time for faster response

    return () => clearTimeout(timer);
  }, [query]);

  const {
    data: results = [],
    isLoading,
    error,
  } = useQuery<SearchResult[]>({
    queryKey: ["/api/search", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < 1) {
        return [];
      }
      
      const response = await apiRequest("GET", `/api/search?q=${encodeURIComponent(debouncedQuery)}`);
      if (!response.ok) {
        throw new Error("Errore durante la ricerca");
      }
      return response.json();
    },
    enabled: debouncedQuery.length >= 1, // Start searching from first character
  });

  return {
    results,
    isLoading: isLoading && debouncedQuery.length >= 1,
    error,
    hasResults: results.length > 0,
    query: debouncedQuery,
  };
}