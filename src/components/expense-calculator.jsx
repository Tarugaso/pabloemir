"use client"

import { useState } from "react"
import { PeopleManager } from "./people-manager"
import ExpenseForm from "./ExpenseForm"
import ExpenseList from "./ExpenseList"
import { BalanceSummary } from "./balance-summary"
import { useExpenseCalculator } from '../hooks/useExpenseCalculator'

export default function ExpenseCalculator() {
  const {
    participants,
    expenses,
    addParticipant,
    removeParticipant,
    updateParticipant,
    addExpense,
    removeExpense,
    clearAllData
  } = useExpenseCalculator();

  // Convertir participantes al formato esperado por los nuevos componentes
  const people = participants.map(p => ({ id: p.id, name: p.name }));

  const handleAddPerson = (personData) => {
    addParticipant(personData);
  };

  const handleRemovePerson = (id) => {
    removeParticipant(id);
  };

  const handleAddExpense = (expenseData) => {
    addExpense(expenseData);
  };

  const handleDeleteExpense = (id) => {
    removeExpense(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="clean-container">
        {/* Encabezado Simple */}
        <header className="text-center mb-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            💰 Calculadora de Gastos Compartidos
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Divide los gastos de manera justa y transparente entre amigos y compañeros
          </p>
        </header>

        {/* Contenido Principal - Secciones Claramente Definidas */}
        <main className="space-y-8">
          {/* Sección 1: Gestión de Participantes */}
          <section className="simple-card">
            <h2 className="section-header">👥 Participantes</h2>
            <PeopleManager
              people={people}
              onAddPerson={handleAddPerson}
              onRemovePerson={handleRemovePerson}
            />
          </section>

          {/* Sección 2: Registro de Gastos */}
          {people.length > 0 && (
            <section className="simple-card">
              <h2 className="section-header">💳 Registrar Gasto</h2>
              <ExpenseForm
                participants={participants}
                onAddExpense={handleAddExpense}
              />
            </section>
          )}

          {/* Sección 3: Resumen y Lista de Gastos */}
          {people.length > 0 && (
            <div className="clean-grid">
              {/* Lista de Gastos */}
              <section className="simple-card">
                <h2 className="section-header">📋 Lista de Gastos</h2>
                <ExpenseList
                  expenses={expenses}
                  participants={participants}
                  onRemoveExpense={handleDeleteExpense}
                />
              </section>

              {/* Resumen de Balances */}
              <section className="simple-card">
                <h2 className="section-header">⚖️ Resumen de Balances</h2>
                <BalanceSummary
                  people={people}
                  expenses={expenses}
                />
              </section>
            </div>
          )}
        </main>

        {/* Pie de página */}
        <footer className="text-center mt-12 py-8 border-t border-border">
          <p className="text-muted-foreground text-sm">
            Desarrollado con ❤️ para dividir gastos de manera justa entre amigos
          </p>
        </footer>
      </div>
    </div>
  )
}
