import { AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * AlertModal - Modern replacement for alert()
 * 
 * @param {boolean} open - Control modal visibility
 * @param {string} title - Modal title (default: "Something went wrong")
 * @param {string} message - Alert message content
 * @param {string} buttonText - Button text (default: "OK")
 * @param {function} onClose - Called when modal closes
 */
function AlertModal({
  open,
  title = "Something went wrong",
  message,
  buttonText = "OK",
  onClose,
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
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const modalContent = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={onClose}
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
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition-colors z-10"
              aria-label="Close"
            >
              <X className="size-4 text-slate-500" />
            </button>

            {/* Content */}
            <div className="p-6 text-center">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="size-14 rounded-full bg-red-50 flex items-center justify-center">
                  <AlertCircle className="size-7 text-red-500" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {title}
              </h3>

              {/* Message */}
              {message && (
                <p className="text-sm text-slate-600 leading-relaxed">
                  {message}
                </p>
              )}
            </div>

            {/* Action Button */}
            <div className="border-t border-slate-200">
              <button
                onClick={onClose}
                className="w-full px-6 py-3.5 text-center font-semibold text-white bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 transition-all"
              >
                {buttonText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

export default AlertModal;
