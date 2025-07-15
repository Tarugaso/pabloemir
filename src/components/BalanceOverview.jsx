import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const BalanceOverview = ({ participants, expenses }) => {
  // Calcular totales
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalParticipants = participants.length;
  const averagePerPerson = totalParticipants > 0 ? totalExpenses / totalParticipants : 0;

  // Calcular balances individuales
  const balances = participants.map(participant => {
    const paid = expenses
      .filter(expense => expense.paidBy === participant.id)
      .reduce((sum, expense) => sum + expense.amount, 0);

    const owes = expenses
      .filter(expense => expense.participants.includes(participant.id))
      .reduce((sum, expense) => sum + (expense.amount / expense.participants.length), 0);

    const balance = paid - owes;

    return {
      ...participant,
      paid,
      owes,
      balance
    };
  });

  const positiveBalances = balances.filter(b => b.balance > 0);
  const negativeBalances = balances.filter(b => b.balance < 0);
  const evenBalances = balances.filter(b => Math.abs(b.balance) < 0.01);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Resumen General */}
      <Card className="border-river-red/20">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-river-red/5 rounded-lg">
              <div className="text-2xl font-bold text-river-red">
                {formatCurrency(totalExpenses)}
              </div>
              <div className="text-sm text-muted-foreground">Total Gastado</div>
            </div>
            
            <div className="text-center p-4 bg-river-red/5 rounded-lg">
              <div className="text-2xl font-bold text-river-red">
                {totalParticipants}
              </div>
              <div className="text-sm text-muted-foreground">Participantes</div>
            </div>
            
            <div className="text-center p-4 bg-river-red/5 rounded-lg">
              <div className="text-2xl font-bold text-river-red">
                {formatCurrency(averagePerPerson)}
              </div>
              <div className="text-sm text-muted-foreground">Promedio por Persona</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado de Balances */}
      <Card className="border-river-red/20">
        <CardHeader>
          <CardTitle className="text-river-red">📊 Estado de Balances</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Personas que deben recibir dinero */}
          {positiveBalances.length > 0 && (
            <div>
              <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                ⬆️ Deben recibir dinero ({positiveBalances.length})
              </h4>
              <div className="space-y-2">
                {positiveBalances.map(person => (
                  <div key={person.id} className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="font-medium">{person.name}</span>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      +{formatCurrency(person.balance)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {positiveBalances.length > 0 && negativeBalances.length > 0 && <Separator />}

          {/* Personas que deben pagar */}
          {negativeBalances.length > 0 && (
            <div>
              <h4 className="font-semibold text-river-red mb-2 flex items-center gap-2">
                ⬇️ Deben pagar ({negativeBalances.length})
              </h4>
              <div className="space-y-2">
                {negativeBalances.map(person => (
                  <div key={person.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="font-medium">{person.name}</span>
                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                      {formatCurrency(person.balance)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personas que están al día */}
          {evenBalances.length > 0 && (
            <>
              {(positiveBalances.length > 0 || negativeBalances.length > 0) && <Separator />}
              <div>
                <h4 className="font-semibold text-gray-600 mb-2 flex items-center gap-2">
                  ✅ Al día ({evenBalances.length})
                </h4>
                <div className="space-y-2">
                  {evenBalances.map(person => (
                    <div key={person.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">{person.name}</span>
                      <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                        {formatCurrency(0)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {totalParticipants === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-2">👥</div>
              <div>No hay participantes agregados aún</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BalanceOverview;
