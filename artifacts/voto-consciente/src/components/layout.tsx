import { useState, useEffect } from "react";
import { useAccessibility } from "@/contexts/accessibility-context";
import { Link, useLocation } from "wouter";
import { Home, UserCheck, MessageCircle, User, AlertCircle, GraduationCap, Grid3X3, Menu, X, Sun } from "lucide-react";
import mascoteImg from "@/assets/mascote.png";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { path: "/", icon: Home, label: "Início" },
  { path: "/quiz", icon: AlertCircle, label: "Fake ou Fato?" },
  { path: "/academia", icon: GraduationCap, label: "Academia" },
  { path: "/bingo", icon: Grid3X3, label: "Bingo Cívico" },
  { path: "/match", icon: UserCheck, label: "Match" },
  { path: "/dashboard", icon: User, label: "Meu Painel" },
  { path: "/chat", icon: MessageCircle, label: "Chat com Sônia" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { cycleFontSize, toggleContrast } = useAccessibility();
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  const isActive = (path: string) =>
    location === path || (path !== "/" && location.startsWith(path));

  return (
    <div className="min-h-[100dvh] pb-24 relative flex flex-col">
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-border z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">

          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 shrink-0 cursor-pointer">
              <img src={mascoteImg} alt="Sônia" className="h-11 w-11 rounded-full object-cover border-2 border-amber-200" />
              <div className="hidden sm:block">
                <div className="font-bold text-base text-foreground leading-tight">Voto Consciente</div>
                <div className="text-xs text-muted-foreground">Aprender, conferir, decidir.</div>
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex flex-1 items-center gap-1.5 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} href={item.path}>
                  <div
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer
                      ${isActive(item.path)
                        ? "bg-[#1a2744] text-white"
                        : "bg-muted text-muted-foreground hover:bg-amber-50 hover:text-[#1a2744]"}`}
                    data-testid={`link-nav-${item.label.toLowerCase()}`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Spacer on mobile */}
          <div className="flex-1 md:hidden" />

          {/* Accessibility buttons */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={cycleFontSize}
              className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-sm font-bold hover:bg-amber-100 transition-colors"
              data-testid="button-cycle-font"
              aria-label="Alterar tamanho da fonte"
            >
              A±
            </button>
            <button
              onClick={toggleContrast}
              className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-amber-100 transition-colors"
              data-testid="button-toggle-contrast"
              aria-label="Alternar alto contraste"
            >
              <Sun className="h-4 w-4" />
            </button>
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-amber-100 transition-colors"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="md:hidden overflow-hidden border-t border-border bg-white/98"
            >
              <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.path} href={item.path}>
                      <div
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold cursor-pointer transition-colors
                          ${isActive(item.path)
                            ? "bg-[#1a2744] text-white"
                            : "text-[#1a2744] hover:bg-amber-50"}`}
                        data-testid={`link-mobile-nav-${item.label.toLowerCase()}`}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {item.label}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 pt-20 p-4 max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
