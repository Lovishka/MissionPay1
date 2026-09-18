import React from 'react';

export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-row items-center justify-between mb-4">
      <div className="flex flex-col">
        <h2 className="text-lg font-bold text-[#071a49]">{title}</h2>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0 ml-4">
          {action}
        </div>
      )}
    </div>
  );
}
