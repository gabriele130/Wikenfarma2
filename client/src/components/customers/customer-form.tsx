import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertCustomerSchema, type InsertCustomer, type Customer } from "@shared/schema";
import { apiRequest } from "../../lib/queryClient";
import { useToast } from "../../hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Users, Building2 } from "lucide-react";

interface CustomerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer;
  onSuccess?: () => void;
}

export default function CustomerForm({ open, onOpenChange, customer, onSuccess }: CustomerFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [customerType, setCustomerType] = useState<"private" | "pharmacy">(
    customer?.type as "private" | "pharmacy" || "private"
  );

  const form = useForm<InsertCustomer>({
    resolver: zodResolver(insertCustomerSchema),
    defaultValues: {
      type: customer?.type || "private",
      name: customer?.name || "",
      firstName: customer?.firstName || "",
      lastName: customer?.lastName || "",
      owner: customer?.owner || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      address: customer?.address || "",
      city: customer?.city || "",
      postalCode: customer?.postalCode || "",
      province: customer?.province || "",
      partitaIva: customer?.partitaIva || "",
      fiscalCode: customer?.fiscalCode || "",
      specialization: customer?.specialization || "",
      status: customer?.status || "active",
      isActive: customer?.isActive ?? true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCustomer) => {
      const response = await apiRequest("POST", "/api/customers", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Cliente creato",
        description: "Il cliente è stato creato con successo",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/customers/stats"] });
      onOpenChange(false);
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante la creazione",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<InsertCustomer>) => {
      const response = await apiRequest("PUT", `/api/customers/${customer!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Cliente aggiornato",
        description: "Il cliente è stato aggiornato con successo",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/customers/stats"] });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Si è verificato un errore durante l'aggiornamento",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCustomer) => {
    const processedData = {
      ...data,
      type: customerType,
      // Set name based on type
      name: customerType === "private" 
        ? `${data.firstName || ""} ${data.lastName || ""}`.trim()
        : data.name || "",
    };

    if (customer) {
      updateMutation.mutate(processedData);
    } else {
      createMutation.mutate(processedData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {customerType === "private" ? (
              <Users className="h-5 w-5" />
            ) : (
              <Building2 className="h-5 w-5" />
            )}
            <span>
              {customer ? "Modifica Cliente" : "Nuovo Cliente"}
            </span>
          </DialogTitle>
          <DialogDescription>
            {customer 
              ? "Modifica i dati del cliente esistente"
              : "Aggiungi un nuovo cliente al database"
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Customer Type Selection */}
          <div className="space-y-2">
            <Label>Tipo Cliente</Label>
            <Select
              value={customerType}
              onValueChange={(value: "private" | "pharmacy") => {
                setCustomerType(value);
                form.setValue("type", value);
              }}
              disabled={!!customer} // Disable editing type for existing customers
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona tipo cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Cliente Privato</span>
                  </div>
                </SelectItem>
                <SelectItem value="pharmacy">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4" />
                    <span>Farmacia</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Fields Based on Customer Type */}
          {customerType === "private" ? (
            <>
              {/* Private Customer Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome *</Label>
                  <Input
                    id="firstName"
                    {...form.register("firstName")}
                    placeholder="Mario"
                    required
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Cognome *</Label>
                  <Input
                    id="lastName"
                    {...form.register("lastName")}
                    placeholder="Rossi"
                    required
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fiscalCode">Codice Fiscale</Label>
                <Input
                  id="fiscalCode"
                  {...form.register("fiscalCode")}
                  placeholder="RSSMRA80A01H501U"
                />
              </div>
            </>
          ) : (
            <>
              {/* Pharmacy Fields */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome Farmacia *</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="Farmacia Centrale"
                  required
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner">Titolare *</Label>
                <Input
                  id="owner"
                  {...form.register("owner")}
                  placeholder="Dott. Francesco Lombardi"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="partitaIva">Partita IVA *</Label>
                  <Input
                    id="partitaIva"
                    {...form.register("partitaIva")}
                    placeholder="12345678901"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Specializzazione</Label>
                  <Input
                    id="specialization"
                    {...form.register("specialization")}
                    placeholder="Farmacia Generale"
                  />
                </div>
              </div>
            </>
          )}

          {/* Common Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="esempio@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefono</Label>
              <Input
                id="phone"
                {...form.register("phone")}
                placeholder="+39 123 456 7890"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Indirizzo</Label>
            <Textarea
              id="address"
              {...form.register("address")}
              placeholder="Via Roma 123"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Città</Label>
              <Input
                id="city"
                {...form.register("city")}
                placeholder="Milano"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">CAP</Label>
              <Input
                id="postalCode"
                {...form.register("postalCode")}
                placeholder="20100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Provincia</Label>
              <Input
                id="province"
                {...form.register("province")}
                placeholder="MI"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={form.watch("status")}
              onValueChange={(value) => form.setValue("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Attivo</SelectItem>
                <SelectItem value="inactive">Inattivo</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              Annulla
            </Button>
            <Button 
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? "Salvando..." : 
               customer ? "Aggiorna" : "Crea Cliente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}