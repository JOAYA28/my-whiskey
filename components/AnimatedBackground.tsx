export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-[#0f0a06]">
      <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-amber-600/40 blur-3xl animate-blob" />
      <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-orange-500/30 blur-3xl animate-blob [animation-delay:2s]" />
      <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-yellow-700/30 blur-3xl animate-blob [animation-delay:4s]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}
