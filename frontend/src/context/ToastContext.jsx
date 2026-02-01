import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const success = useCallback((message) => addToast(message, 'success'), [addToast]);
    const error = useCallback((message) => addToast(message, 'error'), [addToast]);
    const warning = useCallback((message) => addToast(message, 'warning'), [addToast]);
    const info = useCallback((message) => addToast(message, 'info'), [addToast]);

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={18} className="toast-icon success" />;
            case 'error': return <XCircle size={18} className="toast-icon error" />;
            case 'warning': return <AlertCircle size={18} className="toast-icon warning" />;
            default: return <Info size={18} className="toast-icon info" />;
        }
    };

    return (
        <ToastContext.Provider value={{ success, error, warning, info }}>
            {children}
            <div className="toast-container">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`toast toast-${toast.type}`}>
                        {getIcon(toast.type)}
                        <span className="toast-message">{toast.message}</span>
                        <button
                            className="toast-close"
                            onClick={() => removeToast(toast.id)}
                            aria-label="Close notification"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
            <style>{`
        .toast-icon { flex-shrink: 0; }
        .toast-icon.success { color: var(--color-success); }
        .toast-icon.error { color: var(--color-error); }
        .toast-icon.warning { color: var(--color-warning); }
        .toast-icon.info { color: var(--color-info); }
        .toast-message { flex: 1; font-size: 0.9375rem; color: var(--color-text-primary); }
        .toast-close { 
          background: none; 
          border: none; 
          color: var(--color-text-muted);
          cursor: pointer;
          padding: 4px;
          display: flex;
          border-radius: 4px;
        }
        .toast-close:hover { background: var(--color-bg-tertiary); }
      `}</style>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
