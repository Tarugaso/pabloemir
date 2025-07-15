import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { calculateBalances, calculateSettlements, getParticipantStats } from '../utils/calculations';

const SettlementSummary = ({ participants, expenses }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getBalanceClass = (balance) => {
    if (balance > 0.01) return 'balance-positive';
    if (balance < -0.01) return 'balance-negative';
    return 'balance-zero';
  };

  const getBalanceText = (balance) => {
    if (balance > 0.01) return 'Le deben';
    if (balance < -0.01) return 'Debe';
    return 'Equilibrado';
  };

  if (participants.length === 0 || expenses.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-4xl mb-4">📋</div>
          <div className="text-xl font-semibold text-muted-foreground mb-2">
            {participants.length === 0
              ? 'No hay participantes agregados'
              : 'No hay gastos registrados'
            }
          </div>
          <div className="text-muted-foreground">
            {participants.length === 0
              ? 'Agrega participantes para ver el resumen de liquidación.'
              : 'Agrega gastos para ver el resumen de liquidación.'
            }
          </div>
        </CardContent>
      </Card>
    );
  }

  const balances = calculateBalances(participants, expenses);
  const settlements = calculateSettlements(participants, balances);
  const participantStats = getParticipantStats(participants, expenses, balances);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const isBalanced = settlements.length === 0;

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <Card className="border-river-red/20">
        <CardHeader>
          <CardTitle className="text-river-red">📊 Resumen de Liquidación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-river-red/5 rounded-lg">
              <div className="text-2xl font-bold text-river-red">
                {formatCurrency(totalExpenses)}
              </div>
              <div className="text-sm text-muted-foreground">Total de Gastos</div>
            </div>

            <div className="text-center p-4 bg-river-red/5 rounded-lg">
              <div className="text-2xl font-bold text-river-red">
                {expenses.length}
              </div>
              <div className="text-sm text-muted-foreground">Transacciones</div>
            </div>

            <div className="text-center p-4 bg-river-red/5 rounded-lg">
              <div className={`text-2xl font-bold ${isBalanced ? 'text-green-600' : 'text-orange-600'}`}>
                {isBalanced ? '✅' : '⚠️'}
              </div>
              <div className="text-sm text-muted-foreground">
                {isBalanced ? 'Todo Liquidado' : 'Pendiente'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Balances */}
      <Card className="border-river-red/20">
        <CardHeader>
          <CardTitle className="text-river-red">👤 Resumen de Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {participantStats.map(stat => (
              <div key={stat.id} className="p-4 border rounded-lg bg-white">
                <div className="text-center">
                  <div className="font-semibold text-lg mb-2">{stat.name}</div>
                  <div className={`text-xl font-bold mb-1 ${getBalanceClass(stat.balance)}`}>
                    {formatCurrency(Math.abs(stat.balance))}
                  </div>
                  <Badge
                    variant={stat.balance > 0.01 ? "default" : stat.balance < -0.01 ? "destructive" : "secondary"}
                    className="mb-2"
                  >
                    {getBalanceText(stat.balance)}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    Pagó: {formatCurrency(stat.totalPaid)} | Debe: {formatCurrency(stat.totalOwed)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settlement Instructions */}
      {settlements.length > 0 ? (
        <Card className="border-river-red/20">
          <CardHeader>
            <CardTitle className="text-river-red">💸 Pagos Sugeridos para Liquidar</CardTitle>
            <CardDescription>
              Realiza estos {settlements.length} pago(s) para liquidar todas las deudas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settlements.map((settlement, index) => (
              <Card key={index} className="border-l-4 border-l-river-red">
                <CardContent className="pt-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <Badge variant="outline" className="bg-river-red/10 text-river-red border-river-red/30 mb-2">
                        Pago #{index + 1}
                      </Badge>
                      <div className="text-lg font-semibold">
                        <span className="text-red-600">{settlement.fromName}</span>
                        <span className="mx-2 text-muted-foreground">→</span>
                        <span className="text-green-600">{settlement.toName}</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-river-red">
                      {formatCurrency(settlement.amount)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Separator />

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-green-700">
                💡 <strong>Consejo:</strong> Una vez realizados estos pagos, todos los participantes estarán equilibrados.
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-200">
          <CardContent className="text-center py-8">
            <div className="text-4xl mb-4">🎉</div>
            <div className="text-xl font-semibold text-green-600 mb-2">
              ¡Todas las cuentas están liquidadas!
            </div>
            <div className="text-muted-foreground">
              No hay pagos pendientes entre los participantes.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Statistics */}
      <Card className="border-river-red/20">
        <CardHeader>
          <CardTitle className="text-river-red text-lg">📈 Estadísticas Detalladas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {participantStats.map(stat => (
              <div key={stat.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold text-river-red mb-1">{stat.name}</div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>• Participó en {stat.expenseCount} gasto(s)</div>
                  <div>• Pagó {stat.paidCount} vez(es)</div>
                  <div>• Total pagado: <span className="font-medium">{formatCurrency(stat.totalPaid)}</span></div>
                  <div>• Total que debe: <span className="font-medium">{formatCurrency(stat.totalOwed)}</span></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettlementSummary;
