import { Scale } from "lucide-react";
import type { Page } from "../App";

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-navy py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-sm bg-gold/10 border border-gold/30">
                <Scale className="w-5 h-5 text-gold" />
              </div>
              <div>
                <div className="font-display text-lg font-semibold text-foreground">
                  Apex Legal Solutions
                </div>
                <div className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
                  Legal Partners
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Justice. Clarity. Results.
              <br />
              Free legal consultation for everyone.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-gold uppercase tracking-widest mb-4">
              Navigation
            </h3>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onNavigate("home")}
                data-ocid="footer.home.link"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => onNavigate("status")}
                data-ocid="footer.status.link"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Check Status
              </button>
              <button
                type="button"
                onClick={() => onNavigate("admin")}
                data-ocid="footer.admin.link"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                Admin Portal
              </button>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-semibold text-gold uppercase tracking-widest mb-4">
              Services
            </h3>
            <div className="flex flex-col gap-1.5">
              {[
                "Civil Litigation",
                "Criminal Defense",
                "Family Law",
                "Employment Disputes",
                "Arbitration",
                "Contract Drafting",
                "Corporate Advisory",
                "Real Estate",
                "Wills & Estates",
                "Business Formation",
              ].map((s) => (
                <span key={s} className="text-sm text-muted-foreground">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {year} Apex Legal Solutions. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-light transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
