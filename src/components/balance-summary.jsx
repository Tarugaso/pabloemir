// Componente simplificado sin dependencias externas

export function BalanceSummary({
  people,
  expenses
}) {
  const calculateBalances = () => {
    const balances = {}

    // Initialize balances
    people.forEach((person) => {
      balances[person.id] = { paid: 0, owes: 0, net: 0 }
    })

    // Calculate what each person paid and owes
    expenses.forEach((expense) => {
      const participantCount = expense.participants.length
      const amountPerPerson = expense.amount / participantCount

      // Add to paid amount for the person who paid
      balances[expense.paidBy].paid += expense.amount

      // Add to owed amount for each participant
      expense.participants.forEach((participantId) => {
        balances[participantId].owes += amountPerPerson
      })
    })

    // Calculate net balance (positive means they should receive, negative means they owe)
    Object.keys(balances).forEach((personId) => {
      balances[personId].net = balances[personId].paid - balances[personId].owes
    })

    return balances
  }

  const balances = calculateBalances()
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const averagePerPerson = people.length > 0 ? totalExpenses / people.length : 0

  const creditors = people.filter((person) => balances[person.id].net > 0.01)
  const debtors = people.filter((person) => balances[person.id].net < -0.01)
  const settled = people.filter((person) => Math.abs(balances[person.id].net) <= 0.01)

  const generateSettlements = () => {
    const settlements = []
    const creditorsCopy = [...creditors].map((p) => ({ ...p, amount: balances[p.id].net }))
    const debtorsCopy = [...debtors].map((p) => ({ ...p, amount: Math.abs(balances[p.id].net) }))

    while (creditorsCopy.length > 0 && debtorsCopy.length > 0) {
      const creditor = creditorsCopy[0]
      const debtor = debtorsCopy[0]

      const settlementAmount = Math.min(creditor.amount, debtor.amount)

      settlements.push({
        from: debtor,
        to: creditor,
        amount: settlementAmount,
      })

      creditor.amount -= settlementAmount
      debtor.amount -= settlementAmount

      if (creditor.amount <= 0.01) creditorsCopy.shift()
      if (debtor.amount <= 0.01) debtorsCopy.shift()
    }

    return settlements
  }

  const settlements = generateSettlements()

  if (people.length === 0 || expenses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-lg mb-2">No hay cálculos aún</p>
        <p className="text-sm">
          Agrega participantes y gastos para ver el resumen de balances
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen General */}
      <div className="bg-muted p-4 rounded-lg">
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">Total de gastos</p>
          <p className="text-2xl font-bold text-foreground">${totalExpenses.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">
            Promedio por persona: ${averagePerPerson.toFixed(2)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-success/10 p-3 rounded border border-success/20">
            <div className="text-2xl font-bold text-success">{creditors.length}</div>
            <div className="text-sm text-success">Deben Recibir</div>
          </div>
          <div className="bg-danger/10 p-3 rounded border border-danger/20">
            <div className="text-2xl font-bold text-danger">{debtors.length}</div>
            <div className="text-sm text-danger">Deben Pagar</div>
          </div>
          <div className="bg-secondary/10 p-3 rounded border border-secondary/20">
            <div className="text-2xl font-bold text-secondary">{settled.length}</div>
            <div className="text-sm text-secondary">Saldados</div>
          </div>
        </div>
      </div>
      {/* Balances Individuales */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Balances Individuales</h3>
        <div className="space-y-3">
          {people.map((person) => {
            const balance = balances[person.id]
            const isCreditor = balance.net > 0.01
            const isDebtor = balance.net < -0.01

            return (
              <div
                key={person.id}
                className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{person.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Pagó ${balance.paid.toFixed(2)} • Debe ${balance.owes.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {isCreditor && (
                    <span className="simple-badge badge-success">
                      +${balance.net.toFixed(2)}
                    </span>
                  )}
                  {isDebtor && (
                    <span className="simple-badge badge-danger">
                      -${Math.abs(balance.net).toFixed(2)}
                    </span>
                  )}
                  {!isCreditor && !isDebtor && (
                    <span className="simple-badge badge-info">Saldado</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Sugerencias de Liquidación */}
      {settlements.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-3">Sugerencias de Liquidación</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Forma óptima de saldar todas las deudas con el mínimo de transacciones
          </p>
          <div className="space-y-3">
            {settlements.map((settlement, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-danger text-white flex items-center justify-center text-xs font-semibold">
                      {settlement.from.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-foreground">{settlement.from.name}</span>
                  </div>
                  <span className="text-muted-foreground">→</span>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center text-xs font-semibold">
                      {settlement.to.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-foreground">{settlement.to.name}</span>
                  </div>
                </div>
                <span className="simple-badge badge-info font-semibold">
                  ${settlement.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
