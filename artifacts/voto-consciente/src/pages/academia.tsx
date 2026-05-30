import { useState, useEffect } from "react";
import { SpeakerButton } from "@/components/speaker-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { addXP, completeMission, getMissionsCompleted } from "@/lib/progress";
import { CheckCircle2, Lock } from "lucide-react";
import mascoteImg from "@/assets/mascote.png";

type MissionCard = { text: string };
type Mission = { id: number; title: string; subtitle: string; xp: number; cards: MissionCard[] };

const MISSIONS: Mission[] = [
  {
    id: 1, title: "Quem cria as leis?", subtitle: "O papel do Congresso Nacional", xp: 120,
    cards: [
      { text: "O Brasil tem 3 poderes separados para que nenhum tenha poder demais: Executivo, Legislativo e Judiciário." },
      { text: "EXECUTIVO: Governa o país, o estado ou o município. Presidente, governadores e prefeitos fazem parte deste poder." },
      { text: "LEGISLATIVO: Cria as leis. Inclui o Congresso (Câmara + Senado), as Assembleias estaduais e as Câmaras municipais." },
      { text: "JUDICIÁRIO: Interpreta e aplica as leis. Garante que todos sejam tratados com justiça, incluindo o governo." }
    ]
  },
  {
    id: 2, title: "Quem fiscaliza o governo?", subtitle: "Controle e fiscalização democrática", xp: 100,
    cards: [
      { text: "O Poder Judiciário garante que as leis sejam cumpridas por todos, inclusive pelos governantes." },
      { text: "O Tribunal de Contas da União (TCU) fiscaliza como o dinheiro público é gasto." },
      { text: "O Ministério Público atua para defender os direitos da sociedade e pode processar políticos por corrupção." },
      { text: "Mas a principal fiscalização vem de você! O cidadão pode e deve cobrar seus representantes." }
    ]
  },
  {
    id: 3, title: "Como funciona uma eleição?", subtitle: "Do cadastro à apuração", xp: 110,
    cards: [
      { text: "O Brasil usa urnas eletrônicas desde 1996. São seguras e contam os votos automaticamente." },
      { text: "Você vota digitando o número do candidato na urna. O número é único para cada candidato e cargo." },
      { text: "Para prefeito e presidente, se nenhum candidato passar de 50% dos votos, há um segundo turno." },
      { text: "Vereadores e deputados são eleitos por votos — quem tem mais votos vence. Não tem segundo turno." }
    ]
  },
  {
    id: 4, title: "Quais são os seus direitos?", subtitle: "Direitos do cidadão brasileiro", xp: 130,
    cards: [
      { text: "DIREITO AO VOTO: Todo brasileiro entre 18 e 70 anos é obrigado a votar. Jovens de 16-17 e maiores de 70 podem votar se quiserem." },
      { text: "DIREITO À INFORMAÇÃO: Você tem direito de pedir informações sobre o que o governo faz com o seu dinheiro." },
      { text: "DEVER DE DENUNCIAR: Se você souber de corrupção, pode denunciar ao Ministério Público ou à Polícia Federal." },
      { text: "Participar da democracia não é só votar — é também acompanhar o que os eleitos fazem depois." }
    ]
  },
  {
    id: 5, title: "Como identificar fake news?", subtitle: "Ferramentas de verificação", xp: 150,
    cards: [
      { text: "Sempre desconfie de mensagens que pedem para você 'compartilhar urgente' ou que causam muita raiva." },
      { text: "Verifique a fonte: a notícia foi publicada em sites de jornalismo conhecidos?" },
      { text: "Procure no Google o título da notícia junto com a palavra 'fake'. Provavelmente alguém já checou." },
      { text: "Agências como Lupa, Aos Fatos e Fato ou Fake são especializadas em desmentir mentiras na internet." }
    ]
  }
];

export default function Academia() {
  const [completed, setCompleted] = useState<number[]>([]);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    setCompleted(getMissionsCompleted());
  }, []);

  const startMission = (mission: Mission) => {
    setActiveMission(mission);
    setCurrentCard(0);
  };

  const nextCard = () => {
    if (activeMission && currentCard + 1 < activeMission.cards.length) {
      setCurrentCard(c => c + 1);
    } else if (activeMission) {
      completeMission(activeMission.id);
      addXP(activeMission.xp);
      const newCompleted = [...completed, activeMission.id];
      setCompleted(newCompleted);
      setActiveMission(null);
      if (newCompleted.length >= MISSIONS.length) {
        setShowCertificate(true);
      }
    }
  };

  if (showCertificate) {
    const certText = "Parabéns! Você completou todas as missões da Academia da Democracia e está pronto para votar com consciência! Você conquistou o certificado Cidadão Democrata!";
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
        <div className="bg-yellow-50 border-4 border-yellow-400 p-8 rounded-xl shadow-2xl relative overflow-hidden w-full max-w-md mx-auto">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200 rounded-bl-full -z-10 opacity-50" />
          <div className="text-7xl mb-6">🎓</div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-3xl font-extrabold text-yellow-800">CERTIFICADO</h1>
            <SpeakerButton text={certText} className="h-10 w-10 shrink-0" />
          </div>
          <h2 className="text-2xl font-bold text-yellow-900 mb-6">Cidadão Democrata</h2>
          <p className="text-xl text-yellow-700 font-medium">Você completou todas as missões da Academia da Democracia e está pronto para votar com consciência!</p>
        </div>
        <Button onClick={() => setShowCertificate(false)} className="w-full max-w-md h-16 text-2xl shadow-md">
          Voltar para Academia
        </Button>
      </div>
    );
  }

  if (activeMission) {
    const card = activeMission.cards[currentCard];
    return (
      <div className="flex flex-col min-h-[70vh] py-4 max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-foreground flex-1">
              {activeMission.title}
            </h2>
            <SpeakerButton
              text={`Missão: ${activeMission.title}. ${activeMission.subtitle}`}
              className="shrink-0 h-10 w-10"
            />
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div className="bg-primary h-3 rounded-full transition-all duration-300" style={{ width: `${((currentCard) / activeMission.cards.length) * 100}%` }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <Card className="mb-8 flex-1 flex flex-col justify-center border-2 border-primary/20 bg-white">
              <CardContent className="p-8 text-center relative pt-16">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white border-2 p-2 rounded-full shadow-sm">
                  <SpeakerButton text={card.text} className="h-10 w-10 border-0" />
                </div>
                <p className="text-3xl font-medium leading-relaxed text-foreground">
                  {card.text}
                </p>
              </CardContent>
            </Card>

            <Button onClick={nextCard} className="w-full h-16 text-2xl shadow-md font-bold mt-auto" data-testid="button-next-card">
              {currentCard + 1 === activeMission.cards.length ? "Concluir Missão 🎉" : "Próximo"}
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  const welcomeMessage = "Faça uma missão por vez. Cada uma leva poucos minutos e te dá XP no seu painel.";

  return (
    <div className="space-y-8 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 shadow-sm border border-border flex flex-row items-center text-left relative overflow-hidden gap-4"
        style={{ background: 'linear-gradient(to right, #FFF3C4, #FFE4B0)' }}
      >
        <img src={mascoteImg} alt="Sônia" className="h-20 w-20 md:h-24 md:w-24 rounded-full object-cover border-4 border-white shadow-md shrink-0" />
        <div className="flex-1 relative">
          <p className="text-lg md:text-xl leading-relaxed text-foreground font-medium">"{welcomeMessage}"</p>
        </div>
        <SpeakerButton text={welcomeMessage} className="shrink-0" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MISSIONS.map((mission, idx) => {
          const isCompleted = completed.includes(mission.id);
          const isNext = !isCompleted && (idx === 0 || completed.includes(MISSIONS[idx - 1].id));
          const isLocked = !isCompleted && !isNext;

          return (
            <div key={mission.id} className="relative">
              <Card
                className={`overflow-hidden transition-all h-full ${isNext ? 'ring-2 ring-primary ring-offset-2 ring-offset-background shadow-md cursor-pointer bg-white' : isLocked ? 'opacity-80 bg-muted/50 cursor-not-allowed' : 'bg-white cursor-pointer'}`}
                onClick={() => {
                  if (!isLocked && !isCompleted) startMission(mission);
                }}
              >
                <CardContent className="p-6 flex flex-col h-full gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl
                        ${isCompleted ? 'bg-green-100 text-green-600' : isNext ? 'bg-[#F5A623] text-white' : 'bg-gray-300 text-gray-500'}
                    `}>
                      {isCompleted ? <CheckCircle2 className="h-7 w-7" /> :
                       isLocked ? <Lock className="h-6 w-6" /> :
                       mission.id}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-foreground mb-1">{mission.title}</h3>
                      <p className="text-sm text-muted-foreground">{mission.subtitle}</p>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <SpeakerButton
                        text={`Missão ${mission.id}: ${mission.title}. ${mission.subtitle}.`}
                        className="h-10 w-10 shrink-0"
                      />
                    </div>
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-border">
                    <span className="text-sm font-bold text-secondary-foreground bg-secondary/30 px-3 py-1 rounded-full">
                      +{mission.xp} XP
                    </span>
                    {!isLocked && !isCompleted && (
                      <span className="text-sm font-bold text-primary">Toque para começar</span>
                    )}
                    {isLocked && (
                      <span className="text-sm font-bold text-muted-foreground">Conclua a anterior</span>
                    )}
                    {isCompleted && (
                      <span className="text-sm font-bold text-green-600">Concluída</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
