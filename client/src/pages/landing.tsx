import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-pills text-white text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">WikenFarma</h1>
          <p className="text-gray-600 mb-6">Sistema Gestionale Farmaceutico</p>
          <p className="text-sm text-gray-500 mb-6">
            Accedi per gestire ordini, clienti, magazzino e molto altro
          </p>
          <Button 
            onClick={() => window.location.href = "/api/login"}
            className="w-full bg-primary hover:bg-blue-700"
          >
            <i className="fas fa-sign-in-alt mr-2"></i>
            Accedi
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
