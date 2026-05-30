import { Link } from "wouter";
import { SpeakerButton } from "@/components/speaker-button";
import { AlertCircle, GraduationCap, UserCheck, User, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import mascoteImg from "@/assets/mascote.png";

export default function Home() {
  const welcomeMessage = "Não existem respostas erradas. Aqui, experiência de vida não tem idade!";

  const cards = [
    {
      title: "Quiz Fake ou Fato?",
      description: "Teste seus conhecimentos e aprenda a identificar notícias falsas.",
      icon: AlertCircle,
      path: "/quiz",
      color: "bg-red-50 text-red-700",
    },
    {
      title: "Academia",
      description: "Aulas simples sobre como funciona a política no Brasil.",
      icon: GraduationCap,
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
      title: "Meu Painel",
      description: "Veja suas medalhas, pontuação e histórico de aprendizado.",
      icon: User,
      path: "/dashboard",
      color: "bg-yellow-50 text-yellow-700",
    }
  ];

  return (
    <div className="space-y-8 pb-8">
      <div className="text-center pt-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Bem-vindo ao Voto Consciente</h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium">Aprenda a votar com segurança e confiança.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 shadow-sm border border-border flex flex-col md:flex-row items-center text-center md:text-left relative overflow-hidden gap-6"
        style={{ background: 'linear-gradient(to right, #FFF3C4, #FFE4B0)' }}
      >
        <img src={mascoteImg} alt="Sônia" className="h-32 w-32 md:h-40 md:w-40 rounded-full object-cover border-4 border-white shadow-md shrink-0" />
        <div className="flex-1">
          <div className="bg-white/80 p-4 rounded-xl mb-4 relative shadow-sm inline-block">
            <p className="text-xl leading-relaxed text-foreground font-medium">"{welcomeMessage}"</p>
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/80 rotate-45 hidden md:block" />
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white/80 rotate-45 md:hidden" />
          </div>
        </div>
        <div className="shrink-0">
            <SpeakerButton text={welcomeMessage} className="bg-white hover:bg-white/90" />
        </div>
      </motion.div>

      <div className="flex justify-center">
        <Link href="/academia">
          <Button className="h-16 px-12 text-2xl font-bold rounded-full shadow-lg hover:scale-105 transition-transform" size="lg">
            Começar agora
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link key={card.path} href={card.path}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="block cursor-pointer h-full"
                data-testid={`link-home-card-${idx}`}
              >
                <Card className="hover:border-primary transition-colors hover:shadow-md h-full bg-white">
                  <CardContent className="p-6 flex items-center gap-4 h-full">
                    <div className={`p-4 rounded-xl ${card.color} shrink-0`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-1 text-foreground">{card.title}</h3>
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
