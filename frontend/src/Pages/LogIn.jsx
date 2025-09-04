import { RxCross1 } from "react-icons/rx";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail } from "react-icons/hi";
import { FaApple } from "react-icons/fa";

export default function LogIn({ onClose }) {
  return (
   
    <div className="w-[400px] max-h-[85vh] overflow-y-auto rounded-md sm:rounded-lg bg-white/95 px-6 py-5 sm:px-8 sm:py-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 id="modal-title" className="text-xl sm:text-2xl font-semibold text-slate-900">
          Get Started
        </h2>
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-md p-1 hover:bg-black/5"
        >
          <RxCross1 className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      {/* Providers */}
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

      {/* Mobile input */}
      <label className="block">
        <span className="mb-1 block text-xs sm:text-sm font-medium text-slate-600">Mobile</span>
        <div className="flex items-center gap-2 border-b border-slate-300 pb-2">
          <span className="text-sm sm:text-base text-slate-700">+91</span>
          <input
            type="tel"
            name="phone"
            placeholder="Continue with mobile number"
            inputMode="numeric"
            className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 outline-none"
          />
        </div>
      </label>

      {/* Disclaimer */}
      <p className="mt-5 sm:mt-6 text-center text-[11px] sm:text-[12px] leading-5 text-slate-500">
        *I agree to the <span className="underline">Terms &amp; Conditions</span> and{" "}
        <span className="underline">Privacy Policy</span>
      </p>
    </div>
  );
}
