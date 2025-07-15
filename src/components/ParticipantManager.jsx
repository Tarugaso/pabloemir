import React, { useState } from 'react';

const ParticipantManager = ({ 
  participants, 
  onAddParticipant, 
  onRemoveParticipant, 
  onUpdateParticipant 
}) => {
  const [newParticipantName, setNewParticipantName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [error, setError] = useState('');

  const handleAddParticipant = (e) => {
    e.preventDefault();
    setError('');

    if (!newParticipantName.trim()) {
      setError('El nombre no puede estar vacío');
      return;
    }

    const success = onAddParticipant(newParticipantName);
    if (success) {
      setNewParticipantName('');
    } else {
      setError('Este participante ya existe');
    }
  };

  const handleStartEdit = (participant) => {
    setEditingId(participant.id);
    setEditingName(participant.name);
    setError('');
  };

  const handleSaveEdit = () => {
    setError('');

    if (!editingName.trim()) {
      setError('El nombre no puede estar vacío');
      return;
    }

    const success = onUpdateParticipant(editingId, editingName);
    if (success) {
      setEditingId(null);
      setEditingName('');
    } else {
      setError('Error al actualizar el participante');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setError('');
  };

  const handleRemoveParticipant = (participantId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este participante? También se eliminarán todos los gastos relacionados.')) {
      onRemoveParticipant(participantId);
    }
  };

  return (
    <div className="card">
      <h2>Participantes</h2>
      
      {/* Add new participant form */}
      <form onSubmit={handleAddParticipant} className="form-group">
        <label htmlFor="newParticipant">Agregar nuevo participante:</label>
        <div className="form-row">
          <div style={{ flex: 1 }}>
            <input
              id="newParticipant"
              type="text"
              value={newParticipantName}
              onChange={(e) => setNewParticipantName(e.target.value)}
              placeholder="Nombre del participante"
              maxLength={50}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Agregar
          </button>
        </div>
      </form>

      {error && (
        <div style={{ color: '#dc3545', marginBottom: '15px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {/* Participants list */}
      {participants.length === 0 ? (
        <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
          No hay participantes agregados. Agrega algunos para comenzar a dividir gastos.
        </p>
      ) : (
        <div>
          <h3>Lista de participantes ({participants.length})</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {participants.map(participant => (
              <div 
                key={participant.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: editingId === participant.id ? '#f8f9fa' : 'transparent'
                }}
              >
                {editingId === participant.id ? (
                  <div className="form-row" style={{ flex: 1 }}>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      style={{ flex: 1 }}
                      maxLength={50}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="btn btn-success btn-sm"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="btn btn-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <>
                    <span style={{ fontWeight: '500' }}>{participant.name}</span>
                    <div className="form-row" style={{ gap: 'var(--spacing-xs)' }}>
                      <button
                        onClick={() => handleStartEdit(participant)}
                        className="btn btn-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleRemoveParticipant(participant.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantManager;
