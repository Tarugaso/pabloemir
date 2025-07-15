/**
 * Calculate balances for each participant
 * Returns an object with participant IDs as keys and their balance as values
 * Positive balance = person is owed money
 * Negative balance = person owes money
 */
export const calculateBalances = (participants, expenses) => {
  const balances = {};
  
  // Initialize balances to 0
  participants.forEach(participant => {
    balances[participant.id] = 0;
  });

  // Process each expense
  expenses.forEach(expense => {
    const { amount, paidBy, participants: expenseParticipants } = expense;
    const splitAmount = amount / expenseParticipants.length;

    // Add the full amount to the person who paid
    balances[paidBy] += amount;

    // Subtract the split amount from each participant
    expenseParticipants.forEach(participantId => {
      balances[participantId] -= splitAmount;
    });
  });

  return balances;
};

/**
 * Calculate optimal settlements to minimize number of transactions
 * Uses a greedy algorithm to pair highest creditor with highest debtor
 */
export const calculateSettlements = (participants, balances) => {
  const settlements = [];
  const participantMap = {};
  
  // Create a map for quick participant lookup
  participants.forEach(participant => {
    participantMap[participant.id] = participant;
  });

  // Create arrays of creditors (positive balance) and debtors (negative balance)
  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([participantId, balance]) => {
    const id = parseInt(participantId);
    if (balance > 0.01) { // Small threshold to handle floating point precision
      creditors.push({ id, amount: balance });
    } else if (balance < -0.01) {
      debtors.push({ id, amount: Math.abs(balance) });
    }
  });

  // Sort creditors and debtors by amount (descending)
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  // Match creditors with debtors
  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];

    const settlementAmount = Math.min(creditor.amount, debtor.amount);

    if (settlementAmount > 0.01) { // Only create settlement if amount is significant
      settlements.push({
        from: debtor.id,
        fromName: participantMap[debtor.id]?.name || 'Unknown',
        to: creditor.id,
        toName: participantMap[creditor.id]?.name || 'Unknown',
        amount: Math.round(settlementAmount * 100) / 100 // Round to 2 decimal places
      });

      creditor.amount -= settlementAmount;
      debtor.amount -= settlementAmount;
    }

    // Move to next creditor or debtor if current one is settled
    if (creditor.amount <= 0.01) {
      creditorIndex++;
    }
    if (debtor.amount <= 0.01) {
      debtorIndex++;
    }
  }

  return settlements;
};

/**
 * Get expense statistics
 */
export const getExpenseStats = (expenses) => {
  if (expenses.length === 0) {
    return {
      totalAmount: 0,
      expenseCount: 0,
      averageExpense: 0,
      largestExpense: 0,
      smallestExpense: 0
    };
  }

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const amounts = expenses.map(expense => expense.amount);

  return {
    totalAmount: Math.round(totalAmount * 100) / 100,
    expenseCount: expenses.length,
    averageExpense: Math.round((totalAmount / expenses.length) * 100) / 100,
    largestExpense: Math.max(...amounts),
    smallestExpense: Math.min(...amounts)
  };
};

/**
 * Get participant statistics
 */
export const getParticipantStats = (participants, expenses, balances) => {
  return participants.map(participant => {
    const participantExpenses = expenses.filter(expense => 
      expense.participants.includes(participant.id)
    );
    
    const paidExpenses = expenses.filter(expense => 
      expense.paidBy === participant.id
    );

    const totalPaid = paidExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalOwed = participantExpenses.reduce((sum, expense) => 
      sum + (expense.amount / expense.participants.length), 0
    );

    return {
      id: participant.id,
      name: participant.name,
      balance: Math.round((balances[participant.id] || 0) * 100) / 100,
      totalPaid: Math.round(totalPaid * 100) / 100,
      totalOwed: Math.round(totalOwed * 100) / 100,
      expenseCount: participantExpenses.length,
      paidCount: paidExpenses.length
    };
  });
};

/**
 * Validate expense data
 */
export const validateExpense = (expenseData, participants) => {
  const errors = [];

  if (!expenseData.description || !expenseData.description.trim()) {
    errors.push('La descripción es requerida');
  }

  if (!expenseData.amount || expenseData.amount <= 0) {
    errors.push('El monto debe ser mayor a 0');
  }

  if (!expenseData.paidBy) {
    errors.push('Debe seleccionar quién pagó');
  } else {
    const payer = participants.find(p => p.id === parseInt(expenseData.paidBy));
    if (!payer) {
      errors.push('El pagador seleccionado no es válido');
    }
  }

  if (!expenseData.participants || expenseData.participants.length === 0) {
    errors.push('Debe seleccionar al menos un participante');
  } else {
    const invalidParticipants = expenseData.participants.filter(id => 
      !participants.find(p => p.id === parseInt(id))
    );
    if (invalidParticipants.length > 0) {
      errors.push('Algunos participantes seleccionados no son válidos');
    }
  }

  return errors;
};
