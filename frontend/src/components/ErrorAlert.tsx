import React from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="w-full max-w-2xl mx-auto my-6 p-4 rounded-2xl bg-red-950/40 border border-red-800/60 backdrop-blur-md flex items-start gap-3.5 animate-fade-in shadow-lg">
      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
      
      <div className="flex-1">
        <h5 className="text-sm font-bold text-red-200">Atenção</h5>
        <p className="text-xs sm:text-sm text-red-300 mt-0.5 leading-relaxed">{message}</p>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-white p-1 rounded-lg hover:bg-red-900/50 transition-colors"
        >
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
