// src/Pages/LogIn.jsx
import { useState, useRef, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail, HiEye, HiEyeOff } from "react-icons/hi";
import { FaApple } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function LogIn({ onClose }) {
  const { login, signup, forgotPassword } = useAuth();
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // type: 'error' | 'success'
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    // Clear messages when user starts typing
    if (message.text) setMessage({ text: "", type: "" });
  }

  function validateForm() {
    if (mode === "signup" && !form.name.trim()) {
      setMessage({ text: "Please enter your name.", type: "error" });
      return false;
    }
    if (!form.email.trim()) {
      setMessage({ text: "Please enter your email.", type: "error" });
      return false;
    }
    if (form.password.length < 8) {
      setMessage({
        text: "Password must be at least 8 characters.",
        type: "error",
      });
      return false;
    }
    if (mode === "signup" && !agreedToTerms) {
      setMessage({
        text: "Please agree to the Terms & Conditions.",
        type: "error",
      });
      return false;
    }
    return true;
  }

  async function onSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    setBusy(true);
    setMessage({ text: "", type: "" });

    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await signup({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        });
      }

      // Only close if component is still mounted
      if (isMountedRef.current) {
        onClose?.();
      }
    } catch (err) {
      if (isMountedRef.current) {
        setMessage({
          text:
            err?.response?.data?.error ||
            "Something went wrong. Please try again.",
          type: "error",
        });
      }
    } finally {
      if (isMountedRef.current) {
        setBusy(false);
      }
    }
  }

  async function onForgot() {
    if (!form.email.trim()) {
      setMessage({ text: "Please enter your email first.", type: "error" });
      return;
    }

    setBusy(true);
    setMessage({ text: "", type: "" });

    try {
      await forgotPassword(form.email);
      if (isMountedRef.current) {
        setMessage({
          text: "✓ Password reset link sent to your email",
          type: "success",
        });
      }
    } catch (err) {
      if (isMountedRef.current) {
        setMessage({
          text:
            err?.response?.data?.error ||
            "Could not send reset link. Please try again.",
          type: "error",
        });
      }
    } finally {
      if (isMountedRef.current) {
        setBusy(false);
      }
    }
  }

  function handleModeSwitch(newMode) {
    setMode(newMode);
    setMessage({ text: "", type: "" });
    // Keep email but clear other fields
    setForm((f) => ({ ...f, name: "", password: "" }));
  }

  return (
    <div className="w-[420px] max-w-[92vw] max-h-[85vh] overflow-y-auto rounded-md sm:rounded-lg bg-white/95 px-6 py-5 sm:px-8 sm:py-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          id="modal-title"
          className="text-xl sm:text-2xl font-semibold text-slate-900"
        >
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h2>
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-md p-1 hover:bg-black/5 transition-colors"
        >
          <RxCross1 className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-4 grid grid-cols-2 rounded-lg bg-slate-100 p-1 text-sm font-medium">
        <button
          onClick={() => handleModeSwitch("login")}
          className={`py-2 rounded-md transition-all ${
            mode === "login"
              ? "bg-white shadow"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Log in
        </button>
        <button
          onClick={() => handleModeSwitch("signup")}
          className={`py-2 rounded-md transition-all ${
            mode === "signup"
              ? "bg-white shadow"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Sign up
        </button>
      </div>

      {/* OAuth Providers (Coming Soon) */}
      <div className="mt-5 sm:mt-6 space-y-3.5 sm:space-y-4">
        <button
          disabled
          className="flex w-full items-center justify-center gap-3 rounded-md border border-slate-200 bg-white px-4 sm:px-5 py-2.5 sm:py-3 text-slate-700 shadow-sm opacity-50 cursor-not-allowed relative"
        >
          <FcGoogle className="text-xl sm:text-2xl" /> Continue with Google
          <span className="absolute right-3 text-xs text-slate-400">Soon</span>
        </button>
        <button
          disabled
          className="flex w-full items-center justify-center gap-3 rounded-md border border-slate-200 bg-white px-4 sm:px-5 py-2.5 sm:py-3 text-slate-700 shadow-sm opacity-50 cursor-not-allowed relative"
        >
          <HiOutlineMail className="text-xl sm:text-2xl" /> Continue with Email
          <span className="absolute right-3 text-xs text-slate-400">Soon</span>
        </button>
        <button
          disabled
          className="flex w-full items-center justify-center gap-3 rounded-md border border-slate-200 bg-white px-4 sm:px-5 py-2.5 sm:py-3 text-slate-700 shadow-sm opacity-50 cursor-not-allowed relative"
        >
          <FaApple className="text-xl sm:text-2xl text-black" /> Continue with
          Apple
          <span className="absolute right-3 text-xs text-slate-400">Soon</span>
        </button>
      </div>

      {/* Divider */}
      <div className="my-4 sm:my-5 text-center text-sm text-slate-500">Or</div>

      {/* Email/password form */}
      <form onSubmit={onSubmit} className="space-y-3">
        {mode === "signup" && (
          <label className="block">
            <span className="mb-1 block text-xs sm:text-sm font-medium text-slate-600">
              Name <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Your name"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#EF233C]/30 focus:border-[#EF233C] transition-all"
              required
            />
          </label>
        )}

        <label className="block">
          <span className="mb-1 block text-xs sm:text-sm font-medium text-slate-600">
            Email <span className="text-red-500">*</span>
          </span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#EF233C]/30 focus:border-[#EF233C] transition-all"
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs sm:text-sm font-medium text-slate-600">
            Password <span className="text-red-500">*</span>
          </span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="••••••••"
              minLength={8}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-[#EF233C]/30 focus:border-[#EF233C] transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <HiEyeOff className="h-5 w-5" />
              ) : (
                <HiEye className="h-5 w-5" />
              )}
            </button>
          </div>
          {mode === "signup" && (
            <p className="mt-1 text-xs text-slate-500">
              Must be at least 8 characters
            </p>
          )}
        </label>

        {/* Terms Checkbox for Signup */}
        {mode === "signup" && (
          <label className="flex items-start gap-2 text-xs sm:text-sm pt-1">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-[#EF233C] focus:ring-[#EF233C]/30"
              required
            />
            <span className="text-slate-600">
              I agree to the{" "}
              <a href="/terms" className="underline hover:text-[#EF233C]">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline hover:text-[#EF233C]">
                Privacy Policy
              </a>
              <span className="text-red-500"> *</span>
            </span>
          </label>
        )}

        {/* Message Display */}
        {message.text && (
          <div
            className={`text-sm p-3 rounded-md ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-1 w-full rounded-md bg-[#EF233C] py-2.5 text-white font-semibold hover:bg-[#d51f35] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {busy
            ? "Please wait…"
            : mode === "login"
            ? "Log in"
            : "Create account"}
        </button>

        {mode === "login" && (
          <button
            type="button"
            className="w-full text-center text-sm text-slate-600 hover:text-[#EF233C] hover:underline transition-colors"
            onClick={onForgot}
            disabled={busy}
          >
            Forgot password?
          </button>
        )}
      </form>

      {/* Disclaimer (only for login) */}
      {mode === "login" && (
        <p className="mt-5 sm:mt-6 text-center text-[11px] sm:text-[12px] leading-5 text-slate-500">
          By logging in, you agree to our{" "}
          <a href="/terms" className="underline hover:text-[#EF233C]">
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-[#EF233C]">
            Privacy Policy
          </a>
        </p>
      )}
    </div>
  );
}
