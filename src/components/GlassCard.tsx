import { ReactNode } from "react";

export default function GlassCard({
  children,
  className = "",
  hoverEffect = false,
}: {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}) {
  return (
    <div
      className={`glass-card rounded-3xl p-6 ${hoverEffect ? "hover:shadow-sky-500/10 cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
