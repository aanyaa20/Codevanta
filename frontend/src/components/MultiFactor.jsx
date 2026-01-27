import React, { useRef, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

const MultiFactor = memo(({ value, onChange, onComplete, className }) => {
  const inputRefs = useRef([]);
  const containerRef = useRef(null);

  // Initialize refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, newValue) => {
    // Allow only alphanumeric characters (A-Z, 0-9)
    const sanitized = newValue.toUpperCase().replace(/[^A-Z0-9]/g, "");
    
    if (sanitized.length === 0) {
      // Handle backspace/delete
      const newCode = value.split("");
      newCode[index] = "";
      const updatedValue = newCode.join("");
      onChange(updatedValue);
      return;
    }

    // Handle single character input
    if (sanitized.length === 1) {
      const newCode = value.split("");
      newCode[index] = sanitized;
      const updatedValue = newCode.join("").slice(0, 6);
      onChange(updatedValue);

      // Auto-focus next input
      if (index < 5 && sanitized) {
        inputRefs.current[index + 1]?.focus();
      }

      // Check if complete
      if (updatedValue.length === 6 && onComplete) {
        onComplete(updatedValue);
      }
      return;
    }

    // Handle paste (multiple characters)
    if (sanitized.length > 1) {
      const pastedCode = sanitized.slice(0, 6);
      onChange(pastedCode);
      
      // Focus the next empty box or last box
      const nextIndex = Math.min(pastedCode.length, 5);
      inputRefs.current[nextIndex]?.focus();

      // Check if complete
      if (pastedCode.length === 6 && onComplete) {
        onComplete(pastedCode);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const currentValue = value[index] || "";
      
      if (currentValue) {
        // Clear current box
        const newCode = value.split("");
        newCode[index] = "";
        onChange(newCode.join(""));
      } else if (index > 0) {
        // Move to previous box and clear it
        const newCode = value.split("");
        newCode[index - 1] = "";
        onChange(newCode.join(""));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleFocus = (index) => {
    // Select the content when focused
    inputRefs.current[index]?.select();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (pastedData) {
      const code = pastedData.slice(0, 6);
      onChange(code);
      
      // Focus the next empty box or last box
      const nextIndex = Math.min(code.length, 5);
      inputRefs.current[nextIndex]?.focus();

      // Check if complete
      if (code.length === 6 && onComplete) {
        onComplete(code);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("flex gap-3 justify-center items-center", className)}
    >
      {[0, 1, 2, 3, 4, 5].map((index) => {
        const isFilled = value[index] !== undefined && value[index] !== "";
        const isFocused = document.activeElement === inputRefs.current[index];

        return (
          <motion.div
            key={index}
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {/* Glowing border effect for focused input */}
            {isFocused && (
              <motion.div
                layoutId="border-glow"
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-400 opacity-50 blur-md"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}

            <motion.input
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="text"
              maxLength={1}
              value={value[index] || ""}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={() => handleFocus(index)}
              onPaste={handlePaste}
              className={cn(
                "relative w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl",
                "bg-white/80 backdrop-blur-sm",
                "border-2 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                "font-mono tracking-wider",
                isFocused
                  ? "border-cyan-400 ring-cyan-400/50 shadow-lg shadow-cyan-400/20 scale-105"
                  : isFilled
                  ? "border-teal-300 shadow-md"
                  : "border-slate-200 hover:border-slate-300"
              )}
              style={{
                caretColor: "transparent", // Hide caret for cleaner look
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                scale: isFilled ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: 0.2,
              }}
            />

            {/* Subtle shimmer effect on filled inputs */}
            {isFilled && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/0 via-white/30 to-white/0 pointer-events-none"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
});

MultiFactor.displayName = "MultiFactor";

export default MultiFactor;
