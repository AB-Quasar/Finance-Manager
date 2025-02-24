import { createContext, useContext, useState, useEffect } from 'react';
import { mockAuthService } from '../services/mockDataService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await mockAuthService.login(email, password);
      setUser(userData);
      setError(null);
      return userData;
    } catch (error) {
      setError('Invalid credentials');
      throw new Error('Invalid credentials');
    }
  };

  const register = async (username, email, password) => {
    try {
      const userData = await mockAuthService.register(username, email, password);
      setUser(userData);
      setError(null);
      return userData;
    } catch (error) {
      setError('Registration failed');
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    mockAuthService.logout();
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
