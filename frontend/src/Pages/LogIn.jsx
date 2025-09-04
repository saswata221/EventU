// src/Pages/LogIn.jsx
import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail } from "react-icons/hi";
import { FaApple } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function LogIn({ onClose }) {
  const { login, signup, forgotPassword } = useAuth();
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        if (!form.name) return setMessage("Please enter your name.");
        await signup({ name: form.name, email: form.email, password: form.password });
      }
      // Ensure the modal closes after success
      onClose?.();
    } catch (err) {
      setMessage(err?.response?.data?.error || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function onForgot() {
    if (!form.email) return setMessage("Enter your email first.");
    try {
      await forgotPassword(form.email);
      setMessage("Reset link sent to your email");
    } catch {
      setMessage("Could not start password reset");
    }
  }

  return (
    <div className="w-[420px] max-w-[92vw] max-h-[85vh] overflow-y-auto rounded-md sm:rounded-lg bg-white/95 px-6 py-5 sm:px-8 sm:py-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 id="modal-title" className="text-xl sm:text-2xl font-semibold text-slate-900">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h2>
        <button onClick={onClose} aria-label="Close" className="rounded-md p-1 hover:bg-black/5">
          <RxCross1 className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-4 grid grid-cols-2 rounded-lg bg-slate-100 p-1 text-sm font-medium">
        <button
          onClick={() => setMode("login")}
          className={`py-2 rounded-md ${mode === "login" ? "bg-white shadow" : "text-slate-600"}`}
        >
          Log in
        </button>
        <button
          onClick={() => setMode("signup")}
          className={`py-2 rounded-md ${mode === "signup" ? "bg-white shadow" : "text-slate-600"}`}
        >
          Sign up
        </button>
      </div>

      {/* Providers (UI only for now) */}
      <div className="mt-5 sm:mt-6 space-y-3.5 sm:space-y-4">
        <button className="flex w-full items-center justify-center gap-3 rounded-md border border-slate-200 bg-white px-4 sm:px-5 py-2.5 sm:py-3 text-slate-700 shadow-sm hover:bg-slate-50">
          <FcGoogle className="text-xl sm:text-2xl" /> Continue with Google
        </button>
        <button className="flex w-full items-center justify-center gap-3 rounded-md border border-slate-200 bg-white px-4 sm:px-5 py-2.5 sm:py-3 text-slate-700 shadow-sm hover:bg-slate-50">
          <HiOutlineMail className="text-xl sm:text-2xl" /> Continue with Email
        </button>
        <button className="flex w-full items-center justify-center gap-3 rounded-md border border-slate-200 bg-white px-4 sm:px-5 py-2.5 sm:py-3 text-slate-700 shadow-sm hover:bg-slate-50">
          <FaApple className="text-xl sm:text-2xl text-black" /> Continue with Apple
        </button>
      </div>

      {/* Divider */}
      <div className="my-4 sm:my-5 text-center text-sm text-slate-500">Or</div>

      {/* Email/password form */}
      <form onSubmit={onSubmit} className="space-y-3">
        {mode === "signup" && (
          <label className="block">
            <span className="mb-1 block text-xs sm:text-sm font-medium text-slate-600">Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Your name"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
              required
            />
          </label>
        )}

        <label className="block">
          <span className="mb-1 block text-xs sm:text-sm font-medium text-slate-600">Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs sm:text-sm font-medium text-slate-600">Password</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="••••••••"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
            required
          />
        </label>

        {message && <p className="text-sm text-red-600">{message}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-1 w-full rounded-md bg-[#EF233C] py-2.5 text-white font-semibold hover:bg-[#d51f35] disabled:opacity-60"
        >
          {busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
        </button>

        {mode === "login" && (
          <button
            type="button"
            className="w-full text-center text-sm text-slate-600 hover:underline"
            onClick={onForgot}
          >
            Forgot password?
          </button>
        )}
      </form>

      {/* Disclaimer */}
      <p className="mt-5 sm:mt-6 text-center text-[11px] sm:text-[12px] leading-5 text-slate-500">
        *I agree to the <span className="underline">Terms &amp; Conditions</span> and{" "}
        <span className="underline">Privacy Policy</span>
      </p>
    </div>
  );
}
