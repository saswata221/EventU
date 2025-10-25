// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setAccessToken, getAccessToken } from "../services/api";
import Modal from "../Components/JsCompo/Modal";
import LogIn from "../Pages/LogIn"; // we will wire this component for login/signup

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [loading, setLoading] = useState(true);

  // bootstrap: try refresh on first load (optional)
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.post("/api/auth/refresh");
        setAccessToken(data?.accessToken || null);
        const me = await api.get("/api/auth/me");
        setUser(me.data.user);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openAuthModal = () => setShowAuthModal(true);
  const closeAuthModal = () => setShowAuthModal(false);

  async function login({ email, password }) {
    const { data } = await api.post("/api/auth/login", { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    closeAuthModal();
    if (pendingAction) {
      const fn = pendingAction;
      setPendingAction(null);
      fn();
    }
    return data.user;
  }

  async function signup({ name, email, password }) {
    const { data } = await api.post("/api/auth/signup", {
      name,
      email,
      password,
    });
    setAccessToken(data.accessToken);
    setUser(data.user);
    closeAuthModal();
    if (pendingAction) {
      const fn = pendingAction;
      setPendingAction(null);
      fn();
    }
    return data.user;
  }

  async function logout() {
    try {
      await api.post("/api/auth/logout");
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }

  async function forgotPassword(email) {
    await api.post("/api/auth/forgot-password", { email });
  }

  // Gate you can call anywhere: runs callback only if logged in; otherwise opens modal.
  function requireLogin(callback) {
    if (user && getAccessToken()) {
      callback?.();
    } else {
      setPendingAction(() => callback);
      openAuthModal();
    }
  }

  const value = useMemo(
    () => ({
      user,
      role: user?.role || "public",
      loading,
      login,
      signup,
      logout,
      forgotPassword,
      requireLogin,
      showAuthModal,
      openAuthModal,
      closeAuthModal,
    }),
    [user, loading, showAuthModal]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}

      {/* Global auth modal using your Modal + LogIn UI */}
      <Modal isOpen={showAuthModal} onClose={closeAuthModal}>
        <LogIn onClose={closeAuthModal} />
      </Modal>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
