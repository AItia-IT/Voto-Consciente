import { useAccessibility } from "@/contexts/accessibility-context";
import { Link, useLocation } from "wouter";
import { Home, Brain, BookOpen, UserCheck, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Type } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { cycleFontSize, toggleContrast, highContrast } = useAccessibility();
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Início" },
    { path: "/quiz", icon: Brain, label: "Quiz" },
    { path: "/academia", icon: BookOpen, label: "Academia" },
    { path: "/match", icon: UserCheck, label: "Match" },
    { path: "/chat", icon: MessageCircle, label: "Chat" },
    { path: "/dashboard", icon: User, label: "Perfil" },
  ];

  return (
    <div className="min-h-[100dvh] pb-24 bg-background relative flex flex-col max-w-md mx-auto shadow-2xl">
      {/* Floating Accessibility Actions */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button 
          onClick={cycleFontSize} 
          variant="secondary" 
          size="icon"
          className="rounded-full h-14 w-14 shadow-lg text-xl font-bold"
          data-testid="button-cycle-font"
        >
          A±
        </Button>
        <Button 
          onClick={toggleContrast} 
          variant="secondary" 
          size="icon"
          className="rounded-full h-14 w-14 shadow-lg"
          data-testid="button-toggle-contrast"
        >
          {highContrast ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </Button>
      </div>

      <main className="flex-1 p-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-md bg-card border-t border-border px-2 py-2 flex justify-between items-center z-50 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
          return (
            <Link key={item.path} href={item.path}>
              <div 
                className={`flex flex-col items-center p-2 rounded-xl flex-1 cursor-pointer transition-colors ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
                data-testid={`link-nav-${item.label.toLowerCase()}`}
              >
                <Icon className="h-7 w-7 mb-1" />
                <span className="text-xs font-semibold">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
