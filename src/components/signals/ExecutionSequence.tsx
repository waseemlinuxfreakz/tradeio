import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

interface ExecutionSequenceProps {
  currentStep: number;
  steps: Array<{
    title: string;
    description: string;
  }>;
}

const ExecutionSequence: React.FC<ExecutionSequenceProps> = ({ currentStep, steps }) => {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-start gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            index < currentStep
              ? 'bg-emerald-500'
              : index === currentStep
                ? 'bg-pink-500'
                : 'bg-slate-700'
          }`}>
            {index < currentStep ? (
              <Check className="w-5 h-5 text-white" />
            ) : (
              <span className="text-white">{index + 1}</span>
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium">{step.title}</div>
            <div className="text-sm text-slate-400">{step.description}</div>
          </div>
          {index < steps.length - 1 && (
            <ArrowRight className="w-5 h-5 text-slate-400 mt-1.5" />
          )}
        </div>
      ))}
    </div>
  );
};

export default ExecutionSequence;