import { useState } from "react";
import { Button } from "@/components/ui/button";
import OrderModal from "@/components/modals/order-modal";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [showOrderModal, setShowOrderModal] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <i className="fas fa-bell text-lg"></i>
              <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full px-1.5 py-0.5">3</span>
            </button>
            
            {/* Quick Actions */}
            <Button 
              onClick={() => setShowOrderModal(true)}
              className="bg-primary text-white hover:bg-blue-700"
            >
              <i className="fas fa-plus mr-2"></i>
              Nuovo Ordine
            </Button>
          </div>
        </div>
      </header>

      <OrderModal 
        open={showOrderModal} 
        onOpenChange={setShowOrderModal}
      />
    </>
  );
}
