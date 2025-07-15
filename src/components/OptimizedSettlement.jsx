import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const OptimizedSettlement = ({ participants, expenses }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calcular balances
  const balances = participants.map(participant => {
    const paid = expenses
      .filter(expense => expense.paidBy === participant.id)
      .reduce((sum, expense) => sum + expense.amount, 0);

    const owes = expenses
      .filter(expense => expense.participants.includes(participant.id))
      .reduce((sum, expense) => sum + (expense.amount / expense.participants.length), 0);

    return {
      ...participant,
      balance: paid - owes
    };
  });

  // Algoritmo de liquidación optimizada
  const calculateOptimalTransfers = () => {
    // Separar deudores y acreedores
    const debtors = balances.filter(p => p.balance < -0.01).map(p => ({
      ...p,
      amount: Math.abs(p.balance)
    }));
    
    const creditors = balances.filter(p => p.balance > 0.01).map(p => ({
      ...p,
      amount: p.balance
    }));

    const transfers = [];
    
    // Crear copias para manipular
    const debtorsCopy = [...debtors];
    const creditorsCopy = [...creditors];

    while (debtorsCopy.length > 0 && creditorsCopy.length > 0) {
      const debtor = debtorsCopy[0];
      const creditor = creditorsCopy[0];

      const transferAmount = Math.min(debtor.amount, creditor.amount);

      transfers.push({
        from: debtor,
        to: creditor,
        amount: transferAmount
      });

      // Actualizar montos
      debtor.amount -= transferAmount;
      creditor.amount -= transferAmount;

      // Remover si el monto llega a 0
      if (debtor.amount < 0.01) {
        debtorsCopy.shift();
      }
      if (creditor.amount < 0.01) {
        creditorsCopy.shift();
      }
    }

    return transfers;
  };

  const optimalTransfers = calculateOptimalTransfers();
  const totalTransfers = optimalTransfers.length;
  const totalAmount = optimalTransfers.reduce((sum, transfer) => sum + transfer.amount, 0);

  // Calcular estadísticas
  const totalDebt = balances
    .filter(p => p.balance < 0)
    .reduce((sum, p) => sum + Math.abs(p.balance), 0);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Aquí podrías mostrar una notificación de éxito
      console.log('Copiado al portapapeles');
    });
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas de liquidación */}
      <Card className="border-river-red/20">
        <CardHeader>
          <CardTitle className="text-river-red">📊 Resumen de Liquidación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-river-red/5 rounded-lg">
              <div className="text-2xl font-bold text-river-red">
                {totalTransfers}
              </div>
              <div className="text-sm text-muted-foreground">
                Transferencias Necesarias
              </div>
            </div>
            
            <div className="text-center p-4 bg-river-red/5 rounded-lg">
              <div className="text-2xl font-bold text-river-red">
                {formatCurrency(totalAmount)}
              </div>
              <div className="text-sm text-muted-foreground">
                Total a Transferir
              </div>
            </div>
            
            <div className="text-center p-4 bg-river-red/5 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.max(0, participants.length - 1 - totalTransfers)}
              </div>
              <div className="text-sm text-muted-foreground">
                Transferencias Ahorradas
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de transferencias */}
      {optimalTransfers.length > 0 ? (
        <Card className="border-river-red/20">
          <CardHeader>
            <CardTitle className="text-river-red flex items-center gap-2">
              💸 Transferencias Requeridas
            </CardTitle>
            <CardDescription>
              Sigue estas transferencias para saldar todas las deudas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {optimalTransfers.map((transfer, index) => (
                <div key={index}>
                  <Card className="border-l-4 border-l-river-red">
                    <CardContent className="pt-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="bg-river-red/10 text-river-red border-river-red/30">
                              Transferencia #{index + 1}
                            </Badge>
                          </div>
                          
                          <div className="text-lg font-semibold mb-1">
                            <span className="text-red-600">{transfer.from.name}</span>
                            <span className="mx-2 text-muted-foreground">→</span>
                            <span className="text-green-600">{transfer.to.name}</span>
                          </div>
                          
                          <div className="text-2xl font-bold text-river-red">
                            {formatCurrency(transfer.amount)}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(
                              `${transfer.from.name} debe transferir ${formatCurrency(transfer.amount)} a ${transfer.to.name}`
                            )}
                            className="border-river-red/30 text-river-red hover:bg-river-red hover:text-white"
                          >
                            📋 Copiar
                          </Button>
                          
                          {transfer.to.transferInfo && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(transfer.to.transferInfo)}
                              className="border-green-500/30 text-green-600 hover:bg-green-500 hover:text-white"
                            >
                              💳 Datos
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {transfer.to.transferInfo && (
                        <>
                          <Separator className="my-3" />
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="text-sm font-medium text-green-700 mb-1">
                              Información de transferencia para {transfer.to.name}:
                            </div>
                            <div className="text-sm text-green-600 font-mono">
                              {transfer.to.transferInfo}
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                  
                  {index < optimalTransfers.length - 1 && (
                    <div className="flex justify-center my-2">
                      <div className="w-px h-4 bg-river-red/30"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <Separator className="my-6" />
            
            <div className="text-center">
              <Button
                onClick={() => {
                  const allTransfers = optimalTransfers.map((transfer, index) => 
                    `${index + 1}. ${transfer.from.name} → ${transfer.to.name}: ${formatCurrency(transfer.amount)}`
                  ).join('\n');
                  copyToClipboard(`Liquidación Calculadora Tarugueana:\n\n${allTransfers}`);
                }}
                className="bg-river-red hover:bg-river-red-dark"
              >
                📋 Copiar Todas las Transferencias
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-4xl mb-4">✅</div>
            <div className="text-xl font-semibold text-green-600 mb-2">
              ¡Todos los balances están equilibrados!
            </div>
            <div className="text-muted-foreground">
              No se necesitan transferencias
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OptimizedSettlement;
