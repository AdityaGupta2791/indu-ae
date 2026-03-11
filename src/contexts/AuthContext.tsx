
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: "student" | "parent" | "tutor";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: User['role']) => Promise<void>;
  signup: (fullName: string, email: string, password: string, role: User['role']) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem("induae_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Modified login function to include role selection
  const login = async (email: string, password: string, role: User['role'] = "student") => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock response - in real implementation, this would come from your backend
      const mockUser: User = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        fullName: email.split('@')[0].replace(/[.]/g, ' '),
        email,
        role,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + email
      };
      
      setUser(mockUser);
      localStorage.setItem("induae_user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock signup function
  const signup = async (fullName: string, email: string, password: string, role: User['role']) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      const mockUser: User = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        fullName,
        email,
        role,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + email
      };
      
      setUser(mockUser);
      localStorage.setItem("induae_user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("induae_user");
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      // In a real app, this would trigger a password reset email
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
