import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

type Theme = {
  id: string;
  title: string;
  options: { id: 'A'|'B'|'C', text: string }[];
};

const THEMES: Theme[] = [
  { id: 'saude', title: "SAÚDE", options: [
    { id: 'A', text: "Ampliar postos de saúde públicos" },
    { id: 'B', text: "Parcerias com hospitais privados" },
    { id: 'C', text: "Telemedicina e saúde digital" }
  ]},
  { id: 'educacao', title: "EDUCAÇÃO", options: [
    { id: 'A', text: "Mais escolas públicas e professores" },
    { id: 'B', text: "Vouchers para escolas privadas" },
    { id: 'C', text: "Ensino técnico e profissionalizante" }
  ]},
  { id: 'seguranca', title: "SEGURANÇA", options: [
    { id: 'A', text: "Mais policiais nas ruas" },
    { id: 'B', text: "Câmeras e tecnologia de vigilância" },
    { id: 'C', text: "Programas sociais preventivos" }
  ]},
  { id: 'transporte', title: "TRANSPORTE", options: [
    { id: 'A', text: "Ampliar transporte público gratuito" },
    { id: 'B', text: "Ciclovias e mobilidade ativa" },
    { id: 'C', text: "Parcerias para transporte por aplicativo" }
  ]},
  { id: 'economia', title: "ECONOMIA", options: [
    { id: 'A', text: "Reduzir impostos para empresas" },
    { id: 'B', text: "Fortalecer estatais e empresas públicas" },
    { id: 'C', text: "Apoiar pequenos negócios e empreendedores" }
  ]},
  { id: 'ambiente', title: "MEIO AMBIENTE", options: [
    { id: 'A', text: "Fiscalizar desmatamento com mais rigor" },
    { id: 'B', text: "Energia renovável e sustentabilidade" },
    { id: 'C', text: "Equilíbrio entre desenvolvimento e preservação" }
  ]},
  { id: 'inclusao', title: "INCLUSÃO SOCIAL", options: [
    { id: 'A', text: "Ampliar programas de transferência de renda" },
    { id: 'B', text: "Capacitação profissional para populações vulneráveis" },
    { id: 'C', text: "Habitação e infraestrutura em áreas carentes" }
  ]}
];

type Candidate = { name: string; party: string; photo: string; proposals: Record<string, 'A'|'B'|'C'> };
const CANDIDATES: Candidate[] = [
  { name: "Dra. Ana Ferreira", party: "Partido Exemplo A", photo: "👩‍⚕️", proposals: { saude:'A', educacao:'A', seguranca:'C', transporte:'A', economia:'C', ambiente:'B', inclusao:'A' } },
  { name: "Sr. Carlos Menezes", party: "Partido Exemplo B", photo: "👨‍💼", proposals: { saude:'B', educacao:'B', seguranca:'A', transporte:'C', economia:'A', ambiente:'C', inclusao:'B' } },
  { name: "Prof. Maria Santos", party: "Partido Exemplo C", photo: "👩‍🏫", proposals: { saude:'C', educacao:'C', seguranca:'B', transporte:'B', economia:'B', ambiente:'A', inclusao:'C' } },
  { name: "Eng. Roberto Lima", party: "Partido Exemplo D", photo: "👨‍🔧", proposals: { saude:'A', educacao:'C', seguranca:'A', transporte:'B', economia:'A', ambiente:'B', inclusao:'C' } },
];

function Disclaimer() {
  return (
    <div className="bg-blue-50 border-2 border-blue-200 p-5 rounded-xl flex items-start gap-4 mb-6 shadow-sm">
      <AlertCircle className="h-8 w-8 text-blue-600 shrink-0 mt-1" />
      <p className="text-lg text-blue-900 leading-relaxed font-medium">
        <strong>Aviso Importante:</strong> Esta ferramenta tem caráter exclusivamente informativo. O objetivo é apresentar informações de forma neutra para apoiar sua própria análise. A decisão de voto é sempre livre e individual.
      </p>
    </div>
  );
}

export default function Match() {
  const [started, setStarted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A'|'B'|'C'>>({});
  const [showResults, setShowResults] = useState(false);

  const handleStart = () => setStarted(true);

  const handleAnswer = (optionId: 'A'|'B'|'C') => {
    const theme = THEMES[currentTheme];
    setAnswers(prev => ({ ...prev, [theme.id]: optionId }));
    
    if (currentTheme + 1 < THEMES.length) {
      setCurrentTheme(c => c + 1);
    } else {
      setShowResults(true);
    }
  };

  const getMatchPercentage = (candidate: Candidate) => {
    let matches = 0;
    THEMES.forEach(theme => {
      if (candidate.proposals[theme.id] === answers[theme.id]) {
        matches++;
      }
    });
    return Math.round((matches / THEMES.length) * 100);
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center py-6 min-h-[70vh]">
        <div className="text-center mb-8">
          <div className="text-6xl bg-green-50 p-6 rounded-full inline-block mb-4">🤝</div>
          <h1 className="text-4xl font-extrabold text-primary mb-2">Match de Candidatos</h1>
          <p className="text-xl text-muted-foreground">Descubra quais candidatos fictícios mais combinam com suas ideias.</p>
        </div>
        
        <Disclaimer />
        
        <Button onClick={handleStart} className="w-full text-2xl h-16 shadow-md" data-testid="button-start-match">
          Começar Teste
        </Button>
      </div>
    );
  }

  if (showResults) {
    const results = CANDIDATES.map(c => ({ ...c, match: getMatchPercentage(c) }))
      .sort((a, b) => b.match - a.match);

    return (
      <div className="py-4 space-y-6 pb-8">
        <Disclaimer />
        
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Seus Resultados</h2>
          <p className="text-xl text-muted-foreground">Veja a compatibilidade com suas respostas.</p>
        </div>

        <div className="space-y-4">
          {results.map((c, i) => (
            <Card key={c.name} className="overflow-hidden border-2 border-border shadow-sm">
              <CardContent className="p-0">
                <div className="flex items-center p-4 gap-4 bg-muted/30">
                  <div className="text-5xl bg-background p-2 rounded-xl shadow-sm">{c.photo}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold">{c.name}</h3>
                    <p className="text-lg text-muted-foreground">{c.party}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-primary">{c.match}%</span>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Match</p>
                  </div>
                </div>
                <div className="h-4 w-full bg-muted">
                  <div 
                    className="h-full bg-primary transition-all duration-1000 ease-out"
                    style={{ width: `${c.match}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Button onClick={() => { setStarted(false); setCurrentTheme(0); setAnswers({}); setShowResults(false); }} className="w-full h-16 text-2xl mt-4" variant="outline">
          Refazer Teste
        </Button>
      </div>
    );
  }

  const theme = THEMES[currentTheme];

  return (
    <div className="flex flex-col min-h-[70vh] py-4">
      <div className="mb-6 text-center">
        <span className="font-bold text-lg text-muted-foreground uppercase tracking-widest mb-2 block">Tema {currentTheme + 1} de {THEMES.length}</span>
        <div className="w-full bg-muted rounded-full h-3 mb-6">
          <div className="bg-primary h-3 rounded-full transition-all duration-300" style={{ width: `${((currentTheme) / THEMES.length) * 100}%` }} />
        </div>
        <h2 className="text-4xl font-extrabold text-primary">{theme.title}</h2>
        <p className="text-xl mt-2 font-medium">O que você considera mais importante?</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentTheme}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex-1 flex flex-col gap-4 justify-center"
        >
          {theme.options.map((opt) => (
            <Button 
              key={opt.id}
              variant="outline"
              className="h-auto py-6 px-6 text-left justify-start text-2xl font-medium border-2 hover:bg-primary/5 hover:border-primary whitespace-normal"
              onClick={() => handleAnswer(opt.id)}
              data-testid={`button-match-option-${opt.id}`}
            >
              <span className="bg-muted text-muted-foreground w-10 h-10 rounded-full flex items-center justify-center shrink-0 mr-4 font-bold">
                {opt.id}
              </span>
              {opt.text}
            </Button>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
