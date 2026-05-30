import { useAccessibility } from "@/contexts/accessibility-context";
import { Link, useLocation } from "wouter";
import { Home, Brain, BookOpen, UserCheck, MessageCircle, User, AlertCircle, GraduationCap } from "lucide-react";
import mascoteImg from "@/assets/mascote.png";

export function Layout({ children }: { children: React.ReactNode }) {
  const { cycleFontSize, toggleContrast, highContrast } = useAccessibility();
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Início" },
    { path: "/quiz", icon: AlertCircle, label: "Fake ou Fato?" },
    { path: "/academia", icon: GraduationCap, label: "Academia" },
    { path: "/match", icon: UserCheck, label: "Match" },
    { path: "/dashboard", icon: User, label: "Meu Painel" },
    { path: "/chat", icon: MessageCircle, label: "Chat com Sônia" },
  ];

  return (
    <div className="min-h-[100dvh] pb-24 relative flex flex-col">
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-border z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-6 overflow-x-hidden">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <img src={mascoteImg} alt="Sônia" className="h-12 w-12 rounded-full object-cover border-2 border-secondary/40" />
            <div>
              <div className="font-bold text-lg text-foreground leading-tight">Voto Consciente</div>
              <div className="text-xs text-muted-foreground">Aprender, conferir, decidir.</div>
            </div>
          </div>
          {/* Nav pills */}
          <nav className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none hidden md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
              return (
                <Link key={item.path} href={item.path}>
                  <div 
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${isActive ? 'bg-foreground text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                    data-testid={`link-nav-${item.label.toLowerCase()}`}
                  >
                    <Icon className="h-4 w-4" />{item.label}
                  </div>
                </Link>
              );
            })}
          </nav>
          
          <nav className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar md:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
              return (
                <Link key={item.path} href={item.path}>
                  <div 
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${isActive ? 'bg-foreground text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                    data-testid={`link-nav-${item.label.toLowerCase()}`}
                  >
                    <Icon className="h-4 w-4" />{item.label}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Accessibility */}
          <div className="flex gap-2 shrink-0">
            <button onClick={cycleFontSize} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-sm font-bold hover:bg-muted/80 transition-colors" data-testid="button-cycle-font">A±</button>
            <button onClick={toggleContrast} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors font-bold" data-testid="button-toggle-contrast">...</button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20 p-4 max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
