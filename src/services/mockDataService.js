// Clear existing data
localStorage.removeItem('expenses');
localStorage.removeItem('savingsGoals');

// Initial mock data
const initialData = {
  expenses: [], // Removed default expenses
  savingsGoals: [
    {
      _id: '1',
      title: 'Emergency Fund',
      targetAmount: 100000,
      currentAmount: 25000,
      category: 'Emergency',
      targetDate: '2025-12-31',
      description: 'Emergency savings',
      contributions: []
    }
  ]
};

// Initialize localStorage with mock data if empty
if (!localStorage.getItem('expenses')) {
  localStorage.setItem('expenses', JSON.stringify(initialData.expenses));
}
if (!localStorage.getItem('savingsGoals')) {
  localStorage.setItem('savingsGoals', JSON.stringify(initialData.savingsGoals));
}

export const mockAuthService = {
  login: (email, password) => {
    // Simple mock authentication
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: email,
      token: 'mock-jwt-token'
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', 'mock-jwt-token');
    return Promise.resolve(mockUser);
  },

  register: (username, email, password) => {
    const mockUser = {
      id: '1',
      name: username,
      email: email,
      token: 'mock-jwt-token'
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', 'mock-jwt-token');
    return Promise.resolve(mockUser);
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return Promise.resolve();
  }
};

export const mockExpenseService = {
  getExpenses: () => {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    return Promise.resolve(expenses);
  },

  createExpense: (expenseData) => {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const newExpense = {
      _id: Date.now().toString(),
      ...expenseData
    };
    expenses.push(newExpense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    return Promise.resolve(newExpense);
  },

  updateExpense: (id, expenseData) => {
    let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    expenses = expenses.map(expense => 
      expense._id === id ? { ...expense, ...expenseData } : expense
    );
    localStorage.setItem('expenses', JSON.stringify(expenses));
    return Promise.resolve(expenseData);
  },

  deleteExpense: (id) => {
    let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    expenses = expenses.filter(expense => expense._id !== id);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    return Promise.resolve();
  },

  getExpenseStatistics: (timeframe = 'month') => {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    // Calculate basic statistics
    const stats = {
      monthlyTotal: expenses.reduce((sum, exp) => sum + exp.amount, 0),
      dailyAverage: expenses.reduce((sum, exp) => sum + exp.amount, 0) / 30,
      topCategory: 'Food',
      trend: expenses.map(exp => ({
        date: exp.date,
        amount: exp.amount
      })),
      distribution: [
        { name: 'Food', value: 2500 },
        { name: 'Utilities', value: 1500 }
      ]
    };
    return Promise.resolve(stats);
  }
};

export const mockSavingsService = {
  getGoals: () => {
    const goals = JSON.parse(localStorage.getItem('savingsGoals') || '[]');
    return Promise.resolve(goals);
  },

  createGoal: (goalData) => {
    const goals = JSON.parse(localStorage.getItem('savingsGoals') || '[]');
    const newGoal = {
      _id: Date.now().toString(),
      currentAmount: 0,
      contributions: [],
      ...goalData
    };
    goals.push(newGoal);
    localStorage.setItem('savingsGoals', JSON.stringify(goals));
    return Promise.resolve(newGoal);
  },

  updateGoal: (id, goalData) => {
    let goals = JSON.parse(localStorage.getItem('savingsGoals') || '[]');
    goals = goals.map(goal => 
      goal._id === id ? { ...goal, ...goalData } : goal
    );
    localStorage.setItem('savingsGoals', JSON.stringify(goals));
    return Promise.resolve(goalData);
  },

  deleteGoal: (id) => {
    let goals = JSON.parse(localStorage.getItem('savingsGoals') || '[]');
    goals = goals.filter(goal => goal._id !== id);
    localStorage.setItem('savingsGoals', JSON.stringify(goals));
    return Promise.resolve();
  },

  addContribution: (goalId, contributionData) => {
    let goals = JSON.parse(localStorage.getItem('savingsGoals') || '[]');
    goals = goals.map(goal => {
      if (goal._id === goalId) {
        const newContribution = {
          _id: Date.now().toString(),
          date: new Date().toISOString(),
          ...contributionData
        };
        return {
          ...goal,
          currentAmount: goal.currentAmount + contributionData.amount,
          contributions: [...goal.contributions, newContribution]
        };
      }
      return goal;
    });
    localStorage.setItem('savingsGoals', JSON.stringify(goals));
    return Promise.resolve(goals.find(g => g._id === goalId));
  }
}; 