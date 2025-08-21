import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useLocation } from "wouter"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { loginSchema, LoginData } from "@shared/schema"
import { apiRequest, queryClient } from "../lib/queryClient"
import { useToast } from "../hooks/use-toast"
import { Pill, Users, UserCheck, Eye, EyeOff } from "lucide-react"

export default function AuthPage() {
  const [, setLocation] = useLocation()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<"standard" | "informatore">("standard")

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      userType: "standard"
    }
  })

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest("POST", "/api/auth/login", data)
      return response.json()
    },
    onSuccess: (data) => {
      toast({
        title: "Login effettuato",
        description: data.message,
      })
      // Store token in localStorage
      localStorage.setItem("auth_token", data.token)
      // Invalidate user query to refresh user state
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] })
      setLocation("/")
    },
    onError: (error: any) => {
      toast({
        title: "Errore di login",
        description: error.message || "Username o password non validi",
        variant: "destructive",
      })
    },
  })

  const onLogin = (data: LoginData) => {
    loginMutation.mutate({ ...data, userType })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Hero Section */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-6">
            <div className="flex items-center justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl">
                  <Pill className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
            
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent mb-4">
                WikenFarma
              </h1>
              <p className="text-xl text-slate-600 mb-6">
                Sistema Gestionale Farmaceutico di Nuova Generazione
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
              <Users className="h-8 w-8 text-blue-600 mb-4 mx-auto lg:mx-0" />
              <h3 className="font-semibold text-slate-900 mb-2">Gestione Completa</h3>
              <p className="text-sm text-slate-600">
                Ordini, clienti, inventario e integrazioni centralizzate
              </p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
              <UserCheck className="h-8 w-8 text-green-600 mb-4 mx-auto lg:mx-0" />
              <h3 className="font-semibold text-slate-900 mb-2">Sistema ISF</h3>
              <p className="text-sm text-slate-600">
                Commissioni automatizzate e gestione informatori
              </p>
            </div>
          </div>
        </div>

        {/* Auth Section */}
        <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-slate-900">
              Accesso Sistema
            </CardTitle>
            <CardDescription className="text-slate-600">
              Scegli il tipo di accesso appropriato
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* User Type Selection */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              <Button
                variant={userType === "standard" ? "default" : "outline"}
                onClick={() => setUserType("standard")}
                className="text-sm"
              >
                <Users className="h-4 w-4 mr-2" />
                Staff Standard
              </Button>
              <Button
                variant={userType === "informatore" ? "default" : "outline"}
                onClick={() => setUserType("informatore")}
                className="text-sm"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Informatori
              </Button>
            </div>

            {/* Login Form */}
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-username">Username</Label>
                <Input
                  id="login-username"
                  type="text"
                  placeholder="Inserisci username"
                  {...loginForm.register("username")}
                  className="bg-white/50"
                />
                {loginForm.formState.errors.username && (
                  <p className="text-sm text-red-600">
                    {loginForm.formState.errors.username.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Inserisci password"
                    {...loginForm.register("password")}
                    className="bg-white/50 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-red-600">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Accesso in corso..." : "Accedi"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}