/**
 * Error handling utilities for the expense calculator
 */

export class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', details = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Validate and sanitize data loaded from localStorage
 */
export const validateStorageData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new AppError('Datos inválidos en el almacenamiento', 'INVALID_STORAGE_DATA');
  }

  const errors = [];

  // Validate participants
  if (!Array.isArray(data.participants)) {
    errors.push('Lista de participantes inválida');
  } else {
    data.participants.forEach((participant, index) => {
      if (!participant || typeof participant !== 'object') {
        errors.push(`Participante ${index + 1} tiene formato inválido`);
      } else {
        if (typeof participant.id !== 'number' || participant.id <= 0) {
          errors.push(`Participante ${index + 1} tiene ID inválido`);
        }
        if (typeof participant.name !== 'string' || !participant.name.trim()) {
          errors.push(`Participante ${index + 1} tiene nombre inválido`);
        }
      }
    });
  }

  // Validate expenses
  if (!Array.isArray(data.expenses)) {
    errors.push('Lista de gastos inválida');
  } else {
    data.expenses.forEach((expense, index) => {
      if (!expense || typeof expense !== 'object') {
        errors.push(`Gasto ${index + 1} tiene formato inválido`);
      } else {
        if (typeof expense.id !== 'number' || expense.id <= 0) {
          errors.push(`Gasto ${index + 1} tiene ID inválido`);
        }
        if (typeof expense.description !== 'string' || !expense.description.trim()) {
          errors.push(`Gasto ${index + 1} tiene descripción inválida`);
        }
        if (typeof expense.amount !== 'number' || expense.amount <= 0) {
          errors.push(`Gasto ${index + 1} tiene monto inválido`);
        }
        if (typeof expense.paidBy !== 'number' || expense.paidBy <= 0) {
          errors.push(`Gasto ${index + 1} tiene pagador inválido`);
        }
        if (!Array.isArray(expense.participants) || expense.participants.length === 0) {
          errors.push(`Gasto ${index + 1} tiene participantes inválidos`);
        }
        if (typeof expense.date !== 'string' || !isValidDate(expense.date)) {
          errors.push(`Gasto ${index + 1} tiene fecha inválida`);
        }
      }
    });
  }

  // Validate counters
  if (typeof data.nextParticipantId !== 'number' || data.nextParticipantId <= 0) {
    errors.push('Contador de participantes inválido');
  }
  if (typeof data.nextExpenseId !== 'number' || data.nextExpenseId <= 0) {
    errors.push('Contador de gastos inválido');
  }

  if (errors.length > 0) {
    throw new AppError(
      'Los datos almacenados están corruptos',
      'CORRUPTED_DATA',
      errors
    );
  }

  return sanitizeData(data);
};

/**
 * Sanitize data to ensure consistency
 */
const sanitizeData = (data) => {
  return {
    participants: data.participants.map(p => ({
      id: parseInt(p.id),
      name: p.name.trim()
    })),
    expenses: data.expenses.map(e => ({
      id: parseInt(e.id),
      description: e.description.trim(),
      amount: parseFloat(e.amount),
      date: e.date,
      paidBy: parseInt(e.paidBy),
      participants: e.participants.map(id => parseInt(id))
    })),
    nextParticipantId: parseInt(data.nextParticipantId),
    nextExpenseId: parseInt(data.nextExpenseId)
  };
};

/**
 * Check if a date string is valid
 */
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Safe localStorage operations
 */
export const safeLocalStorage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      throw new AppError(
        'Error al leer datos guardados',
        'STORAGE_READ_ERROR',
        error.message
      );
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      if (error.name === 'QuotaExceededError') {
        throw new AppError(
          'No hay suficiente espacio para guardar los datos',
          'STORAGE_QUOTA_EXCEEDED'
        );
      }
      throw new AppError(
        'Error al guardar datos',
        'STORAGE_WRITE_ERROR',
        error.message
      );
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      throw new AppError(
        'Error al eliminar datos guardados',
        'STORAGE_REMOVE_ERROR',
        error.message
      );
    }
  }
};

/**
 * Format error messages for user display
 */
export const formatErrorMessage = (error) => {
  if (error instanceof AppError) {
    switch (error.code) {
      case 'INVALID_STORAGE_DATA':
      case 'CORRUPTED_DATA':
        return {
          title: 'Datos corruptos',
          message: 'Los datos guardados están dañados. Se recomienda reiniciar la aplicación.',
          action: 'restart'
        };
      case 'STORAGE_QUOTA_EXCEEDED':
        return {
          title: 'Almacenamiento lleno',
          message: 'No hay suficiente espacio para guardar más datos. Elimina algunos gastos o participantes.',
          action: 'cleanup'
        };
      case 'STORAGE_READ_ERROR':
      case 'STORAGE_WRITE_ERROR':
        return {
          title: 'Error de almacenamiento',
          message: 'Hubo un problema al acceder a los datos guardados. Intenta recargar la página.',
          action: 'reload'
        };
      default:
        return {
          title: 'Error inesperado',
          message: error.message || 'Ocurrió un error inesperado.',
          action: 'retry'
        };
    }
  }

  return {
    title: 'Error',
    message: error.message || 'Ocurrió un error inesperado.',
    action: 'retry'
  };
};

/**
 * Debounce function for performance optimization
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
