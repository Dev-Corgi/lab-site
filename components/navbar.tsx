"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/team", label: "Team" },
  { href: "/research", label: "Research" },
  { href: "/publications", label: "Publications" },
  { href: "/tools", label: "Tools" },
  { href: "/lectures", label: "Lectures" },
  { href: "/news", label: "News" },
  { href: "/join", label: "Join" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0d0d14]/95 backdrop-blur border-b border-border/50">
      <div className="container mx-auto flex h-14 items-center px-4 lg:px-8">
        <Link href="/" className="mr-8 flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <circle cx="20" cy="20" r="3" fill="#ef4444" />
            <ellipse cx="20" cy="20" rx="16" ry="6" stroke="#ef4444" strokeWidth="1.5" fill="none" transform="rotate(0 20 20)" />
            <ellipse cx="20" cy="20" rx="16" ry="6" stroke="#ef4444" strokeWidth="1.5" fill="none" transform="rotate(60 20 20)" />
            <ellipse cx="20" cy="20" rx="16" ry="6" stroke="#ef4444" strokeWidth="1.5" fill="none" transform="rotate(120 20 20)" />
            <circle cx="20" cy="6" r="2" fill="#ef4444" opacity="0.8" />
            <circle cx="34" cy="20" r="2" fill="#ef4444" opacity="0.8" />
            <circle cx="6" cy="20" r="2" fill="#ef4444" opacity="0.8" />
          </svg>
          <span className="text-lg font-bold text-red-500">Quantum Dynamics Lab</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded transition-colors",
                isActive(pathname, link.href)
                  ? "text-red-400"
                  : "text-gray-400 hover:text-gray-200"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="hidden lg:flex items-center gap-2">
          <button className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-200 transition-colors">
            ✦
          </button>
          <span className="text-xs font-medium border border-gray-600 rounded px-2 py-1 text-gray-400">
            KR
          </span>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="lg:hidden inline-flex items-center justify-center rounded-md h-9 w-9 text-gray-400 hover:text-gray-200"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-[#0d0d14] border-border">
            <SheetTitle className="text-lg font-bold text-red-500 mb-4 flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <circle cx="20" cy="20" r="3" fill="#ef4444" />
                <ellipse cx="20" cy="20" rx="16" ry="6" stroke="#ef4444" strokeWidth="1.5" fill="none" transform="rotate(0 20 20)" />
                <ellipse cx="20" cy="20" rx="16" ry="6" stroke="#ef4444" strokeWidth="1.5" fill="none" transform="rotate(60 20 20)" />
                <ellipse cx="20" cy="20" rx="16" ry="6" stroke="#ef4444" strokeWidth="1.5" fill="none" transform="rotate(120 20 20)" />
                <circle cx="20" cy="6" r="2" fill="#ef4444" opacity="0.8" />
                <circle cx="34" cy="20" r="2" fill="#ef4444" opacity="0.8" />
                <circle cx="6" cy="20" r="2" fill="#ef4444" opacity="0.8" />
              </svg>
              Quantum Dynamics Lab
            </SheetTitle>
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-3 py-2.5 rounded transition-colors text-sm",
                    isActive(pathname, link.href)
                      ? "text-red-400 bg-white/5"
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
