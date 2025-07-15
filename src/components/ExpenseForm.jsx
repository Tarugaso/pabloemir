import React, { useState } from 'react';
import { validateExpense } from '../utils/calculations';

const ExpenseForm = ({ participants, onAddExpense }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paidBy: '',
    participants: []
  });
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleParticipantToggle = (participantId) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.includes(participantId)
        ? prev.participants.filter(id => id !== participantId)
        : [...prev.participants, participantId]
    }));
    
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSelectAllParticipants = () => {
    setFormData(prev => ({
      ...prev,
      participants: participants.map(p => p.id)
    }));
  };

  const handleClearParticipants = () => {
    setFormData(prev => ({
      ...prev,
      participants: []
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    // Validate form data
    const validationErrors = validateExpense(formData, participants);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    // Try to add expense
    const success = onAddExpense(formData);
    
    if (success) {
      // Reset form
      setFormData({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        paidBy: '',
        participants: []
      });
    } else {
      setErrors(['Error al agregar el gasto. Por favor, verifica los datos.']);
    }
    
    setIsSubmitting(false);
  };

  if (participants.length === 0) {
    return (
      <div className="card">
        <h2>Agregar Gasto</h2>
        <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
          Necesitas agregar al menos un participante antes de poder registrar gastos.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Agregar Nuevo Gasto</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Descripción del gasto *</label>
          <input
            id="description"
            name="description"
            type="text"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Ej: Cena en restaurante, Gasolina, Supermercado..."
            maxLength={100}
            required
          />
        </div>

        {/* Amount */}
        <div className="form-group">
          <label htmlFor="amount">Monto *</label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="0.00"
            required
          />
        </div>

        {/* Date */}
        <div className="form-group">
          <label htmlFor="date">Fecha</label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
          />
        </div>

        {/* Paid by */}
        <div className="form-group">
          <label htmlFor="paidBy">¿Quién pagó? *</label>
          <select
            id="paidBy"
            name="paidBy"
            value={formData.paidBy}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecciona quién pagó</option>
            {participants.map(participant => (
              <option key={participant.id} value={participant.id}>
                {participant.name}
              </option>
            ))}
          </select>
        </div>

        {/* Participants */}
        <div className="form-group">
          <label>¿Quién debe dividir este gasto? *</label>
          <div className="form-row" style={{ marginBottom: 'var(--spacing-md)' }}>
            <button
              type="button"
              onClick={handleSelectAllParticipants}
              className="btn btn-sm"
            >
              Seleccionar todos
            </button>
            <button
              type="button"
              onClick={handleClearParticipants}
              className="btn btn-sm"
            >
              Limpiar selección
            </button>
          </div>
          <div className="checkbox-group">
            {participants.map(participant => (
              <label
                key={participant.id}
                className={`checkbox-item ${formData.participants.includes(participant.id) ? 'selected' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={formData.participants.includes(participant.id)}
                  onChange={() => handleParticipantToggle(participant.id)}
                />
                <span>{participant.name}</span>
              </label>
            ))}
          </div>
          {formData.participants.length > 0 && (
            <p style={{ fontSize: '12px', color: '#6c757d', marginTop: '5px' }}>
              {formData.participants.length} participante(s) seleccionado(s)
              {formData.amount && ` - ${(parseFloat(formData.amount) / formData.participants.length).toFixed(2)} por persona`}
            </p>
          )}
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div style={{ 
            color: '#dc3545', 
            backgroundColor: '#f8d7da', 
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            padding: '10px',
            marginBottom: '15px'
          }}>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit button */}
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting}
          style={{ width: '100%' }}
        >
          {isSubmitting ? 'Agregando...' : 'Agregar Gasto'}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
