import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

interface AuthProviderProps {
  children: ReactNode;
}

interface RegisterFields {
  name: string;
  email: string;
  password: string;
}

interface LoginFields {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: {
    id: string;
    name: string;
    email: string;
  };
  isLoadingUser: boolean;
  login: (fields: object) => Promise<void>;
  logout: () => Promise<void>;
  register: (fields: object) => Promise<void>;
}

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const loginCheck = async () => {
      const res = await fetch("/api/session");
      const user = await res.json();
      if (res.status === 200) {
        setUser(user);
        setIsLoadingUser(false);
        navigate("/");
      } else {
        navigate("/login");
      }
    };
    setIsLoadingUser(true);
    loginCheck();
  }, []);

  const register = async (fields: RegisterFields) => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    });
    const data = await res.json();
    if (res.status !== 200) {
      throw {
        status: res.status,
        message: data.message,
      };
    }
    setUser(data);
    navigate("/");
  };

  const login = async (fields: LoginFields) => {
    setIsLoadingUser(true);
    const res = await fetch("/api/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    });
    const data = await res.json();
    if (res.status !== 200) {
      throw {
        status: res.status,
        message: data.message,
      };
    }
    setUser(data);
    setIsLoadingUser(false);
    navigate("/");
  };

  const logout = async () => {
    const res = await fetch("/api/session", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (res.status !== 200) {
      throw {
        status: res.status,
        message: data.message,
      };
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoadingUser, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};
