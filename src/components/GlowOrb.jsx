export default function GlowOrb({ color = 'indigo', position = 'top-left', delay = 0 }) {
  const positionClasses = {
    'top-left': 'top-10 left-10 md:top-24 md:left-24',
    'top-right': 'top-20 right-10 md:top-40 md:right-32',
    'bottom-left': 'bottom-10 left-10 md:bottom-32 md:left-40',
    'bottom-right': 'bottom-20 right-20 md:bottom-40 md:right-40',
  };

  const colorClasses = {
    indigo: 'bg-indigo-500/20 shadow-[0_0_120px_rgba(99,102,241,0.25)]',
    emerald: 'bg-emerald-500/20 shadow-[0_0_120px_rgba(16,185,129,0.25)]',
    rose: 'bg-rose-500/20 shadow-[0_0_120px_rgba(244,63,94,0.25)]',
    cyan: 'bg-cyan-500/20 shadow-[0_0_120px_rgba(6,182,212,0.25)]',
  };

  return (
    <div
      style={{ animationDelay: `${delay}s` }}
      className={`absolute w-72 h-72 rounded-full filter blur-[80px] pointer-events-none -z-10 animate-float opacity-70 ${positionClasses[position] || positionClasses['top-left']} ${colorClasses[color] || colorClasses['indigo']}`}
    />
  );
}
