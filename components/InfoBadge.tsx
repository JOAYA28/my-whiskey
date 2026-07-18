interface InfoBadgeProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  caption?: string;
}

export default function InfoBadge({ icon, label, value, caption }: InfoBadgeProps) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-4 text-center shadow-lg">
      <span className="text-amber-300">{icon}</span>
      <span className="text-[11px] text-slate-400">{label}</span>
      <span className="text-sm font-bold text-white">{value}</span>
      {caption && <span className="text-[10px] text-slate-500">{caption}</span>}
    </div>
  );
}
