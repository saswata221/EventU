// src/Components/JsCompo/Modal.jsx
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, children, labelledBy = "modal-title" }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);

    const el = dialogRef.current;
    const focusable = el?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      {/* Centered dialog */}
      <div className="relative z-[101] flex h-full w-full items-center justify-center p-4">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
        
          className="rounded-lg bg-white/95 shadow-2xl animate-[pop_.18s_ease-out]"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>

      <style>{`
        @keyframes pop { 0% { transform: scale(.98); opacity:.6 } 100% { transform:scale(1); opacity:1 } }
      `}</style>
    </div>,
    document.body
  );
}
