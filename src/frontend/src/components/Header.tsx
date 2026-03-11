import { Button } from "@/components/ui/button";
import { Menu, Scale, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Page } from "../App";

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onOpenConsultation: () => void;
}

export default function Header({
  currentPage,
  onNavigate,
  onOpenConsultation,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks: { label: string; page: Page }[] = [
    { label: "Home", page: "home" },
    { label: "Check Status", page: "status" },
    { label: "Admin", page: "admin" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="flex items-center gap-3 group"
            data-ocid="nav.link"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-sm bg-gold/10 border border-gold/30">
              <Scale className="w-5 h-5 text-gold" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-semibold tracking-wide text-foreground group-hover:text-gold transition-colors">
                Apex Legal Solutions
              </span>
              <span className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
                Legal Partners
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.page}
                onClick={() => onNavigate(link.page)}
                data-ocid={`nav.${link.page}.link`}
                className={`px-4 py-2 text-sm font-medium rounded-sm transition-all ${
                  currentPage === link.page
                    ? "text-gold bg-gold/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={onOpenConsultation}
              data-ocid="nav.consultation.button"
              className="ml-3 bg-gold text-primary-foreground hover:bg-gold-light font-medium text-sm px-5"
            >
              Free Consultation
            </Button>
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-sm text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="nav.mobile.toggle"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.page}
                  onClick={() => {
                    onNavigate(link.page);
                    setMobileOpen(false);
                  }}
                  data-ocid={`nav.mobile.${link.page}.link`}
                  className={`px-3 py-2.5 text-sm font-medium rounded-sm text-left transition-all ${
                    currentPage === link.page
                      ? "text-gold bg-gold/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <Button
                onClick={() => {
                  onOpenConsultation();
                  setMobileOpen(false);
                }}
                data-ocid="nav.mobile.consultation.button"
                className="mt-2 bg-gold text-primary-foreground hover:bg-gold-light"
              >
                Free Consultation
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
