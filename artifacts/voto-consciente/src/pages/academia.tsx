import { useState, useEffect } from "react";
import { SpeakerButton } from "@/components/speaker-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { addXP, completeMission, getMissionsCompleted } from "@/lib/progress";
import { CheckCircle2, Lock } from "lucide-react";

type MissionCard = { text: string };
type Mission = { id: number; title: string; icon: string; xp: number; cards: MissionCard[] };

const MISSIONS: Mission[] = [
  {
    id: 1, title: "O que é Democracia?", icon: "🏛️", xp: 120,
    cards: [
      { text: "Democracia vem do grego: 'demos' (povo) + 'kratos' (poder). Significa que o povo tem o poder de escolher quem vai governar." },
      { text: "No Brasil, votamos para escolher nossos representantes: vereadores, prefeitos, deputados, governadores, senadores e presidente." },
      { text: "Sem democracia, uma pessoa ou grupo pode tomar o poder à força. Por isso o voto é tão importante!" },
      { text: "Dica: Você pode consultar as propostas dos candidatos no site do TSE antes de votar." }
    ]
  },
  {
    id: 2, title: "Os 3 Poderes", icon: "⚖️", xp: 100,
    cards: [
      { text: "O Brasil tem 3 poderes separados para que nenhum tenha poder demais: Executivo, Legislativo e Judiciário." },
      { text: "EXECUTIVO: Governa o país, o estado ou o município. Presidente, governadores e prefeitos fazem parte deste poder." },
      { text: "LEGISLATIVO: Cria as leis. Inclui o Congresso (Câmara + Senado), as Assembleias estaduais e as Câmaras municipais." },
      { text: "JUDICIÁRIO: Interpreta e aplica as leis. Garante que todos sejam tratados com justiça, incluindo o governo." }
    ]
  },
  {
    id: 3, title: "Quem Faz o Quê?", icon: "🗳️", xp: 110,
    cards: [
      { text: "VEREADOR: Trabalha na Câmara Municipal. Cria leis para a cidade e fiscaliza o prefeito." },
      { text: "PREFEITO: Administra o município. Cuida de saúde local, educação, transporte e saneamento da cidade." },
      { text: "DEPUTADO ESTADUAL/FEDERAL: Representa o estado ou o país no legislativo. Vota leis que nos afetam." },
      { text: "SENADOR: Representa o estado no Senado. Analisa as leis aprovadas pelos deputados federais." },
      { text: "GOVERNADOR: Administra o estado. Cuida da segurança, saúde estadual e estradas." },
      { text: "PRESIDENTE: Governa o país. Comanda as forças armadas e representa o Brasil no mundo." }
    ]
  },
  {
    id: 4, title: "Como Funciona uma Eleição?", icon: "📊", xp: 130,
    cards: [
      { text: "O Brasil usa urnas eletrônicas desde 1996. São seguras e contam os votos automaticamente." },
      { text: "Você vota digitando o número do candidato na urna. O número é único para cada candidato e cargo." },
      { text: "Para prefeito e presidente, se nenhum candidato passar de 50% dos votos, há um segundo turno." },
      { text: "Vereadores e deputados são eleitos por votos — quem tem mais votos vence. Não tem segundo turno." },
      { text: "Após votar, você recebe um comprovante. Guarde-o! Serve para justificar presença." }
    ]
  },
  {
    id: 5, title: "Direitos e Deveres", icon: "📜", xp: 150,
    cards: [
      { text: "DIREITO AO VOTO: Todo brasileiro entre 18 e 70 anos é obrigado a votar. Jovens de 16-17 e maiores de 70 podem votar se quiserem." },
      { text: "DIREITO À INFORMAÇÃO: Você tem direito de pedir informações sobre o que o governo faz com o seu dinheiro." },
      { text: "DEVER DE DENUNCIAR: Se você souber de corrupção, pode denunciar ao Ministério Público ou à Polícia Federal." },
      { text: "DIREITO DE CANDIDATURA: Todo cidadão com mais de 21 anos (35 para senador, 30 para governador, 35 para presidente) pode se candidatar." },
      { text: "Participar da democracia não é só votar — é também acompanhar o que os eleitos fazem depois." }
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
      // Finish mission
      completeMission(activeMission.id);
      addXP(activeMission.xp);
      const newCompleted = [...completed, activeMission.id];
      setCompleted(newCompleted);
      setActiveMission(null);
      
      // Check certificate
      if (newCompleted.length >= MISSIONS.length) {
        setShowCertificate(true);
      }
    }
  };

  if (showCertificate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
        <div className="bg-yellow-50 border-4 border-yellow-400 p-8 rounded-xl shadow-2xl relative overflow-hidden w-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200 rounded-bl-full -z-10 opacity-50" />
          <div className="text-7xl mb-6">🎓</div>
          <h1 className="text-3xl font-extrabold text-yellow-800 mb-2">CERTIFICADO</h1>
          <h2 className="text-2xl font-bold text-yellow-900 mb-6">Cidadão Democrata</h2>
          <p className="text-xl text-yellow-700 font-medium">Você completou todas as missões da Academia da Democracia e está pronto para votar com consciência!</p>
        </div>
        <Button onClick={() => setShowCertificate(false)} className="w-full h-16 text-2xl shadow-md">
          Voltar para Academia
        </Button>
      </div>
    );
  }

  if (activeMission) {
    const card = activeMission.cards[currentCard];
    return (
      <div className="flex flex-col min-h-[70vh] py-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <span>{activeMission.icon}</span> {activeMission.title}
          </h2>
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
            <Card className="mb-8 flex-1 flex flex-col justify-center border-2 border-primary/20 bg-card">
              <CardContent className="p-8 text-center relative pt-16">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-card border-2 p-2 rounded-full shadow-sm">
                  <SpeakerButton text={card.text} className="h-10 w-10 border-0" />
                </div>
                <p className="text-3xl font-medium leading-relaxed">
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

  return (
    <div className="space-y-6 pb-6">
      <div className="text-center pt-4 mb-8">
        <h1 className="text-4xl font-extrabold text-primary mb-2">Academia</h1>
        <p className="text-xl text-muted-foreground font-medium">Sua jornada de aprendizado</p>
      </div>

      <div className="relative border-l-4 border-muted ml-6 pl-8 space-y-10">
        {MISSIONS.map((mission, idx) => {
          const isCompleted = completed.includes(mission.id);
          const isNext = !isCompleted && (idx === 0 || completed.includes(MISSIONS[idx - 1].id));
          const isLocked = !isCompleted && !isNext;

          return (
            <div key={mission.id} className="relative">
              {/* Timeline marker */}
              <div className={`absolute -left-[43px] top-4 w-10 h-10 rounded-full flex items-center justify-center border-4 border-background
                ${isCompleted ? 'bg-green-500' : isNext ? 'bg-primary' : 'bg-muted'}
              `}>
                {isCompleted ? <CheckCircle2 className="text-white h-6 w-6" /> : 
                 isLocked ? <Lock className="text-muted-foreground h-5 w-5" /> :
                 <span className="text-white font-bold">{idx + 1}</span>}
              </div>

              <Card className={`overflow-hidden transition-all ${isNext ? 'ring-2 ring-primary ring-offset-2 ring-offset-background shadow-md' : isLocked ? 'opacity-60' : ''}`}>
                <CardContent className="p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl bg-muted p-3 rounded-xl">{mission.icon}</div>
                      <div>
                        <h3 className="font-bold text-xl">{mission.title}</h3>
                        <span className="text-sm font-bold text-secondary-foreground bg-secondary/20 px-2 py-1 rounded-md">+{mission.xp} XP</span>
                      </div>
                    </div>
                  </div>
                  
                  {!isLocked && !isCompleted && (
                    <Button onClick={() => startMission(mission)} className="w-full text-lg h-12" data-testid={`button-start-mission-${mission.id}`}>
                      Iniciar Missão
                    </Button>
                  )}
                  {isCompleted && (
                    <Button variant="outline" className="w-full text-lg h-12 text-green-600 border-green-200 bg-green-50 pointer-events-none">
                      Concluída
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
