"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown, Globe } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

const memberCategories = [
  { href: "/members?category=professor", label: { ko: "교수", en: "Professor" } },
  { href: "/members?category=phd", label: { ko: "박사과정", en: "Ph.D." } },
  { href: "/members?category=graduate", label: { ko: "석사과정", en: "Graduate Student" } },
  { href: "/members?category=undergrad", label: { ko: "학부연구생", en: "Undergraduate Researcher" } },
  { href: "/members?category=alumni", label: { ko: "동문", en: "Alumni" } },
];

const navLinks = [
  { href: "/", label: { ko: "홈", en: "Home" } },
  { href: "/members", label: { ko: "구성원", en: "Members" } },
  { href: "/research", label: { ko: "연구", en: "Research" } },
  { href: "/publications", label: { ko: "논문", en: "Publications" } },
  { href: "/news", label: { ko: "뉴스", en: "News" } },
  { href: "/notices", label: { ko: "공지", en: "Notice" } },
  { href: "/contact", label: { ko: "연락처", en: "Contact" } },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const { language, setLanguage, t } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === "ko" ? "en" : "ko");
  };

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
              {link.label[language]}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="hidden lg:flex items-center gap-2">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-medium text-gray-400 hover:text-white hover:border-white/20 transition-colors"
          >
            <Globe className="h-3.5 w-3.5" />
            {language === "ko" ? "KOR" : "ENG"}
          </button>
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
                  {link.label[language]}
                </Link>
              ))}
              <button
                onClick={toggleLanguage}
                className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-white/10 text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors"
              >
                <Globe className="h-4 w-4" />
                {language === "ko" ? "한국어 → English" : "English → 한국어"}
              </button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
