import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Icon } from "./Icons";

export function Toasts() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[100] flex w-[min(92vw,24rem)] -translate-x-1/2 flex-col gap-2 sm:left-auto sm:right-5 sm:translate-x-0" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`pointer-events-auto animate-toast-in flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-[var(--shadow-lift)] ${t.type === "error" ? "border-sale/30 bg-card" : "border-border bg-primary-deep text-on-dark"}`}>
          <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${t.type === "error" ? "bg-sale text-destructive-foreground" : t.type === "info" ? "bg-accent text-accent-foreground" : "bg-success text-on-dark"}`}>
            <Icon name={t.type === "error" ? "alert" : t.type === "info" ? "heart" : "check"} className="h-3.5 w-3.5" strokeWidth={2.4} />
          </span>
          <p className={`flex-1 text-sm font-semibold ${t.type === "error" ? "text-foreground" : ""}`}>{t.message}</p>
          <button type="button" onClick={() => dismissToast(t.id)} className="opacity-70 hover:opacity-100" aria-label="Dismiss notification">
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function Modal({ open, onClose, title, children, size = "md", footer }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  if (!open) return null;
  const width = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl", xl: "max-w-6xl" }[size];
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-primary-deep/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className={`animate-fade-up flex max-h-[92vh] w-full ${width} flex-col overflow-hidden rounded-t-3xl bg-card shadow-[var(--shadow-lift)] outline-none sm:rounded-3xl`}>
        {title ? (
          <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
            <h2 className="text-xl font-semibold text-primary">{title}</h2>
            <button type="button" onClick={onClose} className="icon-btn" aria-label="Close">
              <Icon name="x" />
            </button>
          </div>
        ) : null}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer ? <div className="flex flex-wrap justify-end gap-2 border-t border-border bg-cream px-5 py-3 sm:px-6">{footer}</div> : null}
      </div>
    </div>
  );
}

export function ConfirmDialog() {
  const { confirmState, closeConfirm } = useApp();
  if (!confirmState) return null;
  return (
    <Modal
      open
      size="sm"
      onClose={() => closeConfirm(false)}
      title={confirmState.title}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={() => closeConfirm(false)}>Cancel</button>
          <button type="button" className={`btn ${confirmState.danger ? "btn-danger" : "btn-primary"}`} onClick={() => closeConfirm(true)} autoFocus>
            {confirmState.confirmText}
          </button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">{confirmState.message}</p>
    </Modal>
  );
}
