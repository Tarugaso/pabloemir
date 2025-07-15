import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const IndividualBalances = ({ participants, expenses }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calcular balance detallado para cada participante
  const detailedBalances = participants.map(participant => {
    // Gastos que pagó esta persona
    const expensesPaid = expenses.filter(expense => expense.paidBy === participant.id);
    const totalPaid = expensesPaid.reduce((sum, expense) => sum + expense.amount, 0);

    // Gastos en los que participó
    const expensesInvolved = expenses.filter(expense => 
      expense.participants.includes(participant.id)
    );

    // Calcular cuánto debe por cada gasto
    const owesBreakdown = expensesInvolved.map(expense => {
      const shareAmount = expense.amount / expense.participants.length;
      const paidByParticipant = expense.paidBy === participant.id;
      
      return {
        expense,
        shareAmount,
        paidByParticipant
      };
    });

    const totalOwes = owesBreakdown.reduce((sum, item) => sum + item.shareAmount, 0);
    const netBalance = totalPaid - totalOwes;

    return {
      ...participant,
      expensesPaid,
      totalPaid,
      owesBreakdown,
      totalOwes,
      netBalance
    };
  });

  const getBalanceColor = (balance) => {
    if (balance > 0) return 'text-green-600';
    if (balance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getBalanceBadgeVariant = (balance) => {
    if (balance > 0) return 'default';
    if (balance < 0) return 'destructive';
    return 'secondary';
  };

  return (
    <div className="space-y-6">
      {detailedBalances.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-muted-foreground">No hay participantes agregados aún</div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {detailedBalances.map(person => (
            <Card key={person.id} className="border-river-red/20">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-river-red flex items-center gap-2">
                      👤 {person.name}
                    </CardTitle>
                    <CardDescription>
                      Balance detallado de pagos y deudas
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={getBalanceBadgeVariant(person.netBalance)}
                    className="text-lg px-3 py-1"
                  >
                    {person.netBalance >= 0 ? '+' : ''}{formatCurrency(person.netBalance)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Resumen rápido */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(person.totalPaid)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Pagado</div>
                  </div>
                  
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">
                      {formatCurrency(person.totalOwes)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Debe</div>
                  </div>
                  
                  <div className={`text-center p-3 rounded-lg ${
                    person.netBalance > 0 ? 'bg-green-50' : 
                    person.netBalance < 0 ? 'bg-red-50' : 'bg-gray-50'
                  }`}>
                    <div className={`text-lg font-bold ${getBalanceColor(person.netBalance)}`}>
                      {person.netBalance >= 0 ? '+' : ''}{formatCurrency(person.netBalance)}
                    </div>
                    <div className="text-sm text-muted-foreground">Balance Neto</div>
                  </div>
                </div>

                <Separator />

                {/* Gastos que pagó */}
                {person.expensesPaid.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                      💳 Gastos que pagó ({person.expensesPaid.length})
                    </h4>
                    <div className="space-y-2">
                      {person.expensesPaid.map(expense => (
                        <div key={expense.id} className="flex justify-between items-center p-2 bg-green-50 rounded text-sm">
                          <span>{expense.description}</span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(expense.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {person.expensesPaid.length > 0 && person.owesBreakdown.length > 0 && <Separator />}

                {/* Desglose de lo que debe */}
                {person.owesBreakdown.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                      📝 Participación en gastos ({person.owesBreakdown.length})
                    </h4>
                    <div className="space-y-2">
                      {person.owesBreakdown.map((item, index) => (
                        <div key={index} className={`flex justify-between items-center p-2 rounded text-sm ${
                          item.paidByParticipant ? 'bg-blue-50' : 'bg-red-50'
                        }`}>
                          <div>
                            <span>{item.expense.description}</span>
                            {item.paidByParticipant && (
                              <Badge variant="outline" className="ml-2 text-xs bg-blue-100 text-blue-700">
                                Pagó este gasto
                              </Badge>
                            )}
                          </div>
                          <span className={`font-medium ${
                            item.paidByParticipant ? 'text-blue-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(item.shareAmount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {person.expensesPaid.length === 0 && person.owesBreakdown.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <div className="text-2xl mb-2">📝</div>
                    <div>No ha participado en ningún gasto aún</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default IndividualBalances;
