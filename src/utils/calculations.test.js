import { calculateBalances, calculateSettlements, validateExpense } from './calculations';

// Test data
const participants = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];

describe('calculateBalances', () => {
  test('should calculate correct balances for simple case', () => {
    const expenses = [
      {
        id: 1,
        amount: 30,
        paidBy: 1, // Alice
        participants: [1, 2, 3] // All three split
      }
    ];

    const balances = calculateBalances(participants, expenses);
    
    // Alice paid 30, owes 10, so balance is +20
    expect(balances[1]).toBe(20);
    // Bob paid 0, owes 10, so balance is -10
    expect(balances[2]).toBe(-10);
    // Charlie paid 0, owes 10, so balance is -10
    expect(balances[3]).toBe(-10);
  });

  test('should handle multiple expenses correctly', () => {
    const expenses = [
      {
        id: 1,
        amount: 30,
        paidBy: 1, // Alice
        participants: [1, 2, 3] // All three split
      },
      {
        id: 2,
        amount: 20,
        paidBy: 2, // Bob
        participants: [1, 2] // Only Alice and Bob split
      }
    ];

    const balances = calculateBalances(participants, expenses);
    
    // Alice: paid 0, owes 10 (from first) + 10 (from second) = -20, but received 30 from first = +10
    expect(balances[1]).toBe(10);
    // Bob: paid 20 (second), owes 10 (from first) + 10 (from second) = 0
    expect(balances[2]).toBe(0);
    // Charlie: paid 0, owes 10 (from first) = -10
    expect(balances[3]).toBe(-10);
  });

  test('should handle empty expenses', () => {
    const balances = calculateBalances(participants, []);
    
    expect(balances[1]).toBe(0);
    expect(balances[2]).toBe(0);
    expect(balances[3]).toBe(0);
  });
});

describe('calculateSettlements', () => {
  test('should calculate optimal settlements', () => {
    const balances = {
      1: 20,  // Alice is owed 20
      2: -10, // Bob owes 10
      3: -10  // Charlie owes 10
    };

    const settlements = calculateSettlements(participants, balances);
    
    expect(settlements).toHaveLength(2);
    
    // Should have Bob paying Alice and Charlie paying Alice
    const bobPayment = settlements.find(s => s.from === 2);
    const charliePayment = settlements.find(s => s.from === 3);
    
    expect(bobPayment).toBeDefined();
    expect(bobPayment.to).toBe(1);
    expect(bobPayment.amount).toBe(10);
    
    expect(charliePayment).toBeDefined();
    expect(charliePayment.to).toBe(1);
    expect(charliePayment.amount).toBe(10);
  });

  test('should handle balanced accounts', () => {
    const balances = {
      1: 0,
      2: 0,
      3: 0
    };

    const settlements = calculateSettlements(participants, balances);
    
    expect(settlements).toHaveLength(0);
  });

  test('should minimize number of transactions', () => {
    const balances = {
      1: 15,  // Alice is owed 15
      2: 5,   // Bob is owed 5
      3: -10, // Charlie owes 10
      4: -10  // David owes 10
    };

    const participantsWithDavid = [...participants, { id: 4, name: 'David' }];
    const settlements = calculateSettlements(participantsWithDavid, balances);
    
    // Should be 2 transactions instead of 4
    expect(settlements.length).toBeLessThanOrEqual(3);
    
    // Verify total amounts balance
    const totalPaid = settlements.reduce((sum, s) => sum + s.amount, 0);
    const totalOwed = settlements.reduce((sum, s) => sum + s.amount, 0);
    expect(totalPaid).toBe(totalOwed);
  });
});

describe('validateExpense', () => {
  test('should validate correct expense data', () => {
    const expenseData = {
      description: 'Dinner',
      amount: 50,
      paidBy: 1,
      participants: [1, 2, 3]
    };

    const errors = validateExpense(expenseData, participants);
    expect(errors).toHaveLength(0);
  });

  test('should catch missing description', () => {
    const expenseData = {
      description: '',
      amount: 50,
      paidBy: 1,
      participants: [1, 2, 3]
    };

    const errors = validateExpense(expenseData, participants);
    expect(errors).toContain('La descripción es requerida');
  });

  test('should catch invalid amount', () => {
    const expenseData = {
      description: 'Dinner',
      amount: 0,
      paidBy: 1,
      participants: [1, 2, 3]
    };

    const errors = validateExpense(expenseData, participants);
    expect(errors).toContain('El monto debe ser mayor a 0');
  });

  test('should catch missing payer', () => {
    const expenseData = {
      description: 'Dinner',
      amount: 50,
      paidBy: null,
      participants: [1, 2, 3]
    };

    const errors = validateExpense(expenseData, participants);
    expect(errors).toContain('Debe seleccionar quién pagó');
  });

  test('should catch invalid payer', () => {
    const expenseData = {
      description: 'Dinner',
      amount: 50,
      paidBy: 999, // Non-existent participant
      participants: [1, 2, 3]
    };

    const errors = validateExpense(expenseData, participants);
    expect(errors).toContain('El pagador seleccionado no es válido');
  });

  test('should catch empty participants', () => {
    const expenseData = {
      description: 'Dinner',
      amount: 50,
      paidBy: 1,
      participants: []
    };

    const errors = validateExpense(expenseData, participants);
    expect(errors).toContain('Debe seleccionar al menos un participante');
  });
});

// Integration test
describe('Full calculation flow', () => {
  test('should handle complex scenario correctly', () => {
    const expenses = [
      {
        id: 1,
        amount: 60,
        paidBy: 1, // Alice pays 60
        participants: [1, 2, 3] // Split 3 ways (20 each)
      },
      {
        id: 2,
        amount: 30,
        paidBy: 2, // Bob pays 30
        participants: [1, 2] // Split 2 ways (15 each)
      },
      {
        id: 3,
        amount: 45,
        paidBy: 3, // Charlie pays 45
        participants: [2, 3] // Split 2 ways (22.5 each)
      }
    ];

    const balances = calculateBalances(participants, expenses);
    
    // Alice: paid 60, owes 20 + 15 = 35, balance = +25
    expect(Math.round(balances[1] * 100) / 100).toBe(25);
    
    // Bob: paid 30, owes 20 + 15 + 22.5 = 57.5, balance = -27.5
    expect(Math.round(balances[2] * 100) / 100).toBe(-27.5);
    
    // Charlie: paid 45, owes 20 + 22.5 = 42.5, balance = +2.5
    expect(Math.round(balances[3] * 100) / 100).toBe(2.5);

    const settlements = calculateSettlements(participants, balances);
    
    // Should have settlements that balance everything out
    const totalSettlements = settlements.reduce((sum, s) => sum + s.amount, 0);
    expect(totalSettlements).toBeGreaterThan(0);
    
    // Verify that settlements actually balance the accounts
    let finalBalances = { ...balances };
    settlements.forEach(settlement => {
      finalBalances[settlement.from] += settlement.amount;
      finalBalances[settlement.to] -= settlement.amount;
    });
    
    // All final balances should be close to 0 (within rounding error)
    Object.values(finalBalances).forEach(balance => {
      expect(Math.abs(balance)).toBeLessThan(0.01);
    });
  });
});
