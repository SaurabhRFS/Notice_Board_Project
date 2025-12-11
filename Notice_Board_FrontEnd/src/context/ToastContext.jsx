import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Toast from '../components/feedback/Toast'; // Ensure this path matches where you put Toast.jsx

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // 1. Stable Add Function
  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  // 2. Stable Remove Function
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // 3. FIX: Memoize the context value to prevent re-render warnings
  const contextValue = useMemo(() => ({ addToast }), [addToast]);

  // ... imports

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* FIX: Responsive Positioning 
          - Mobile: top-6, left-1/2 (centered horizontally)
          - Desktop (md): bottom-6, right-6 (standard corner)
      */}
      <div className="
        fixed z-[200] flex flex-col gap-3 pointer-events-none
        top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm
        md:top-auto md:left-auto md:translate-x-0
        md:bottom-6 md:right-6
      ">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto w-full">
            <Toast {...toast} onClose={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};