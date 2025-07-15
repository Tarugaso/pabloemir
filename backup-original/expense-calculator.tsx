"use client"

import { useState } from "react"
import { AnimatedBackground } from "./components/animated-background"
import { PeopleManager } from "./components/people-manager"
import { ExpenseForm } from "./components/expense-form"
import { ExpenseList } from "./components/expense-list"
import { BalanceSummary } from "./components/balance-summary"

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

export default function Component() {
  const [people, setPeople] = useState<Person[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])

  const addPerson = (personData: Omit<Person, "id">) => {
    const newPerson: Person = {
      id: Date.now().toString(),
      ...personData,
    }
    setPeople((prev) => [...prev, newPerson])
  }

  const removePerson = (id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id))
    setExpenses((prev) => prev.filter((e) => e.paidBy !== id))
  }

  const addExpense = (expenseData: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      ...expenseData,
    }
    setExpenses((prev) => [newExpense, ...prev])
  }

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 container mx-auto p-4 max-w-7xl">
        {/* Encabezado */}
        <div className="text-center mb-12 pt-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">💰 Calculadora de Gastos</h1>
          <p className="text-white/80 text-xl md:text-2xl drop-shadow-lg max-w-3xl mx-auto leading-relaxed">
            Divide los gastos de manera justa y transparente entre amigos y compañeros
          </p>
        </div>

        {/* Contenido Principal */}
        <div className="space-y-8">
          {/* Gestión de Personas */}
          <div className="max-w-4xl mx-auto">
            <PeopleManager people={people} onAddPerson={addPerson} onRemovePerson={removePerson} />
          </div>

          {/* Formulario de Gastos - Solo mostrar si hay personas */}
          {people.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <ExpenseForm people={people} onAddExpense={addExpense} />
            </div>
          )}

          {/* Cuadrícula de Contenido */}
          {people.length > 0 && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Lista de Gastos */}
              <div className="xl:col-span-2">
                <ExpenseList expenses={expenses} people={people} onDeleteExpense={deleteExpense} />
              </div>

              {/* Resumen de Balances */}
              <div className="xl:col-span-1">
                <BalanceSummary people={people} expenses={expenses} />
              </div>
            </div>
          )}
        </div>

        {/* Pie de página */}
        <div className="text-center mt-20 pb-8">
          <p className="text-white/60 text-sm">Desarrollado con ❤️ para dividir gastos de manera justa entre amigos</p>
        </div>
      </div>
    </div>
  )
}
