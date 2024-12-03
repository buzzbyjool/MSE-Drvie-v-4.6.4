import { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthState } from '../types/auth';
import { validateUser } from '../services/airtable/users';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  const login = async (username: string, password: string) => {
    try {
      const user = await validateUser(username, password);

      if (user) {
        setAuthState({
          isAuthenticated: true,
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            region: user.region
          },
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}