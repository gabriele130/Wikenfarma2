import { createContext, ReactNode, useContext, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User, LoginData, RegisterData } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<any, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<any, Error, RegisterData>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  // Set up authorization header for custom auth (no Replit dependencies)
  useEffect(() => {
    const token = localStorage.getItem("wikenfarma_token");
    if (token) {
      // Custom authentication token handling
    }
  }, []);

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | undefined, Error>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ 
      on401: "returnNull",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("wikenfarma_token")}`,
      }
    }),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      return await res.json();
    },
    onSuccess: (data) => {
      // Store token
      localStorage.setItem("auth_token", data.token);
      // Update user data in cache
      queryClient.setQueryData(["/api/auth/user"], data.user);
      toast({
        title: "Login effettuato",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login fallito",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterData) => {
      const res = await apiRequest("POST", "/api/auth/register", credentials);
      return await res.json();
    },
    onSuccess: (data) => {
      // Store token
      localStorage.setItem("auth_token", data.token);
      // Update user data in cache
      queryClient.setQueryData(["/api/auth/user"], data.user);
      toast({
        title: "Registrazione completata",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registrazione fallita",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      // Remove token
      localStorage.removeItem("auth_token");
      // Clear user data
      queryClient.setQueryData(["/api/auth/user"], null);
      // Clear all cached data
      queryClient.clear();
      toast({
        title: "Logout effettuato",
        description: "Arrivederci!",
      });
    },
    onError: (error: Error) => {
      // Even if logout fails on server, clear local data
      localStorage.removeItem("auth_token");
      queryClient.setQueryData(["/api/auth/user"], null);
      queryClient.clear();
      toast({
        title: "Logout locale",
        description: "Disconnesso localmente",
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}