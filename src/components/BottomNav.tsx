"use client";

import Link from "next/link";
import { Home, Bookmark, Settings, BookOpen } from "lucide-react";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Read", icon: BookOpen, href: "/" },
    { label: "Saved", icon: Bookmark, href: "/" },
    { label: "Settings", icon: Settings, href: "/" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-nav z-50 pb-safe">
      <div className="flex items-center justify-around max-w-md mx-auto h-16 px-6">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href && index === 0;
          return (
            <Link
              key={index}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive
                  ? "text-emerald-400"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"}`}
              />
              <span className="text-[10px] font-medium tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
