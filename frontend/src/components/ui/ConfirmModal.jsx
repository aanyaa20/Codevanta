import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * ConfirmModal - Modern replacement for window.confirm()
 * 
 * @param {boolean} open - Control modal visibility
 * @param {string} title - Modal title
 * @param {string} description - Optional description text
 * @param {string} confirmText - Confirm button text (default: "Confirm")
 * @param {string} cancelText - Cancel button text (default: "Cancel")
 * @param {string} variant - Button style: "danger" (red) or "primary" (cyan/teal)
 * @param {function} onConfirm - Called when user confirms
 * @param {function} onCancel - Called when user cancels
 */
function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && open) {
        onCancel?.();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onCancel]);

  const modalContent = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={onCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Modal Card */}
          <motion.div
            className="relative w-full max-w-sm bg-white/90 backdrop-blur-xl rounded-2xl border border-white/60 shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition-colors z-10"
              aria-label="Close"
            >
              <X className="size-4 text-slate-500" />
            </button>

            {/* Content */}
            <div className="p-6 text-center">
              {/* Title */}
              <h3 className="text-lg font-bold text-slate-900 mb-2 pr-6">
                {title}
              </h3>

              {/* Description */}
              {description && (
                <p className="text-sm text-slate-600 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {/* Action Buttons - Instagram style vertical stack */}
            <div className="border-t border-slate-200">
              {/* Confirm Button */}
              <button
                onClick={() => {
                  onConfirm?.();
                }}
                className={`w-full px-6 py-3.5 text-center font-semibold transition-colors border-b border-slate-200 ${
                  variant === "danger"
                    ? "text-red-600 hover:bg-red-50"
                    : "text-cyan-600 hover:bg-cyan-50"
                }`}
              >
                {confirmText}
              </button>

              {/* Cancel Button */}
              <button
                onClick={onCancel}
                className="w-full px-6 py-3.5 text-center font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {cancelText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

export default ConfirmModal;
