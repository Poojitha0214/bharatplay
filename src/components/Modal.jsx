import { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({ open, onClose, children, labelledBy, maxWidth }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={labelledBy} style={maxWidth ? { width: maxWidth } : undefined}>
        {children}
      </div>
    </div>
  );
}

export function ModalHead({ title, sub, onClose, accent }) {
  return (
    <div style={{ padding: "22px 24px 16px", borderBottom: "1px solid var(--stroke)" }}>
      <div className="row-between">
        <div style={{ minWidth: 0 }}>
          {sub && (
            <div className="eyebrow" style={{ color: accent || "var(--saffron)" }}>
              {sub}
            </div>
          )}
          <h3 id="modal-title" style={{ fontSize: "1.18rem", marginTop: sub ? 8 : 0 }}>
            {title}
          </h3>
        </div>
        <button className="icon-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
