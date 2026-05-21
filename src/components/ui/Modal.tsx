"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  footer?: React.ReactNode;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-7xl",
};

export function Modal({ open, onClose, title, subtitle, children, size = "md", footer }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "w-full rounded-2xl border border-white/10 shadow-2xl overflow-hidden",
                sizeClasses[size]
              )}
              style={{
                background: "linear-gradient(135deg, rgba(13,17,23,0.98) 0%, rgba(8,13,24,0.98) 100%)",
                boxShadow: "0 25px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.07)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-5 border-b border-white/10">
                <div>
                  <h3 className="text-base font-semibold text-white">{title}</h3>
                  {subtitle && <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>}
                </div>
                <button onClick={onClose} className="btn-icon -mt-0.5 -mr-0.5">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 max-h-[70vh] overflow-y-auto scroll-area">{children}</div>

              {/* Footer */}
              {footer && (
                <div className="px-5 py-4 border-t border-white/10 flex items-center justify-end gap-3">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
