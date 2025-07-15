"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calculator, TrendingUp, TrendingDown, Share2, Download, ArrowRight } from "lucide-react"

interface Person {
  id: string
  name: string
}

interface Expense {
  id: string
  description: string
  amount: number
  paidBy: string
  category: string
  date: string
  participants: string[]
}

interface BalanceSummaryProps {
  people: Person[]
  expenses: Expense[]
}

export function BalanceSummary({ people, expenses }: BalanceSummaryProps) {
  const calculateBalances = () => {
    const balances: { [key: string]: { paid: number; owes: number; net: number } } = {}

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
    const settlements: { from: Person; to: Person; amount: number }[] = []
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
      <Card className="backdrop-blur-md bg-slate-900/40 border-slate-700/50 shadow-2xl">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="p-6 rounded-full bg-slate-800/30 mb-6">
            <Calculator className="h-12 w-12 text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-3">No hay cálculos aún</h3>
          <p className="text-slate-500 text-center max-w-md">
            Agrega participantes y gastos para ver el resumen de balances
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <Card className="backdrop-blur-md bg-slate-900/40 border-slate-700/50 shadow-2xl">
        <CardHeader className="border-b border-slate-700/30">
          <CardTitle className="flex items-center gap-3 text-slate-100">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Calculator className="h-5 w-5 text-emerald-400" />
            </div>
            Resumen de Balances
          </CardTitle>
          <CardDescription className="text-slate-400">
            Total de gastos: ${totalExpenses.toFixed(2)} • Promedio por persona: ${averagePerPerson.toFixed(2)}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
              <div className="text-3xl font-bold text-green-400 mb-2">{creditors.length}</div>
              <div className="text-sm text-green-300">Deben Recibir</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-lg border border-red-500/20">
              <div className="text-3xl font-bold text-red-400 mb-2">{debtors.length}</div>
              <div className="text-sm text-red-300">Deben Pagar</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-slate-500/10 to-gray-500/10 rounded-lg border border-slate-500/20">
              <div className="text-3xl font-bold text-slate-400 mb-2">{settled.length}</div>
              <div className="text-sm text-slate-300">Saldados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Balances */}
      <Card className="backdrop-blur-md bg-slate-900/40 border-slate-700/50 shadow-2xl">
        <CardHeader className="border-b border-slate-700/30">
          <CardTitle className="text-slate-100">Balances Individuales</CardTitle>
          <CardDescription className="text-slate-400">Ve lo que cada persona pagó y debe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-6">
          {people.map((person) => {
            const balance = balances[person.id]
            const isCreditor = balance.net > 0.01
            const isDebtor = balance.net < -0.01

            return (
              <div
                key={person.id}
                className="flex items-center justify-between p-4 bg-slate-800/20 rounded-lg border border-slate-700/30"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-slate-600/30 flex items-center justify-center">
                    <span className="text-sm font-semibold text-slate-300">{person.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200 text-lg">{person.name}</div>
                    <div className="text-sm text-slate-400">
                      Pagó ${balance.paid.toFixed(2)} • Debe ${balance.owes.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {isCreditor && (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +${balance.net.toFixed(2)}
                    </Badge>
                  )}
                  {isDebtor && (
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30 flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" />${Math.abs(balance.net).toFixed(2)}
                    </Badge>
                  )}
                  {!isCreditor && !isDebtor && (
                    <Badge className="bg-slate-500/20 text-slate-300 border-slate-500/30">Saldado</Badge>
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Settlement Suggestions */}
      {settlements.length > 0 && (
        <Card className="backdrop-blur-md bg-slate-900/40 border-slate-700/50 shadow-2xl">
          <CardHeader className="border-b border-slate-700/30">
            <CardTitle className="text-slate-100">Sugerencias de Liquidación</CardTitle>
            <CardDescription className="text-slate-400">
              Forma óptima de saldar todas las deudas con el mínimo de transacciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {settlements.map((settlement, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-slate-600/50 flex items-center justify-center">
                      <span className="text-xs font-semibold text-slate-300">
                        {settlement.from.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-slate-200">{settlement.from.name}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 border border-slate-600/50 flex items-center justify-center">
                      <span className="text-xs font-semibold text-slate-300">
                        {settlement.to.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-slate-200">{settlement.to.name}</span>
                  </div>
                </div>
                <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30 font-semibold text-lg px-3 py-1">
                  ${settlement.amount.toFixed(2)}
                </Badge>
              </div>
            ))}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 bg-slate-800/30 border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartir Resumen
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-slate-800/30 border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
