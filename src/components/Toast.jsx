import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" id="toast-alerts-container">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let iconColor = '#34d399';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = '#f87171';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          iconColor = '#fbbf24';
        } else if (toast.type === 'info') {
          Icon = Info;
          iconColor = '#60a5fa';
        }

        return (
          <div key={toast.id} className={`toast ${toast.type || 'info'}`} id={`toast-${toast.id}`}>
            <Icon size={20} color={iconColor} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div className="toast-content">
              {toast.title && <div className="toast-title">{toast.title}</div>}
              <div className="toast-message">{toast.message}</div>
            </div>
            <button
              className="toast-close"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss toast"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
