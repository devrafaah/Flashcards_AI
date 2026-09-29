export function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="orb animate-float"
        style={{
          width: 560,
          height: 560,
          background: "#4F46E5",
          top: -180,
          left: -140,
          opacity: 0.5,
        }}
      />
      <div
        className="orb animate-float"
        style={{
          width: 480,
          height: 480,
          background: "#7C3AED",
          bottom: -200,
          right: -120,
          opacity: 0.42,
          animationDuration: "26s",
          animationDirection: "alternate-reverse",
        }}
      />
      <div
        className="orb animate-float"
        style={{
          width: 380,
          height: 380,
          background: "#0EA5E9",
          top: "42%",
          left: "56%",
          opacity: 0.28,
          animationDuration: "30s",
        }}
      />
      <div className="grain-overlay" />
    </div>
  );
}
