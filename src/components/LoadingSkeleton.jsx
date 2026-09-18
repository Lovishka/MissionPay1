import React from 'react';

export default function LoadingSkeleton({ variant = 'text', lines = 3 }) {
  const renderText = () => {
    return (
      <div className="space-y-3 w-full">
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i} 
            className={`skeleton h-4 rounded bg-slate-200/60 ${
              i === 0 ? 'w-full' : i === 1 ? 'w-[85%]' : 'w-[70%]'
            }`} 
          />
        ))}
      </div>
    );
  };

  const renderMetric = () => (
    <div className="flex flex-col gap-3 w-full">
      <div className="skeleton h-4 w-1/3 rounded bg-slate-200/60"></div>
      <div className="skeleton h-8 w-1/2 rounded bg-slate-200/60 mt-1"></div>
    </div>
  );

  const renderCard = () => (
    <div className="flex flex-col gap-4 w-full h-full p-4 glass-card rounded-2xl">
      <div className="flex justify-between items-center">
        <div className="skeleton h-5 w-1/3 rounded bg-slate-200/60"></div>
        <div className="skeleton h-5 w-5 rounded-full bg-slate-200/60"></div>
      </div>
      <div className="skeleton h-24 w-full rounded-xl bg-slate-200/60"></div>
      <div className="space-y-2 mt-2">
        <div className="skeleton h-4 w-full rounded bg-slate-200/60"></div>
        <div className="skeleton h-4 w-4/5 rounded bg-slate-200/60"></div>
      </div>
    </div>
  );

  const renderChart = () => (
    <div className="flex items-end gap-2 h-32 w-full pt-4">
      {Array.from({ length: 6 }).map((_, i) => {
        // Randomish heights for chart effect
        const heights = ['h-[40%]', 'h-[60%]', 'h-[30%]', 'h-[80%]', 'h-[50%]', 'h-[90%]'];
        return (
          <div 
            key={i} 
            className={`skeleton flex-1 rounded-t bg-slate-200/60 ${heights[i % 6]}`} 
          />
        );
      })}
    </div>
  );

  switch (variant) {
    case 'metric': return renderMetric();
    case 'card': return renderCard();
    case 'chart': return renderChart();
    case 'text':
    default:
      return renderText();
  }
}
