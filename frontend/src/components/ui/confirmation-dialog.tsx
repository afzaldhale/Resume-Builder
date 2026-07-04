import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: React.ReactNode;
  confirmButtonClassName?: string;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, y: 8 },
};

export const ConfirmationDialog = ({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  icon,
  confirmButtonClassName,
}: ConfirmationDialogProps) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                key="confirmation-overlay"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[6px]"
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                key="confirmation-content"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.24, ease: "easeOut" }}
                className={cn(
                  "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-[520px] -translate-x-1/2 -translate-y-1/2",
                  "rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)]",
                  "focus:outline-none"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    {icon ?? <Trash2 className="h-5 w-5" aria-hidden="true" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <DialogPrimitive.Title className="text-xl font-semibold tracking-[-0.02em] text-slate-900">
                      {title}
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="mt-2 text-sm leading-6 text-slate-600">
                      {description}
                    </DialogPrimitive.Description>
                  </div>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="h-11 rounded-xl border-slate-300 bg-white px-5 text-slate-800 hover:bg-slate-50"
                  >
                    {cancelLabel}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={onConfirm}
                    className={cn(
                      "h-11 rounded-xl bg-red-600 px-5 text-white hover:bg-red-700 focus-visible:ring-red-500",
                      confirmButtonClassName
                    )}
                  >
                    {confirmLabel}
                  </Button>
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};

export default ConfirmationDialog;
