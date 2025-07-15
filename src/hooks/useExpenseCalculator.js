import { useState, useEffect, useCallback } from 'react';
import { validateStorageData, safeLocalStorage, debounce } from '../utils/errorHandling';

// Utility functions for localStorage
const STORAGE_KEY = 'expense-calculator-data';

const loadFromStorage = () => {
  try {
    const data = safeLocalStorage.get(STORAGE_KEY);
    if (data) {
      return validateStorageData(data);
    }
    return null;
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    // If data is corrupted, clear it and start fresh
    safeLocalStorage.remove(STORAGE_KEY);
    return null;
  }
};

const saveToStorage = debounce((data) => {
  try {
    safeLocalStorage.set(STORAGE_KEY, data);
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
    // Could show a toast notification here in a real app
  }
}, 500); // Debounce saves to avoid excessive localStorage writes

// Initial state
const getInitialState = () => {
  const saved = loadFromStorage();
  return saved || {
    participants: [],
    expenses: [],
    nextParticipantId: 1,
    nextExpenseId: 1
  };
};

export const useExpenseCalculator = () => {
  const [state, setState] = useState(getInitialState);

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  // Participant management
  const addParticipant = useCallback((name) => {
    if (!name.trim()) return false;
    
    // Check if participant already exists
    const exists = state.participants.some(p => 
      p.name.toLowerCase() === name.trim().toLowerCase()
    );
    
    if (exists) return false;

    setState(prev => ({
      ...prev,
      participants: [...prev.participants, {
        id: prev.nextParticipantId,
        name: name.trim()
      }],
      nextParticipantId: prev.nextParticipantId + 1
    }));
    
    return true;
  }, [state.participants]);

  const removeParticipant = useCallback((participantId) => {
    setState(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.id !== participantId),
      expenses: prev.expenses.filter(e => 
        e.paidBy !== participantId && 
        !e.participants.includes(participantId)
      )
    }));
  }, []);

  const updateParticipant = useCallback((participantId, updatedData) => {
    // Handle both old format (just name) and new format (full participant object)
    if (typeof updatedData === 'string') {
      if (!updatedData.trim()) return false;

      setState(prev => ({
        ...prev,
        participants: prev.participants.map(p =>
          p.id === participantId ? { ...p, name: updatedData.trim() } : p
        )
      }));
    } else {
      // New format: full participant object with transferInfo, etc.
      setState(prev => ({
        ...prev,
        participants: prev.participants.map(p =>
          p.id === participantId ? { ...p, ...updatedData } : p
        )
      }));
    }

    return true;
  }, []);

  // Expense management
  const addExpense = useCallback((expenseData) => {
    const { description, amount, date, paidBy, participants } = expenseData;
    
    if (!description.trim() || amount <= 0 || !paidBy || participants.length === 0) {
      return false;
    }

    setState(prev => ({
      ...prev,
      expenses: [...prev.expenses, {
        id: prev.nextExpenseId,
        description: description.trim(),
        amount: parseFloat(amount),
        date: date || new Date().toISOString().split('T')[0],
        paidBy: parseInt(paidBy),
        participants: participants.map(id => parseInt(id))
      }],
      nextExpenseId: prev.nextExpenseId + 1
    }));
    
    return true;
  }, []);

  const removeExpense = useCallback((expenseId) => {
    setState(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== expenseId)
    }));
  }, []);

  const updateExpense = useCallback((expenseId, expenseData) => {
    const { description, amount, date, paidBy, participants } = expenseData;
    
    if (!description.trim() || amount <= 0 || !paidBy || participants.length === 0) {
      return false;
    }

    setState(prev => ({
      ...prev,
      expenses: prev.expenses.map(e => 
        e.id === expenseId ? {
          ...e,
          description: description.trim(),
          amount: parseFloat(amount),
          date: date || e.date,
          paidBy: parseInt(paidBy),
          participants: participants.map(id => parseInt(id))
        } : e
      )
    }));
    
    return true;
  }, []);

  // Clear all data
  const clearAllData = useCallback(() => {
    const initialState = {
      participants: [],
      expenses: [],
      nextParticipantId: 1,
      nextExpenseId: 1
    };
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    participants: state.participants,
    expenses: state.expenses,
    addParticipant,
    removeParticipant,
    updateParticipant,
    addExpense,
    removeExpense,
    updateExpense,
    clearAllData
  };
};
