import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { User } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: User }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, loading: true, error: null };
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case "AUTH_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

const mapSupabaseUser = (supabaseUser: any): User => ({
  id: supabaseUser.id,
  username:
    supabaseUser.user_metadata?.username ||
    supabaseUser.email?.split("@")[0] ||
    "User",
  email: supabaseUser.email || "",
  profilePicture: supabaseUser.user_metadata?.avatar_url || null,
  bio: "",
  skills: [],
  socialLinks: {},
  followers: [],
  following: [],
  createdAt: supabaseUser.created_at || new Date().toISOString(),
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn(
        "Supabase not configured. Please set up environment variables."
      );
      dispatch({ type: "AUTH_FAILURE", payload: "" });
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const user = mapSupabaseUser(session.user);
          dispatch({ type: "AUTH_SUCCESS", payload: user });

          // Create or update profile in database
          await upsertProfile(user);
        } else {
          dispatch({ type: "AUTH_FAILURE", payload: "" });
        }
      } catch (error) {
        console.error("Auth session error:", error);
        dispatch({ type: "AUTH_FAILURE", payload: "" });
      }
    };

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          const user = mapSupabaseUser(session.user);
          dispatch({ type: "AUTH_SUCCESS", payload: user });

          // Create or update profile in database
          await upsertProfile(user);
        } else {
          dispatch({ type: "LOGOUT" });
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        dispatch({ type: "LOGOUT" });
      }
    });

    getInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  const upsertProfile = async (user: User) => {
    if (!isSupabaseConfigured()) return;

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.profilePicture,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error upserting profile:", error);
      }
    } catch (error) {
      console.error("Error upserting profile:", error);
    }
  };

  const login = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      dispatch({
        type: "AUTH_FAILURE",
        payload:
          "Supabase not configured. Please set up environment variables.",
      });
      throw new Error("Supabase not configured");
    }

    try {
      dispatch({ type: "AUTH_START" });
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        dispatch({ type: "AUTH_FAILURE", payload: error.message });
        throw error;
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed";
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    if (!isSupabaseConfigured()) {
      dispatch({
        type: "AUTH_FAILURE",
        payload:
          "Supabase not configured. Please set up environment variables.",
      });
      throw new Error("Supabase not configured");
    }

    try {
      dispatch({ type: "AUTH_START" });
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        dispatch({ type: "AUTH_FAILURE", payload: error.message });
        throw error;
      }
    } catch (error: any) {
      const errorMessage = error.message || "Registration failed";
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    if (!isSupabaseConfigured()) {
      dispatch({
        type: "AUTH_FAILURE",
        payload:
          "Supabase not configured. Please set up environment variables.",
      });
      throw new Error("Supabase not configured");
    }

    try {
      dispatch({ type: "AUTH_START" });
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/home`,
        },
      });

      if (error) {
        dispatch({ type: "AUTH_FAILURE", payload: error.message });
        throw error;
      }
    } catch (error: any) {
      const errorMessage = error.message || "Google login failed";
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const loginWithGitHub = async () => {
    if (!isSupabaseConfigured()) {
      dispatch({
        type: "AUTH_FAILURE",
        payload:
          "Supabase not configured. Please set up environment variables.",
      });
      throw new Error("Supabase not configured");
    }

    try {
      dispatch({ type: "AUTH_START" });
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/home`,
        },
      });

      if (error) {
        dispatch({ type: "AUTH_FAILURE", payload: error.message });
        throw error;
      }
    } catch (error: any) {
      const errorMessage = error.message || "GitHub login failed";
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const logout = async () => {
    if (!isSupabaseConfigured()) {
      dispatch({ type: "LOGOUT" });
      return;
    }

    try {
      await supabase.auth.signOut();
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Logout error:", error);
      dispatch({ type: "LOGOUT" });
    }
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    loginWithGoogle,
    loginWithGitHub,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
