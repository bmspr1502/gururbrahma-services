export function BackgroundPattern() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-background">
      <div className="absolute inset-0 h-full w-full bg-[radial-gradient(hsl(var(--primary)/0.05)_1px,transparent_1px)] [background-size:16px_16px]"></div>
    </div>
  );
}
