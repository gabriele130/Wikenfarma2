import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface OrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const orderSchema = z.object({
  customerId: z.string().min(1, "Cliente richiesto"),
  customerType: z.enum(["private", "pharmacy", "wholesale"]),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
  })).min(1, "Almeno un prodotto richiesto"),
});

type OrderFormData = z.infer<typeof orderSchema>;

export default function OrderModal({ open, onOpenChange }: OrderModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCustomerType, setSelectedCustomerType] = useState<string>("");

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerId: "",
      customerType: "private",
      notes: "",
      items: [{ productId: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const { data: customers } = useQuery({
    queryKey: ["/api/customers", { type: selectedCustomerType }],
    enabled: !!selectedCustomerType,
  });

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: OrderFormData) => {
      // Calculate totals
      const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      const tax = subtotal * 0.22; // 22% IVA
      const total = subtotal + tax;

      const orderData = {
        ...data,
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        total: total.toString(),
        items: data.items.map(item => ({
          ...item,
          total: (item.quantity * item.unitPrice).toString(),
          unitPrice: item.unitPrice.toString(),
        })),
      };

      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Successo",
        description: "Ordine creato con successo",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Non autorizzato",
          description: "Stai per essere reindirizzato alla pagina di accesso...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Errore",
        description: "Errore durante la creazione dell'ordine",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: OrderFormData) => {
    createOrderMutation.mutate(data);
  };

  const customerTypes = [
    { value: "private", label: "Cliente Privato" },
    { value: "pharmacy", label: "Farmacia" },
    { value: "wholesale", label: "Grossista" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nuovo Ordine</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo Cliente</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedCustomerType(value);
                        form.setValue("customerId", "");
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona tipo cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customerTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers?.customers?.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.companyName || 
                             `${customer.firstName || ""} ${customer.lastName || ""}`.trim()}
                          </SelectItem>
                        )) || []}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel>Prodotti</FormLabel>
              <div className="border border-gray-300 rounded-lg p-3 min-h-32 bg-gray-50">
                <p className="text-gray-500 text-sm text-center py-8">
                  Interfaccia di selezione prodotti da implementare
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (opzionale)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Note aggiuntive sull'ordine..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annulla
              </Button>
              <Button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="bg-primary hover:bg-blue-700"
              >
                {createOrderMutation.isPending ? "Creazione..." : "Crea Ordine"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
