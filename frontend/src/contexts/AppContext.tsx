import React, { createContext, useContext, useState } from 'react';
import { AppContextType } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const setErrorMessage = (errorMessage: string | null) => {
    setError(errorMessage);
    if (errorMessage) {
      setSuccessMessage(null);
    }
  };

  const setSuccessMsg = (message: string | null) => {
    setSuccessMessage(message);
    if (message) {
      setError(null);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const value: AppContextType = {
    isLoading,
    error,
    successMessage,
    setLoading,
    setError: setErrorMessage,
    setSuccessMessage: setSuccessMsg,
    clearMessages,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
