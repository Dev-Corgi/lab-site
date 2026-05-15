"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Globe } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LabLogo } from "@/components/lab-logo";
import { useI18n } from "@/lib/i18n/context";

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
  const { language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === "ko" ? "en" : "ko");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md supports-backdrop-filter:bg-background/80">
      <div className="container mx-auto flex h-14 items-center px-4 lg:px-8">
        <Link href="/" className="mr-8 flex items-center gap-2">
          <LabLogo />
          <span className="text-lg font-bold text-foreground tracking-tight">Fiber Optics Labratory</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded-md transition-colors",
                isActive(pathname, link.href)
                  ? "text-primary font-medium bg-primary/10"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label[language]}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="hidden lg:flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
          >
            <Globe className="h-3.5 w-3.5" />
            {language === "ko" ? "KOR" : "ENG"}
          </button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="lg:hidden inline-flex items-center justify-center rounded-md h-9 w-9 text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-card border-border">
            <SheetTitle className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <LabLogo size={24} />
              Fiber Optics Labratory
            </SheetTitle>
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-3 py-2.5 rounded-lg transition-colors text-sm",
                    isActive(pathname, link.href)
                      ? "text-primary font-medium bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  {link.label[language]}
                </Link>
              ))}
              <button
                type="button"
                onClick={toggleLanguage}
                className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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
