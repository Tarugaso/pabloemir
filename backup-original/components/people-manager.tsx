"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Trash2, UserCheck } from "lucide-react"

interface Person {
  id: string
  name: string
}

interface PeopleManagerProps {
  people: Person[]
  onAddPerson: (person: Omit<Person, "id">) => void
  onRemovePerson: (id: string) => void
}

export function PeopleManager({ people, onAddPerson, onRemovePerson }: PeopleManagerProps) {
  const [newPersonName, setNewPersonName] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPersonName.trim()) return

    setIsAdding(true)

    // Simular llamada API
    await new Promise((resolve) => setTimeout(resolve, 300))

    onAddPerson({
      name: newPersonName.trim(),
    })

    setNewPersonName("")
    setIsAdding(false)
  }

  return (
    <Card className="backdrop-blur-md bg-slate-900/40 border-slate-700/50 shadow-2xl">
      <CardHeader className="border-b border-slate-700/30">
        <CardTitle className="flex items-center gap-3 text-slate-100">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <Users className="h-5 w-5 text-blue-400" />
          </div>
          Gestionar Participantes
        </CardTitle>
        <CardDescription className="text-slate-400">
          Agrega a las personas que participarán en la división de gastos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Formulario para agregar persona */}
        <form onSubmit={handleAddPerson} className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Nombre del participante"
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
              className="flex-1 bg-slate-800/50 border-slate-600/50 text-slate-100 placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-blue-400/20"
            />
            <Button
              type="submit"
              disabled={isAdding || !newPersonName.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-lg"
            >
              {isAdding ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>

        {/* Lista de personas */}
        <div className="space-y-4">
          {people.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <div className="p-4 rounded-full bg-slate-800/30 w-fit mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-slate-500" />
              </div>
              <p className="text-lg font-medium mb-2">No hay participantes aún</p>
              <p className="text-sm">Agrega tu primer participante para comenzar</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-200">Participantes ({people.length})</h3>
                <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 border-slate-600/50">
                  {people.length} {people.length === 1 ? "persona" : "personas"}
                </Badge>
              </div>

              <div className="space-y-3">
                {people.map((person, index) => (
                  <div
                    key={person.id}
                    className="group flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200 hover:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-slate-600/30 flex items-center justify-center">
                        <span className="text-sm font-semibold text-slate-300">
                          {person.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-slate-200">{person.name}</div>
                        <div className="text-xs text-slate-500">Participante #{index + 1}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemovePerson(person.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
