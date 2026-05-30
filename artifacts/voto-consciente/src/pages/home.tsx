import { Link } from "wouter";
import { SpeakerButton } from "@/components/speaker-button";
import { Brain, BookOpen, UserCheck, User, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Home() {
  const welcomeMessage = "Olá! Eu sou a Sônia, sua professora digital. Bem-vindo ao Voto Consciente, um lugar seguro e fácil para você aprender tudo sobre as eleições. Vamos começar?";

  const cards = [
    {
      title: "Quiz Fake ou Fato?",
      description: "Teste seus conhecimentos e aprenda a identificar notícias falsas.",
      icon: Brain,
      path: "/quiz",
      color: "bg-red-50 text-red-700",
    },
    {
      title: "Academia da Democracia",
      description: "Aulas simples sobre como funciona a política no Brasil.",
      icon: BookOpen,
      path: "/academia",
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Match de Candidatos",
      description: "Descubra quais propostas combinam mais com o que você pensa.",
      icon: UserCheck,
      path: "/match",
      color: "bg-green-50 text-green-700",
    },
    {
      title: "Meu Progresso",
      description: "Veja suas medalhas, pontuação e histórico de aprendizado.",
      icon: User,
      path: "/dashboard",
      color: "bg-yellow-50 text-yellow-700",
    }
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="text-center pt-4">
        <h1 className="text-4xl font-extrabold text-primary mb-2">Voto Consciente</h1>
        <p className="text-xl text-muted-foreground font-medium">Aprenda a votar com segurança</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-6 shadow-sm border border-border flex flex-col items-center text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />
        <div className="text-6xl mb-4">🧑‍🏫</div>
        <h2 className="text-2xl font-bold mb-2">Professora Sônia</h2>
        <div className="bg-muted/50 p-4 rounded-xl mb-4 relative">
          <p className="text-lg leading-relaxed">{welcomeMessage}</p>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-muted/50 rotate-45" />
        </div>
        <SpeakerButton text={welcomeMessage} />
      </motion.div>

      <div className="grid grid-cols-1 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link key={card.path} href={card.path}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="block cursor-pointer"
                data-testid={`link-home-card-${idx}`}
              >
                <Card className="hover:border-primary transition-colors hover:shadow-md h-full">
                  <CardContent className="p-5 flex items-center gap-4 h-full">
                    <div className={`p-4 rounded-xl ${card.color} shrink-0`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-1">{card.title}</h3>
                      <p className="text-base text-muted-foreground leading-snug">{card.description}</p>
                    </div>
                    <ArrowRight className="h-6 w-6 text-muted-foreground shrink-0" />
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
