"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Receipt, Calendar, User } from "lucide-react"

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

interface ExpenseListProps {
  expenses: Expense[]
  people: Person[]
  onDeleteExpense: (id: string) => void
}

const categories = {
  food: { label: "🍽️ Comida y Bebidas", color: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
  transport: { label: "🚗 Transporte", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  entertainment: { label: "🎮 Entretenimiento", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  accommodation: { label: "🏠 Alojamiento", color: "bg-green-500/20 text-green-300 border-green-500/30" },
  other: { label: "📦 Otros", color: "bg-gray-500/20 text-gray-300 border-gray-500/30" },
}

export function ExpenseList({ expenses, people, onDeleteExpense }: ExpenseListProps) {
  const getPerson = (id: string) => people.find((p) => p.id === id)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (expenses.length === 0) {
    return (
      <Card className="backdrop-blur-md bg-slate-900/40 border-slate-700/50 shadow-2xl">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="p-6 rounded-full bg-slate-800/30 mb-6">
            <Receipt className="h-12 w-12 text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-3">No hay gastos registrados</h3>
          <p className="text-slate-500 text-center max-w-md">
            Comienza agregando tu primer gasto compartido usando el formulario de arriba
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="backdrop-blur-md bg-slate-900/40 border-slate-700/50 shadow-2xl">
      <CardHeader className="border-b border-slate-700/30">
        <CardTitle className="flex items-center gap-3 text-slate-100">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <Receipt className="h-5 w-5 text-purple-400" />
          </div>
          Gastos Recientes
        </CardTitle>
        <CardDescription className="text-slate-400">
          {expenses.length} {expenses.length === 1 ? "gasto" : "gastos"} • Total: $
          {expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {expenses.map((expense) => {
          const paidByPerson = getPerson(expense.paidBy)
          const participantCount = expense.participants.length
          const amountPerPerson = expense.amount / participantCount

          return (
            <div
              key={expense.id}
              className="group p-5 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200 hover:bg-slate-800/30 bg-slate-800/20"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="font-semibold text-slate-200 truncate text-lg">{expense.description}</h4>
                    <Badge
                      variant="secondary"
                      className={categories[expense.category as keyof typeof categories]?.color}
                    >
                      {categories[expense.category as keyof typeof categories]?.label}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-slate-400 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(expense.date)}
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{paidByPerson?.name} pagó</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-400">
                      Dividido entre {participantCount} {participantCount === 1 ? "persona" : "personas"} • $
                      {amountPerPerson.toFixed(2)} cada uno
                    </div>
                    <div className="text-2xl font-bold text-green-400">${expense.amount.toFixed(2)}</div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteExpense(expense.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-4 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
