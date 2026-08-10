import React, { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { ProcessingStep } from '../types';

interface ProcessingStepsProps {
  currentStep: ProcessingStep;
}

export const ProcessingSteps: React.FC<ProcessingStepsProps> = ({ currentStep }) => {
  const [step, setStep] = useState<ProcessingStep>(currentStep);

  useEffect(() => {
    setStep(currentStep);
  }, [currentStep]);

  const stepsList = [
    { id: 1, label: 'Analisando link' },
    { id: 2, label: 'Encontrando vídeo' },
    { id: 3, label: 'Preparando arquivo...' },
  ];

  return (
    <div className="w-full max-w-md mx-auto my-8 p-6 glass-panel rounded-2xl animate-fade-in shadow-xl">
      <div className="space-y-4">
        {stepsList.map((item) => {
          const isDone = item.id < step;
          const isCurrent = item.id === step;

          return (
            <div
              key={item.id}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? 'bg-brand-900/40 border border-brand-500/40 text-white shadow-lg shadow-brand-500/10'
                  : isDone
                  ? 'bg-gray-800/40 text-gray-300'
                  : 'opacity-40 text-gray-500'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                  isDone
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : isCurrent
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <span>{item.id}</span>
                )}
              </div>

              <span className={`text-sm font-semibold ${isCurrent ? 'text-brand-300' : ''}`}>
                {item.label}
                {isDone && <span className="ml-1 text-emerald-400">✓</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
