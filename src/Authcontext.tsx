import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on first load
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bloblytics_user");
      if (stored) setUser(JSON.parse(stored));
    } catch (_) {}
    setLoading(false);
  }, []);

  const signup = ({ name, email, password }) => {
    // In a real app this would call an API.
    // For now we store a user object locally.
    const existing = JSON.parse(localStorage.getItem("bloblytics_users") || "[]");
    if (existing.find(u => u.email === email)) {
      return { error: "An account with that email already exists." };
    }
    const newUser = { id: crypto.randomUUID(), name, email, plan: "Free", joined: new Date().toISOString() };
    localStorage.setItem("bloblytics_users", JSON.stringify([...existing, { ...newUser, password }]));
    localStorage.setItem("bloblytics_user", JSON.stringify(newUser));
    setUser(newUser);
    return { success: true };
  };

  const login = ({ email, password }) => {
    const existing = JSON.parse(localStorage.getItem("bloblytics_users") || "[]");
    const match = existing.find(u => u.email === email && u.password === password);
    if (!match) return { error: "Invalid email or password." };
    const { password: _pw, ...safeUser } = match;
    localStorage.setItem("bloblytics_user", JSON.stringify(safeUser));
    setUser(safeUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("bloblytics_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}