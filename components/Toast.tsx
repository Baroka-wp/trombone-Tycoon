import React, { useState, useEffect } from 'react';
import { Toast as ToastType } from '../types';

interface ToastProps extends ToastType {
  removeToast: (id: number) => void;
  duration?: number;
}

const toastConfig = {
  error: { icon: '🚨', classes: 'bg-red-500/20 border-red-500 text-red-300' },
  warning: { icon: '⚠️', classes: 'bg-yellow-500/20 border-yellow-500 text-yellow-300' },
  info: { icon: '💡', classes: 'bg-sky-500/20 border-sky-500 text-sky-300' },
  success: { icon: '✅', classes: 'bg-green-500/20 border-green-500 text-green-300' },
};

const Toast: React.FC<ToastProps> = ({ id, message, type, removeToast, duration = 7000 }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  const handleClose = () => {
    setIsFadingOut(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
    if (isFadingOut) {
      const timer = setTimeout(() => {
        removeToast(id);
      }, 500); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isFadingOut, id, removeToast]);

  const { icon, classes } = toastConfig[type] || toastConfig.info;
  // Remove the icon from the message if it's already there
  const displayMessage = message.startsWith(icon) ? message.substring(icon.length).trim() : message;

  return (
    <div
      className={`relative w-80 max-w-sm p-4 pr-10 rounded-lg border text-sm font-medium shadow-lg flex items-start gap-3 toast-animate-in ${isFadingOut ? 'toast-animate-out' : ''} ${classes}`}
    >
      <span className="text-xl mt-px">{icon}</span>
      <p>{displayMessage}</p>
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Fermer la notification"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

interface ToastContainerProps {
    toasts: ToastType[];
    removeToast: (id: number) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-6 right-6 z-50 space-y-3">
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} removeToast={removeToast} />
            ))}
        </div>
    );
};


export default ToastContainer;
