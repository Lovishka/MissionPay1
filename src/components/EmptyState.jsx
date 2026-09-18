import React from 'react';

export default function EmptyState({ 
  icon: Icon, 
  title, 
  message, 
  action, 
  variant = 'empty' 
}) {
  let iconBgColor = 'bg-slate-50';
  let iconColor = 'text-slate-500';

  if (variant === 'error') {
    iconBgColor = 'bg-red-50';
    iconColor = 'text-red-500';
  } else if (variant === 'no-data') {
    iconBgColor = 'bg-amber-50';
    iconColor = 'text-amber-500';
  } else if (variant === 'coming-soon') {
    iconBgColor = 'bg-purple-50';
    iconColor = 'text-purple-500';
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-full w-full">
      {Icon && (
        <div className={`p-4 rounded-full ${iconBgColor} mb-4`}>
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-[#071a49] mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{message}</p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-[#2563eb] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
