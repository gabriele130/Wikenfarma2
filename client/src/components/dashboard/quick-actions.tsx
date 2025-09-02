import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import OrderModal from "@/components/modals/order-modal";

export default function QuickActions() {
  const [showOrderModal, setShowOrderModal] = useState(false);

  const actions = [
    {
      icon: "fas fa-plus-circle",
      label: "Crea Nuovo Ordine",
      color: "text-primary",
      onClick: () => setShowOrderModal(true)
    },
    {
      icon: "fas fa-file-pdf",
      label: "Genera Report",
      color: "text-error",
      href: "/reports"
    },
    {
      icon: "fas fa-sync-alt",
      label: "Sincronizza Dati",
      color: "text-secondary",
      href: "/integrations"
    },
    {
      icon: "fas fa-boxes",
      label: "Gestione Magazzino",
      color: "text-warning",
      href: "/inventory"
    }
  ];

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Azioni Rapide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {actions.map((action, index) => (
            action.href ? (
              <Link key={index} href={action.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start bg-gray-50 hover:bg-gray-100 h-auto py-3"
                >
                  <i className={`${action.icon} ${action.color} mr-3`}></i>
                  <span className="text-sm font-medium text-gray-700">
                    {action.label}
                  </span>
                </Button>
              </Link>
            ) : (
              <Button
                key={index}
                variant="ghost"
                onClick={action.onClick}
                className="w-full justify-start bg-gray-50 hover:bg-gray-100 h-auto py-3"
              >
                <i className={`${action.icon} ${action.color} mr-3`}></i>
                <span className="text-sm font-medium text-gray-700">
                  {action.label}
                </span>
              </Button>
            )
          ))}
        </CardContent>
      </Card>

      <OrderModal 
        open={showOrderModal} 
        onOpenChange={setShowOrderModal}
      />
    </>
  );
}
