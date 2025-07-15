import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';

const ShadcnDemo = () => {
  return (
    <div className="p-6 space-y-6">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-river-red">
            🔴⚪ Componente shadcn/ui
          </CardTitle>
          <CardDescription>
            Integrado con el diseño de River Plate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="demo-input" className="text-sm font-medium">
              Campo de ejemplo
            </label>
            <Input 
              id="demo-input"
              placeholder="Escribe algo aquí..."
              className="border-river-red/20 focus:border-river-red"
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="default" className="bg-river-red hover:bg-river-red-dark">
              Botón Principal
            </Button>
            <Button variant="outline" className="border-river-red text-river-red hover:bg-river-red hover:text-white">
              Botón Secundario
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Este es un ejemplo de cómo se integran los componentes de shadcn/ui 
            con los colores de River Plate en la calculadora tarugueana.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShadcnDemo;
