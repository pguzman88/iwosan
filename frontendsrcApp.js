import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, ClipboardList, Users, MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-brown-700 mb-6">Gestión de Panadería y Cafetería</h1>
      
      <div className="grid grid-cols-2 gap-6 max-w-md">
        <Card className="bg-white shadow-lg rounded-2xl p-4 text-center">
          <CardContent>
            <ShoppingCart className="text-yellow-700 w-12 h-12 mx-auto mb-4" />
            <Button className="w-full bg-yellow-600 hover:bg-yellow-500 text-white text-lg">Registrar Venta</Button>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg rounded-2xl p-4 text-center">
          <CardContent>
            <ClipboardList className="text-yellow-700 w-12 h-12 mx-auto mb-4" />
            <Button className="w-full bg-yellow-600 hover:bg-yellow-500 text-white text-lg">Ver Reportes</Button>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg rounded-2xl p-4 text-center">
          <CardContent>
            <Users className="text-yellow-700 w-12 h-12 mx-auto mb-4" />
            <Button className="w-full bg-yellow-600 hover:bg-yellow-500 text-white text-lg">Clientes Deudores</Button>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg rounded-2xl p-4 text-center">
          <CardContent>
            <MessageCircle className="text-yellow-700 w-12 h-12 mx-auto mb-4" />
            <Button className="w-full bg-green-600 hover:bg-green-500 text-white text-lg" onClick={() => window.open('https://wa.me/543813847331', '_blank')}>WhatsApp</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
