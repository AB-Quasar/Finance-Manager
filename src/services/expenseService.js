import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const getExpenses = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/expenses`, {
      params: filters,
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Get expenses error:', error);
    throw error.response?.data || error;
  }
};

export const getExpenseStatistics = async (timeframe = 'month') => {
  try {
    const response = await axios.get(`${API_URL}/expenses/statistics`, {
      params: { timeframe },
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Get statistics error:', error);
    throw error.response?.data || error;
  }
};

export const createExpense = async (expenseData) => {
  try {
    const response = await axios.post(`${API_URL}/expenses`, expenseData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Create expense error:', error);
    throw error.response?.data || error;
  }
};

export const updateExpense = async (id, expenseData) => {
  try {
    const response = await axios.put(`${API_URL}/expenses/${id}`, expenseData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Update expense error:', error);
    throw error.response?.data || error;
  }
};

export const deleteExpense = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/expenses/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Delete expense error:', error);
    throw error.response?.data || error;
  }
};
