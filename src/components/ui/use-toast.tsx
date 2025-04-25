// 這個檔案是從 shadcn/ui 的範例修改而來
// 提供了一個簡易的 toast 通知系統

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

// Toast 通知內容元件
const Toast: React.FC<ToastProps & { onClose: () => void }> = ({
  title,
  description,
  variant = 'default',
  // 忽略 duration 參數，但仍在類型定義中保留
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  duration,
  onClose,
}) => {
  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 flex w-full max-w-md animate-in fade-in slide-in-from-bottom-5 flex-col items-start gap-1 rounded-md border border-gray-200 bg-white p-4 shadow-lg',
        variant === 'destructive' && 'border-red-200 bg-red-50',
      )}
    >
      {title && (
        <h3
          className={cn(
            'text-sm font-semibold',
            variant === 'destructive' && 'text-red-600',
          )}
        >
          {title}
        </h3>
      )}
      {description && (
        <p
          className={cn(
            'text-sm text-gray-700',
            variant === 'destructive' && 'text-red-600',
          )}
        >
          {description}
        </p>
      )}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        aria-label="關閉通知"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

// Toast 通知上下文
const ToastContext = React.createContext<{
  toast: (props: ToastProps) => void;
}>({
  toast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<(ToastProps & { id: string })[]>(
    [],
  );

  const toastFn = React.useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...props, id }]);

    // 一段時間後自動關閉
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, props.duration || 3000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  }, []);

  // 使用 useMemo 優化 context value
  const contextValue = React.useMemo(() => ({ toast: toastFn }), [toastFn]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-4 flex flex-col gap-2">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            title={t.title}
            description={t.description}
            variant={t.variant}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// 自定義 hook，用於在元件中使用 toast 功能
export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// 修改為函式，避免使用 useContext Hook
export const toast = (props: ToastProps) => {
  // 使用全局方法顯示 toast，避免使用 React Hook
  if (typeof window !== 'undefined') {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'fixed';
    tempDiv.style.bottom = '1rem';
    tempDiv.style.right = '1rem';
    tempDiv.style.zIndex = '9999';
    document.body.appendChild(tempDiv);

    const closeToast = () => {
      document.body.removeChild(tempDiv);
    };

    // 使用 React 創建臨時 toast
    const { createRoot } = require('react-dom/client');
    const root = createRoot(tempDiv);
    root.render(<Toast {...props} onClose={closeToast} />);

    // 自動關閉
    setTimeout(closeToast, props.duration || 3000);
  }
};
