import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { mockSavingsService } from '../services/mockDataService';

const SavingsContext = createContext();

export const useSavingsGoals = () => {
  return useContext(SavingsContext);
};

export const SavingsProvider = ({ children }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      const data = await mockSavingsService.getGoals();
      setGoals(data);
      return data;
    } catch (err) {
      setError('Failed to fetch savings goals');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch goals when the component mounts and when token changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchGoals();
    }
  }, [fetchGoals]);

  const addGoal = async (goalData) => {
    setLoading(true);
    try {
      const response = await mockSavingsService.createGoal(goalData);
      setGoals(prevGoals => [...prevGoals, response]);
      setError(null);
      return response;
    } catch (err) {
      console.error('Failed to add savings goal:', err);
      setError(err.response?.data?.message || 'Failed to add savings goal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateGoal = async (goalId, updatedData) => {
    setLoading(true);
    try {
      const response = await mockSavingsService.updateGoal(goalId, updatedData);
      setGoals(prevGoals => 
        prevGoals.map(goal => goal._id === goalId ? response : goal)
      );
      setError(null);
      return response;
    } catch (err) {
      console.error('Failed to update savings goal:', err);
      setError(err.response?.data?.message || 'Failed to update savings goal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteGoal = async (goalId) => {
    setLoading(true);
    try {
      await mockSavingsService.deleteGoal(goalId);
      setGoals(prevGoals => prevGoals.filter(goal => goal._id !== goalId));
      setError(null);
    } catch (err) {
      console.error('Failed to delete savings goal:', err);
      setError(err.response?.data?.message || 'Failed to delete savings goal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createSavingsGoal = async (goalData) => {
    setLoading(true);
    try {
      const response = await mockSavingsService.createGoal(goalData);
      setGoals(prevGoals => [...prevGoals, response]);
      setError(null);
      return response;
    } catch (err) {
      console.error('Failed to create savings goal:', err);
      setError(err.response?.data?.message || 'Failed to create savings goal');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addContribution = async (goalId, contributionData) => {
    setLoading(true);
    try {
      const response = await mockSavingsService.addContribution(goalId, contributionData);
      
      setGoals(prevGoals => 
        prevGoals.map(goal => 
          goal._id === goalId ? response : goal
        )
      );
      
      setError(null);
      return response;
    } catch (err) {
      console.error('Failed to add contribution:', err);
      setError(err.response?.data?.message || 'Failed to add contribution');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    goals,
    loading,
    error,
    fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    createSavingsGoal,
    addContribution
  };

  return (
    <SavingsContext.Provider value={value}>
      {children}
    </SavingsContext.Provider>
  );
};
