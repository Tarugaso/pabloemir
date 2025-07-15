import React from 'react';

const ExpenseList = ({ expenses, participants, onRemoveExpense }) => {
  const getParticipantName = (participantId) => {
    const participant = participants.find(p => p.id === participantId);
    return participant ? participant.name : 'Desconocido';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleRemoveExpense = (expenseId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
      onRemoveExpense(expenseId);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="card">
        <h2>Lista de Gastos</h2>
        <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
          No hay gastos registrados. Agrega algunos gastos para comenzar a dividir cuentas.
        </p>
      </div>
    );
  }

  // Sort expenses by date (most recent first)
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="card">
      <h2>Lista de Gastos ({expenses.length})</h2>
      
      <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        {sortedExpenses.map(expense => (
          <div key={expense.id} className="expense-card">
            <div className="expense-header">
              <div className="expense-title">
                <h3>{expense.description}</h3>
                <p className="expense-date">{formatDate(expense.date)}</p>
              </div>
              <div className="expense-amount">
                <div className="expense-amount-value">
                  {formatCurrency(expense.amount)}
                </div>
                <button
                  onClick={() => handleRemoveExpense(expense.id)}
                  className="btn btn-danger btn-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>

            <div className="expense-details">
              <div className="expense-detail-item">
                <div className="expense-detail-label">Pagado por:</div>
                <div className="expense-detail-value" style={{ color: '#28a745', fontWeight: '500' }}>
                  {getParticipantName(expense.paidBy)}
                </div>
              </div>

              <div className="expense-detail-item">
                <div className="expense-detail-label">Dividido entre:</div>
                <div className="expense-detail-value">
                  {expense.participants.map(participantId => getParticipantName(participantId)).join(', ')}
                </div>
              </div>

              <div className="expense-detail-item">
                <div className="expense-detail-label">Por persona:</div>
                <div className="expense-detail-value" style={{ fontWeight: '500' }}>
                  {formatCurrency(expense.amount / expense.participants.length)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 'var(--spacing-xl)',
        padding: 'var(--spacing-lg)',
        backgroundColor: '#e9ecef',
        borderRadius: '8px'
      }}>
        <h3 style={{ margin: '0 0 var(--spacing-md) 0' }}>Resumen</h3>
        <div className="expense-details">
          <div className="expense-detail-item">
            <div className="expense-detail-label">Total gastado:</div>
            <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'bold', color: '#007bff' }}>
              {formatCurrency(expenses.reduce((sum, expense) => sum + expense.amount, 0))}
            </div>
          </div>
          <div className="expense-detail-item">
            <div className="expense-detail-label">Gasto promedio:</div>
            <div style={{ fontSize: 'var(--font-size-base)', fontWeight: '500' }}>
              {formatCurrency(expenses.reduce((sum, expense) => sum + expense.amount, 0) / expenses.length)}
            </div>
          </div>
          <div className="expense-detail-item">
            <div className="expense-detail-label">Número de gastos:</div>
            <div style={{ fontSize: 'var(--font-size-base)', fontWeight: '500' }}>
              {expenses.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;
