import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getToken, setToken as setApiToken } from "@/services/api";

interface AuthState {
  email: string | null;
  userId: number | null;
}

interface AuthContextType {
  auth: AuthState;
  setAuth: (email: string, userId: number, token: string) => Promise<void>;
  clearAuth: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  auth: { email: null, userId: null },
  setAuth: async () => {},
  clearAuth: () => {},
  loading: true,
});

let cachedAuth: AuthState = { email: null, userId: null };

export function useAuth() {
  return useContext(AuthContext);
}

export { cachedAuth };

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [auth, setAuthState] = useState<AuthState>({ email: null, userId: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const setAuth = async (email: string, userId: number, token: string) => {
    setApiToken(token);
    cachedAuth = { email, userId };
    setAuthState({ email, userId });
  };

  const clearAuth = () => {
    setApiToken(null);
    cachedAuth = { email: null, userId: null };
    setAuthState({ email: null, userId: null });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, clearAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
