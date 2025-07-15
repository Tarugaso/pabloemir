"use client";
import { useState } from "react"

export function PeopleManager({
  people,
  onAddPerson,
  onRemovePerson
}) {
  const [newPersonName, setNewPersonName] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const handleAddPerson = async (e) => {
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
    <div className="space-y-6">
      {/* Formulario para agregar persona */}
      <form onSubmit={handleAddPerson} className="flex gap-3">
        <input
          type="text"
          placeholder="Nombre del participante"
          value={newPersonName}
          onChange={(e) => setNewPersonName(e.target.value)}
          className="simple-input flex-1"
        />
        <button
          type="submit"
          disabled={isAdding || !newPersonName.trim()}
          className="simple-button"
        >
          {isAdding ? "..." : "Agregar"}
        </button>
      </form>

      {/* Lista de personas */}
      <div>
        {people.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-lg mb-2">No hay participantes aún</p>
            <p className="text-sm">Agrega tu primer participante para comenzar</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">
                Participantes ({people.length})
              </h3>
              <span className="simple-badge badge-info">
                {people.length} {people.length === 1 ? "persona" : "personas"}
              </span>
            </div>

            <div className="space-y-3">
              {people.map((person, index) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                      {person.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{person.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Participante #{index + 1}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemovePerson(person.id)}
                    className="simple-button-danger text-sm px-3 py-1"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
