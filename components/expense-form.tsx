"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, DollarSign, Tag, Receipt } from "lucide-react"

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

interface ExpenseFormProps {
  people: Person[]
  onAddExpense: (expense: Omit<Expense, "id">) => void
}

const categories = [
  { value: "food", label: "🍽️ Comida y Bebidas", color: "from-orange-500/20 to-red-500/20" },
  { value: "transport", label: "🚗 Transporte", color: "from-blue-500/20 to-cyan-500/20" },
  { value: "entertainment", label: "🎮 Entretenimiento", color: "from-purple-500/20 to-pink-500/20" },
  { value: "accommodation", label: "🏠 Alojamiento", color: "from-green-500/20 to-emerald-500/20" },
  { value: "other", label: "📦 Otros", color: "from-gray-500/20 to-slate-500/20" },
]

export function ExpenseForm({ people, onAddExpense }: ExpenseFormProps) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [paidBy, setPaidBy] = useState("")
  const [category, setCategory] = useState("")
  const [participants, setParticipants] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !amount || !paidBy || !category) return

    setIsSubmitting(true)

    // Simular llamada API
    await new Promise((resolve) => setTimeout(resolve, 500))

    onAddExpense({
      description,
      amount: Number.parseFloat(amount),
      paidBy,
      category,
      date: new Date().toISOString(),
      participants: participants.length > 0 ? participants : people.map((p) => p.id),
    })

    // Resetear formulario
    setDescription("")
    setAmount("")
    setPaidBy("")
    setCategory("")
    setParticipants([])
    setIsSubmitting(false)
  }

  const toggleParticipant = (personId: string) => {
    setParticipants((prev) => (prev.includes(personId) ? prev.filter((id) => id !== personId) : [...prev, personId]))
  }

  return (
    <Card className="backdrop-blur-md bg-slate-900/40 border-slate-700/50 shadow-2xl">
      <CardHeader className="border-b border-slate-700/30">
        <CardTitle className="flex items-center gap-3 text-slate-100">
          <div className="p-2 rounded-lg bg-green-500/20">
            <Receipt className="h-5 w-5 text-green-400" />
          </div>
          Agregar Nuevo Gasto
        </CardTitle>
        <CardDescription className="text-slate-400">
          Registra un gasto compartido y divídelo entre los participantes
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2 text-slate-300">
                <Tag className="h-4 w-4" />
                Descripción
              </Label>
              <Textarea
                id="description"
                placeholder="¿En qué se gastó el dinero?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none bg-slate-800/50 border-slate-600/50 text-slate-100 placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-blue-400/20"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2 text-slate-300">
                <DollarSign className="h-4 w-4" />
                Monto
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg font-semibold bg-slate-800/50 border-slate-600/50 text-slate-100 placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-blue-400/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-300">¿Quién pagó?</Label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-slate-100 focus:border-blue-400/50 focus:ring-blue-400/20">
                  <SelectValue placeholder="Seleccionar quien pagó" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {people.map((person) => (
                    <SelectItem key={person.id} value={person.id} className="text-slate-100 focus:bg-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-slate-600/50 flex items-center justify-center">
                          <span className="text-xs font-semibold text-slate-300">
                            {person.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        {person.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Categoría</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-slate-800/50 border-slate-600/50 text-slate-100 focus:border-blue-400/50 focus:ring-blue-400/20">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="text-slate-100 focus:bg-slate-700">
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-slate-300">¿Quién debe dividir este gasto?</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={participants.length === 0 ? "default" : "outline"}
                size="sm"
                onClick={() => setParticipants([])}
                className={`text-xs ${
                  participants.length === 0
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                Todos
              </Button>
              {people.map((person) => (
                <Button
                  key={person.id}
                  type="button"
                  variant={participants.includes(person.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleParticipant(person.id)}
                  className={`text-xs ${
                    participants.includes(person.id)
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-slate-600/50 flex items-center justify-center mr-2">
                    <span className="text-xs font-semibold text-slate-300">{person.name.charAt(0).toUpperCase()}</span>
                  </div>
                  {person.name}
                </Button>
              ))}
            </div>
            {participants.length > 0 && (
              <p className="text-sm text-slate-400">
                Dividir entre {participants.length} {participants.length === 1 ? "persona" : "personas"}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] border-0"
            disabled={isSubmitting || !description || !amount || !paidBy || !category}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Agregando Gasto...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Agregar Gasto
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
