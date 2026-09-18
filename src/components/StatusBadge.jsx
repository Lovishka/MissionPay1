import React from 'react';

export default function StatusBadge({ status, size = 'sm' }) {
  const isSm = size === 'sm';
  
  const baseClasses = `inline-flex items-center rounded-full font-semibold border ${
    isSm ? 'text-[10px] px-2 py-0.5 gap-1.5' : 'text-xs px-2.5 py-1 gap-2'
  }`;
  
  const dotClasses = `rounded-full shrink-0 ${isSm ? 'w-1.5 h-1.5' : 'w-2 h-2'}`;
  
  let variantClasses = '';
  let dotVariant = '';
  
  const statusLower = (status || '').toLowerCase().trim();
  
  if (statusLower === 'completed' || statusLower === 'approved' || statusLower === 'passed') {
    variantClasses = 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20';
    dotVariant = 'bg-[#22C55E]';
  } else if (statusLower === 'analyzing' || statusLower === 'running') {
    variantClasses = 'bg-[#1683FF]/15 text-[#2EA8FF] border-[#1683FF]/30';
    dotVariant = 'bg-[#2EA8FF] animate-pulse';
  } else if (statusLower === 'ready') {
    variantClasses = 'bg-[#1683FF]/10 text-[#2EA8FF] border-[#1683FF]/20';
    dotVariant = 'bg-[#1683FF]';
  } else if (statusLower === 'waiting' || statusLower === 'waiting approval' || statusLower === 'request approval' || statusLower === 'request_approval') {
    variantClasses = 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20';
    dotVariant = 'bg-[#F59E0B] animate-pulse';
  } else if (statusLower === 'rejected' || statusLower === 'failed' || statusLower === 'error') {
    variantClasses = 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20';
    dotVariant = 'bg-[#EF4444]';
  } else if (statusLower === 'coming soon') {
    variantClasses = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    dotVariant = 'bg-purple-400';
  } else {
    // Pending, Prototype, Not Executed, etc.
    variantClasses = 'bg-[#0F1D2D] text-[#94A3B8] border-white/[0.08]';
    dotVariant = 'bg-[#64748B]';
  }

  const displayText = statusLower === 'request_approval' ? 'REQUEST APPROVAL' : (status || 'Unknown');

  return (
    <span className={`${baseClasses} ${variantClasses}`}>
      <span className={`${dotClasses} ${dotVariant}`}></span>
      <span className="uppercase tracking-wider">{displayText}</span>
    </span>
  );
}
