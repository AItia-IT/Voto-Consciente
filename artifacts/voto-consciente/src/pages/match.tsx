import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ChevronDown, ChevronUp, CheckCircle2, XCircle, Loader2, ExternalLink } from "lucide-react";
import { useListPoliticos } from "@workspace/api-client-react";
import type { Politico } from "@workspace/api-client-react";
import { useTTS } from "@/hooks/use-tts";

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

// Posicionamento de cada candidato nos 7 temas do questionário
// saude:  A=público  B=privado     C=digital
// educacao: A=público B=vouchers   C=técnico
// seguranca: A=policial B=tecnologia C=social
// transporte: A=gratuito B=ciclovias C=aplicativo
// economia: A=impostos B=estatais   C=pequenos negócios
// ambiente: A=fiscalização B=renovável C=equilíbrio
// inclusao: A=transferência B=capacitação C=habitação
const CANDIDATE_PROPOSALS: Record<string, Record<string, 'A'|'B'|'C'>> = {
  "TABATA AMARAL":       { saude:'A', educacao:'A', seguranca:'C', transporte:'B', economia:'C', ambiente:'B', inclusao:'A' },
  "GUILHERME BOULOS":    { saude:'A', educacao:'A', seguranca:'C', transporte:'A', economia:'B', ambiente:'A', inclusao:'C' },
  "KIM KATAGUIRI":       { saude:'C', educacao:'C', seguranca:'A', transporte:'C', economia:'A', ambiente:'C', inclusao:'B' },
  "SÂMIA BOMFIM":        { saude:'A', educacao:'A', seguranca:'C', transporte:'B', economia:'B', ambiente:'A', inclusao:'A' },
  "NIKOLAS FERREIRA":    { saude:'B', educacao:'B', seguranca:'A', transporte:'C', economia:'A', ambiente:'C', inclusao:'C' },
  "DUDA SALABERT":       { saude:'A', educacao:'C', seguranca:'C', transporte:'B', economia:'C', ambiente:'B', inclusao:'B' },
  "MARIA DO ROSÁRIO":    { saude:'A', educacao:'A', seguranca:'C', transporte:'A', economia:'B', ambiente:'A', inclusao:'A' },
  "GLEISI HOFFMANN":     { saude:'A', educacao:'A', seguranca:'C', transporte:'A', economia:'B', ambiente:'A', inclusao:'A' },
  "ERIKA KOKAY":         { saude:'A', educacao:'A', seguranca:'C', transporte:'A', economia:'B', ambiente:'A', inclusao:'C' },
  "GLAUBER BRAGA":       { saude:'A', educacao:'A', seguranca:'C', transporte:'A', economia:'B', ambiente:'A', inclusao:'A' },
  "NATÁLIA BONAVIDES":   { saude:'A', educacao:'A', seguranca:'C', transporte:'A', economia:'B', ambiente:'B', inclusao:'B' },
  "REGINALDO LOPES":     { saude:'A', educacao:'A', seguranca:'C', transporte:'A', economia:'B', ambiente:'A', inclusao:'A' },
  "CAPITÃO ALBERTO NETO":{ saude:'B', educacao:'C', seguranca:'A', transporte:'C', economia:'A', ambiente:'C', inclusao:'B' },
  "CORONEL MEIRA":       { saude:'B', educacao:'B', seguranca:'A', transporte:'C', economia:'A', ambiente:'C', inclusao:'C' },
  "CAROLINE DE TONI":    { saude:'B', educacao:'B', seguranca:'A', transporte:'C', economia:'A', ambiente:'C', inclusao:'C' },
  "RODRIGO AGOSTINHO":   { saude:'A', educacao:'C', seguranca:'B', transporte:'B', economia:'C', ambiente:'B', inclusao:'B' },
  "IVAN VALENTE":        { saude:'A', educacao:'A', seguranca:'C', transporte:'A', economia:'B', ambiente:'A', inclusao:'A' },
  "CELSO SABINO":        { saude:'C', educacao:'C', seguranca:'B', transporte:'C', economia:'C', ambiente:'C', inclusao:'B' },
  "PEDRO PAULO":         { saude:'C', educacao:'C', seguranca:'B', transporte:'C', economia:'C', ambiente:'C', inclusao:'C' },
  "FELIPE RIGONI":       { saude:'C', educacao:'C', seguranca:'B', transporte:'C', economia:'C', ambiente:'B', inclusao:'B' },
};

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

type CandidateWithMatch = Politico & { match: number; proposals: Record<string, 'A'|'B'|'C'> };

function CandidateProposalDetail({ candidate, answers }: { candidate: CandidateWithMatch; answers: Record<string, 'A'|'B'|'C'> }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="overflow-hidden border border-border shadow-sm bg-white">
      <CardContent className="p-0">
        <div className="flex items-center p-4 gap-4 bg-muted/30">
          <div className="text-5xl bg-white p-2 rounded-xl shadow-sm border border-border">{candidate.foto ?? "👤"}</div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-foreground">{candidate.nome}</h3>
            <p className="text-lg text-muted-foreground">{candidate.partido} · {candidate.cargo}</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold text-primary">{candidate.match}%</span>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Match</p>
          </div>
        </div>
        <div className="h-4 w-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${candidate.match}%` }}
          />
        </div>
        <div className="flex border-t divide-x bg-white">
          <button
            className="flex-1 flex items-center justify-center gap-2 py-3 text-lg font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            onClick={() => setExpanded(e => !e)}
            data-testid={`button-expand-candidate-${candidate.nome.replace(/\s+/g, '-')}`}
          >
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            {expanded ? "Ocultar propostas" : "Ver propostas por tema"}
          </button>
          <Link href={`/politico/${candidate.id}`}>
            <button className="flex items-center justify-center gap-2 px-4 py-3 text-base font-semibold text-primary hover:bg-primary/5 transition-colors">
              Perfil completo <ExternalLink className="h-4 w-4" />
            </button>
          </Link>
        </div>
        {expanded && (
          <div className="border-t divide-y bg-white">
            {THEMES.map(theme => {
              const candidateChoice = candidate.proposals[theme.id];
              const userChoice = answers[theme.id];
              const matches = candidateChoice === userChoice;
              const candidateOption = theme.options.find(o => o.id === candidateChoice);
              const userOption = theme.options.find(o => o.id === userChoice);
              return (
                <div key={theme.id} className={`p-4 ${matches ? 'bg-green-50/50' : 'bg-red-50/50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {matches
                      ? <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                      : <XCircle className="h-5 w-5 text-red-500 shrink-0" />}
                    <span className="font-bold text-lg uppercase tracking-wide text-foreground">{theme.title}</span>
                  </div>
                  <div className="space-y-1 pl-7 text-foreground">
                    <p className="text-base"><span className="font-semibold">Você:</span> {userOption?.text ?? "—"}</p>
                    <p className="text-base"><span className="font-semibold">{candidate.nome.split(' ')[0]}:</span> {candidateOption?.text ?? "—"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Match() {
  const [started, setStarted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A'|'B'|'C'>>({});
  const [showResults, setShowResults] = useState(false);

  const { data: politicos, isLoading } = useListPoliticos();
  const { speak } = useTTS();

  // Auto-read each theme question + options so illiterate users hear the choices
  useEffect(() => {
    if (!started || showResults) return;
    const theme = THEMES[currentTheme];
    const text =
      `Tema ${currentTheme + 1} de ${THEMES.length}: ${theme.title}. ` +
      `O que você considera mais importante? ` +
      theme.options.map(o => `Opção ${o.id}: ${o.text}`).join('. ');
    const t = setTimeout(() => speak(text), 700);
    return () => clearTimeout(t);
  }, [started, currentTheme, showResults]);

  const candidates: CandidateWithMatch[] = (politicos ?? []).map(p => ({
    ...p,
    match: 0,
    proposals: CANDIDATE_PROPOSALS[p.nomeUrna] ?? {},
  }));

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

  const getMatchPercentage = (candidate: CandidateWithMatch) => {
    const proposals = candidate.proposals;
    if (Object.keys(proposals).length === 0) return 0;
    let matches = 0;
    THEMES.forEach(theme => {
      if (proposals[theme.id] === answers[theme.id]) {
        matches++;
      }
    });
    return Math.round((matches / THEMES.length) * 100);
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center py-6 min-h-[70vh] max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl bg-primary/10 p-6 rounded-full inline-block mb-4">🤝</div>
          <h1 className="text-4xl font-extrabold text-foreground mb-2">Match de Candidatos</h1>
          <p className="text-xl text-muted-foreground">Descubra quais candidatos mais combinam com suas ideias.</p>
        </div>
        
        <Disclaimer />
        
        {isLoading ? (
          <div className="flex items-center gap-3 text-muted-foreground text-lg mb-4">
            <Loader2 className="h-6 w-6 animate-spin" /> Carregando candidatos...
          </div>
        ) : candidates.length === 0 ? (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-4 text-yellow-800 text-base">
            Nenhum candidato encontrado. Execute o seed via <code className="font-mono text-sm">/api/admin/sync</code> para popular os dados.
          </div>
        ) : null}

        <Button onClick={handleStart} className="w-full text-2xl h-16 shadow-md" data-testid="button-start-match" disabled={isLoading}>
          Começar Teste
        </Button>
      </div>
    );
  }

  if (showResults) {
    const results = candidates
      .map(c => ({ ...c, match: getMatchPercentage(c) }))
      .sort((a, b) => b.match - a.match);

    return (
      <div className="py-4 space-y-6 pb-8 max-w-3xl mx-auto">
        <Disclaimer />
        
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-foreground">Seus Resultados</h2>
          <p className="text-xl text-muted-foreground">Veja a compatibilidade com suas respostas.</p>
        </div>

        <p className="text-lg text-muted-foreground text-center -mt-2">Toque em cada candidato para ver as propostas por tema.</p>

        <div className="space-y-4">
          {results.slice(0, 4).map((c) => (
            <CandidateProposalDetail key={c.id} candidate={c} answers={answers} />
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
    <div className="flex flex-col min-h-[70vh] py-4 max-w-2xl mx-auto">
      <div className="mb-6 text-center">
        <span className="font-bold text-lg text-muted-foreground uppercase tracking-widest mb-2 block">Tema {currentTheme + 1} de {THEMES.length}</span>
        <div className="w-full bg-muted rounded-full h-3 mb-6">
          <div className="bg-primary h-3 rounded-full transition-all duration-300" style={{ width: `${((currentTheme) / THEMES.length) * 100}%` }} />
        </div>
        <h2 className="text-4xl font-extrabold text-foreground">{theme.title}</h2>
        <p className="text-xl mt-2 font-medium text-muted-foreground">O que você considera mais importante?</p>
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
              className="h-auto py-6 px-6 text-left justify-start text-2xl font-medium border-2 hover:bg-primary/5 hover:border-primary whitespace-normal bg-white"
              onClick={() => handleAnswer(opt.id)}
              data-testid={`button-match-option-${opt.id}`}
            >
              <span className="bg-muted text-muted-foreground w-10 h-10 rounded-full flex items-center justify-center shrink-0 mr-4 font-bold border border-border">
                {opt.id}
              </span>
              <span className="text-foreground">{opt.text}</span>
            </Button>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
