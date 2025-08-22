import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, AuthCredentials, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to get permissions for a role
const getPermissionsForRole = (role: UserRole): string[] => {
  switch (role) {
    case UserRole.ADMIN:
      return ['all'];
    case UserRole.REGISTRAR:
      return ['register_land', 'verify_land', 'approve_transfer', 'view_all_records'];
    case UserRole.GOVERNMENT_OFFICIAL:
      return ['verify_land', 'approve_transfer', 'view_department_stats'];
    case UserRole.DEPARTMENT_HEAD:
      return ['verify_land', 'approve_transfer', 'view_department_stats', 'manage_department'];
    case UserRole.FINANCIAL_INSTITUTION:
      return ['view_land_records', 'verify_ownership'];
    case UserRole.CITIZEN:
    default:
      return ['register_land', 'view_own_records', 'request_transfer'];
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
          // Verify token validity with backend
          const isValid = await validateToken(token);
          if (isValid) {
            setUser(JSON.parse(userData));
            setIsAuthenticated(true);
          } else {
            // Clear invalid session
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear any corrupted session data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const validateToken = async (token: string): Promise<boolean> => {
    try {
      // Mock token validation for demo purposes
      // In production, this would call the actual backend
      if (token.startsWith('mock_token_')) {
        // Check if token is not too old (24 hours)
        const tokenTimestamp = parseInt(token.split('_')[2]);
        const currentTime = Date.now();
        const tokenAge = currentTime - tokenTimestamp;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        return tokenAge < maxAge;
      }
      return false;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  const login = async (credentials: AuthCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Mock authentication for demo purposes
      // In production, this would call the actual backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Mock user data based on credentials
      const mockUser: User = {
        id: '1',
        name: credentials.email.split('@')[0], // Use email prefix as name
        email: credentials.email,
        role: credentials.userType,
        permissions: getPermissionsForRole(credentials.userType),
        isActive: true,
        createdAt: new Date().toISOString()
      };
      
      // Generate mock token
      const mockToken = `mock_token_${Date.now()}`;
      
      // Store authentication data
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('userData', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Mock registration for demo purposes
      // In production, this would call the actual backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Mock user data based on registration
      const mockUser: User = {
        id: `user_${Date.now()}`,
        name: userData.name || userData.email?.split('@')[0] || 'User',
        email: userData.email || '',
        role: userData.role || UserRole.CITIZEN,
        permissions: getPermissionsForRole(userData.role || UserRole.CITIZEN),
        isActive: true,
        createdAt: new Date().toISOString()
      };
      
      // Generate mock token
      const mockToken = `mock_token_${Date.now()}`;
      
      // Store authentication data
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('userData', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('refreshToken');
    
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const authData: AuthResponse = await response.json();
        localStorage.setItem('authToken', authData.token);
        if (authData.refreshToken) {
          localStorage.setItem('refreshToken', authData.refreshToken);
        }
      } else {
        // Refresh failed, logout user
        logout();
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    updateUser,
    hasPermission,
    hasRole,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Permission constants
export const PERMISSIONS = {
  // Land management permissions
  VIEW_LANDS: 'view_lands',
  CREATE_LAND: 'create_land',
  UPDATE_LAND: 'update_land',
  DELETE_LAND: 'delete_land',
  
  // Verification permissions
  VERIFY_LAND: 'verify_land',
  APPROVE_TRANSFER: 'approve_transfer',
  REJECT_TRANSFER: 'reject_transfer',
  
  // User management permissions
  VIEW_USERS: 'view_users',
  CREATE_USER: 'create_user',
  UPDATE_USER: 'update_user',
  DELETE_USER: 'delete_user',
  
  // Department permissions
  MANAGE_DEPARTMENT: 'manage_department',
  VIEW_DEPARTMENT_STATS: 'view_department_stats',
  
  // Financial permissions
  PROCESS_PAYMENTS: 'process_payments',
  VIEW_FINANCIAL_DATA: 'view_financial_data',
  
  // Admin permissions
  ADMIN_ACCESS: 'admin_access',
  SYSTEM_CONFIG: 'system_config',
};

// Role-based permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.CITIZEN]: [
    PERMISSIONS.VIEW_LANDS,
  ],
  [UserRole.GOVERNMENT_OFFICIAL]: [
    PERMISSIONS.VIEW_LANDS,
    PERMISSIONS.VERIFY_LAND,
    PERMISSIONS.APPROVE_TRANSFER,
    PERMISSIONS.REJECT_TRANSFER,
    PERMISSIONS.VIEW_DEPARTMENT_STATS,
  ],
  [UserRole.DEPARTMENT_HEAD]: [
    PERMISSIONS.VIEW_LANDS,
    PERMISSIONS.VERIFY_LAND,
    PERMISSIONS.APPROVE_TRANSFER,
    PERMISSIONS.REJECT_TRANSFER,
    PERMISSIONS.VIEW_DEPARTMENT_STATS,
    PERMISSIONS.MANAGE_DEPARTMENT,
    PERMISSIONS.VIEW_USERS,
  ],
  [UserRole.FINANCIAL_INSTITUTION]: [
    PERMISSIONS.VIEW_LANDS,
    PERMISSIONS.VIEW_FINANCIAL_DATA,
    PERMISSIONS.PROCESS_PAYMENTS,
  ],
  [UserRole.REGISTRAR]: [
    PERMISSIONS.VIEW_LANDS,
    PERMISSIONS.CREATE_LAND,
    PERMISSIONS.UPDATE_LAND,
    PERMISSIONS.VERIFY_LAND,
    PERMISSIONS.APPROVE_TRANSFER,
    PERMISSIONS.REJECT_TRANSFER,
    PERMISSIONS.VIEW_USERS,
  ],
  [UserRole.ADMIN]: [
    PERMISSIONS.ADMIN_ACCESS,
    PERMISSIONS.SYSTEM_CONFIG,
    PERMISSIONS.VIEW_LANDS,
    PERMISSIONS.CREATE_LAND,
    PERMISSIONS.UPDATE_LAND,
    PERMISSIONS.DELETE_LAND,
    PERMISSIONS.VERIFY_LAND,
    PERMISSIONS.APPROVE_TRANSFER,
    PERMISSIONS.REJECT_TRANSFER,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.UPDATE_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.MANAGE_DEPARTMENT,
    PERMISSIONS.VIEW_DEPARTMENT_STATS,
    PERMISSIONS.PROCESS_PAYMENTS,
    PERMISSIONS.VIEW_FINANCIAL_DATA,
  ],
};
