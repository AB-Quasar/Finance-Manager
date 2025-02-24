import { createContext, useContext, useState, useCallback } from 'react';
import { mockExpenseService } from '../services/mockDataService';

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await mockExpenseService.getExpenses();
      setExpenses(data);
      return data;
    } catch (err) {
      setError('Failed to fetch expenses');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await mockExpenseService.getExpenseStatistics();
      setStats(data);
      return data;
    } catch (err) {
      setError('Failed to fetch statistics');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([
        fetchExpenses(),
        fetchStats()
      ]);
    } catch (err) {
      const errorMessage = err.message || 'Failed to refresh data';
      setError(errorMessage);
      console.error('Error refreshing data:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchExpenses, fetchStats]);

  return (
    <ExpenseContext.Provider 
      value={{
        expenses,
        stats,
        loading,
        error,
        fetchExpenses,
        fetchStats,
        refreshData,
        setError
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
