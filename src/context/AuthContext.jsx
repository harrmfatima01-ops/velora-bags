import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadFromStorage, saveToStorage } from "../utils/helpers";
import { generateSalt, hashPassword } from "../utils/authUtils";

const AuthContext = createContext(null);
const USERS_KEY = "velora-users";
const SESSION_KEY = "velora-session";

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => loadFromStorage(USERS_KEY, []));
  const [sessionEmail, setSessionEmail] = useState(() => loadFromStorage(SESSION_KEY, null));

  useEffect(() => {
    saveToStorage(USERS_KEY, users);
  }, [users]);

  useEffect(() => {
    saveToStorage(SESSION_KEY, sessionEmail);
  }, [sessionEmail]);

  // The logged-in user (without the password hash), or null when nobody is logged in.
  const currentUser = useMemo(() => {
    const found = users.find((user) => user.email === sessionEmail);
    return found ? { id: found.id, fullName: found.fullName, email: found.email } : null;
  }, [users, sessionEmail]);

  async function register({ fullName, email, password }) {
    const cleanEmail = email.trim().toLowerCase();

    if (users.some((user) => user.email === cleanEmail)) {
      return { success: false, message: "An account with this email already exists. Please log in." };
    }

    try {
      const salt = generateSalt();
      const passwordHash = await hashPassword(password, salt);
      const newUser = {
        id: Date.now(),
        fullName: fullName.trim(),
        email: cleanEmail,
        salt,
        passwordHash,
      };
      setUsers((current) => [...current, newUser]);
      return { success: true, message: "Account created successfully! Please log in." };
    } catch (error) {
      console.error("Registration failed:", error);
      return { success: false, message: "Could not create your account. Please try again." };
    }
  }

  async function login({ email, password }) {
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find((item) => item.email === cleanEmail);

    // Nobody registered with this email: ask them to register first.
    if (!user) {
      return {
        success: false,
        notRegistered: true,
        message: "No account found with this email. Please register first.",
      };
    }

    try {
      const attemptHash = await hashPassword(password, user.salt);
      if (attemptHash !== user.passwordHash) {
        return { success: false, message: "Incorrect password. Please try again." };
      }
      setSessionEmail(user.email);
      return { success: true, message: `Welcome back, ${user.fullName.split(" ")[0]}!` };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, message: "Could not log you in. Please try again." };
    }
  }

  function logout() {
    setSessionEmail(null);
  }

  const value = { currentUser, isLoggedIn: Boolean(currentUser), register, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}