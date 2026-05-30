import { Link } from "wouter";
import { SpeakerButton } from "@/components/speaker-button";
import { AlertCircle, GraduationCap, UserCheck, User, ArrowRight, MessageCircle, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import mascoteImg from "@/assets/mascote.png";

const soniaMessage =
  "Oi! Eu sou a Sônia. Vou te acompanhar passo a passo. Pode ir no seu ritmo — aqui não tem pressa nem cobrança. 💛";

const cards = [
  {
    title: "Quiz Fake ou Fato?",
    description: "Teste seus conhecimentos e aprenda a identificar notícias falsas.",
    icon: AlertCircle,
    path: "/quiz",
    iconBg: "#FEE2E2",
    iconColor: "#DC2626",
    badge: "10 questões",
  },
  {
    title: "Academia da Democracia",
    description: "Aulas simples sobre como funciona a política no Brasil.",
    icon: GraduationCap,
    path: "/academia",
    iconBg: "#DBEAFE",
    iconColor: "#2563EB",
    badge: "5 missões",
  },
  {
    title: "Match de Candidatos",
    description: "Descubra quais propostas combinam com o que você pensa.",
    icon: UserCheck,
    path: "/match",
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
    badge: "7 temas",
  },
  {
    title: "Chat com a Sônia",
    description: "Tire dúvidas sobre democracia e votação com sua assistente.",
    icon: MessageCircle,
    path: "/chat",
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
    badge: "Ao vivo",
  },
  {
    title: "Meu Painel",
    description: "Veja suas medalhas, pontuação e histórico de aprendizado.",
    icon: User,
    path: "/dashboard",
    iconBg: "#F3E8FF",
    iconColor: "#9333EA",
    badge: "Seu progresso",
  },
];

export default function Home() {
  return (
    <div className="pb-8">
      {/* ── HERO ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-6 pb-10">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5" style={{ background: "#FEF3C7", color: "#92400E" }}>
            <span>🌻</span> Bem-vindo(a)!
          </div>

          {/* Headline */}
          <h1 className="font-extrabold leading-tight mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", color: "#1a2744" }}>
            Aprender, conferir,{" "}
            <span style={{ color: "#F59E0B" }}>decidir.</span>
          </h1>

          {/* Sub */}
          <p className="text-lg leading-relaxed mb-7" style={{ color: "#4a5568", maxWidth: 480 }}>
            O Voto Consciente é um espaço calmo e divertido para você aprender a reconhecer notícias falsas, entender melhor a democracia e conhecer propostas de candidatos — sempre de forma neutra.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Link href="/quiz">
              <Button
                className="h-13 px-7 text-lg font-bold rounded-full shadow-md hover:scale-105 transition-transform"
                style={{ background: "#1a2744", color: "#fff", border: "none" }}
              >
                Começar pelo Quiz
              </Button>
            </Link>
            <Link href="/academia">
              <Button
                variant="outline"
                className="h-13 px-7 text-lg font-bold rounded-full hover:scale-105 transition-transform"
                style={{ borderColor: "#1a2744", color: "#1a2744" }}
              >
                Ver as Missões
              </Button>
            </Link>
          </div>

          {/* Neutrality note */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ background: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0" }}>
            <Shield className="h-4 w-4" />
            Plataforma neutra. Não recomendamos partidos ou candidatos.
          </div>
        </motion.div>

        {/* Right — Sônia card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring", bounce: 0.35 }}
          className="flex justify-center md:justify-end"
        >
          <div
            className="rounded-3xl p-5 shadow-xl max-w-xs w-full"
            style={{ background: "linear-gradient(135deg, #FEF9EC 0%, #FDE8CC 100%)", border: "2px solid #F59E0B" }}
          >
            <div className="flex items-start gap-4 mb-4">
              <img
                src={mascoteImg}
                alt="Sônia"
                className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md shrink-0"
              />
              <div>
                <p className="text-base leading-snug font-medium" style={{ color: "#1a2744" }}>
                  <strong>Oi! Eu sou a Sônia.</strong> Vou te acompanhar passo a passo. Pode ir no seu ritmo — aqui não tem pressa nem cobrança. 💛
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <SpeakerButton text={soniaMessage} className="gap-2 px-4 py-2 rounded-full font-semibold text-sm" style={{ background: "#1a2744", color: "#fff" } as React.CSSProperties} />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Section title ── */}
      <div className="mb-5">
        <h2 className="text-2xl font-bold" style={{ color: "#1a2744" }}>Por onde começar?</h2>
        <p className="text-base mt-1" style={{ color: "#6B7280" }}>Escolha a atividade que mais te interessa.</p>
      </div>

      {/* ── Feature cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link key={card.path} href={card.path}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.08 }}
                className="block cursor-pointer h-full"
                data-testid={`link-home-card-${idx}`}
              >
                <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5 h-full bg-white border-2 hover:border-amber-300" style={{ borderColor: "#F3F4F6" }}>
                  <CardContent className="p-5 flex items-center gap-4 h-full">
                    <div
                      className="p-4 rounded-2xl shrink-0 flex items-center justify-center"
                      style={{ background: card.iconBg }}
                    >
                      <Icon className="h-8 w-8" style={{ color: card.iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg leading-tight" style={{ color: "#1a2744" }}>{card.title}</h3>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ background: "#FEF3C7", color: "#92400E" }}>
                          {card.badge}
                        </span>
                      </div>
                      <p className="text-sm leading-snug" style={{ color: "#6B7280" }}>{card.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0" style={{ color: "#9CA3AF" }} />
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
