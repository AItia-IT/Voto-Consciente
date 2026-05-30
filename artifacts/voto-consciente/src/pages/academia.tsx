import { useState, useCallback } from "react";
import { SpeakerButton } from "@/components/speaker-button";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { addXP, completeMission } from "@/lib/progress";
import { RefreshCw, ChevronRight, Star, Volume2 } from "lucide-react";
import { useTTS } from "@/hooks/use-tts";
import mascoteImg from "@/assets/mascote.png";

// ── Paleta Facebook ──────────────────────────────────────────────────────────
const FB = {
  blue:       "#1877F2",
  blueLight:  "#E7F3FF",
  blueDark:   "#166FE5",
  green:      "#42B72A",
  greenLight: "#E6F4EA",
  bg:         "#F0F2F5",
  white:      "#FFFFFF",
  border:     "#E4E6EB",
  textPrimary:"#050505",
  textMuted:  "#65676B",
  shadow:     "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
  shadowMd:   "0 4px 12px rgba(0,0,0,0.15)",
};

// ── Banco de termos cívicos (24 termos + FREE central) ──────────────────────
const TERMS: { term: string; definition: string }[] = [
  { term: "Poder Executivo",     definition: "Governa o país. Inclui o Presidente, governadores e prefeitos." },
  { term: "Poder Legislativo",   definition: "Cria as leis. Congresso Nacional, Assembleias estaduais e Câmaras municipais." },
  { term: "Poder Judiciário",    definition: "Interpreta e aplica as leis. Garante que todos sejam tratados com justiça." },
  { term: "TCU",                 definition: "Tribunal de Contas da União. Fiscaliza como o dinheiro público é gasto." },
  { term: "Ministério Público",  definition: "Defende os direitos da sociedade e pode processar políticos por corrupção." },
  { term: "Urna Eletrônica",     definition: "Usada no Brasil desde 1996. Conta os votos automaticamente e é segura." },
  { term: "Segundo Turno",       definition: "Acontece quando nenhum candidato atinge mais de 50% dos votos válidos." },
  { term: "Vereador",            definition: "Eleito por votos para a Câmara Municipal. Cria leis locais e fiscaliza o prefeito." },
  { term: "Fake News",           definition: "Notícia falsa criada para enganar. Desconfie de mensagens 'compartilhe urgente'." },
  { term: "Agência de Checagem", definition: "Site especializado em verificar se notícias são verdadeiras. Ex: Lupa, Aos Fatos." },
  { term: "Deputado Federal",    definition: "Representa o povo na Câmara dos Deputados em Brasília." },
  { term: "Senador",             definition: "Representa o estado no Senado Federal. Cada estado elege 3 senadores." },
  { term: "Presidente",          definition: "Chefe do Poder Executivo Federal. Eleito de 4 em 4 anos com segundo turno." },
  { term: "Voto Obrigatório",    definition: "Todo brasileiro entre 18 e 70 anos é obrigado a votar nas eleições." },
  { term: "Voto Facultativo",    definition: "Jovens de 16-17 anos e maiores de 70 podem votar se quiserem, sem obrigação." },
  { term: "Congresso Nacional",  definition: "Formado pela Câmara dos Deputados e pelo Senado Federal." },
  { term: "Constituição",        definition: "Lei maior do Brasil. Define os direitos dos cidadãos e os limites do governo." },
  { term: "Mandato",             definition: "Período de tempo que um político eleito fica no cargo." },
  { term: "Cidadania",           definition: "Conjunto de direitos e deveres que cada pessoa tem em uma democracia." },
  { term: "Democracia",          definition: "Sistema de governo onde o poder vem do povo, por meio de eleições livres." },
  { term: "Lei de Acesso",       definition: "Direito do cidadão de pedir informações sobre o que o governo faz com dinheiro público." },
  { term: "Polícia Federal",     definition: "Órgão que investiga crimes federais, como corrupção e tráfico internacional." },
  { term: "Eleitorado",          definition: "Conjunto de todos os cidadãos com direito de votar em um lugar." },
  { term: "Fiscalizar",          definition: "Dever de acompanhar o que os políticos eleitos fazem depois do voto." },
];

// ── Utilitários ──────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const BINGO_LINES: number[][] = [
  [0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24],
  [0,5,10,15,20],[1,6,11,16,21],[2,7,12,17,22],[3,8,13,18,23],[4,9,14,19,24],
  [0,6,12,18,24],[4,8,12,16,20],
];

function buildGrid(): Array<{ term: string; definition: string } | null> {
  const picked = shuffle(TERMS).slice(0, 24);
  const grid: Array<{ term: string; definition: string } | null> = [...picked];
  grid.splice(12, 0, null);
  return grid;
}

// ── Confetti ─────────────────────────────────────────────────────────────────
function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: [FB.blue, FB.green, "#F7B928", "#E74C3C", "#9B59B6", FB.blueDark][i % 6],
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 0.5,
    duration: 1.2 + Math.random() * 0.8,
  }));
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          className="absolute top-0 w-3 h-3 rounded-sm"
          style={{ left: p.left, background: p.color }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{ y: "105vh", rotate: 720, opacity: 0 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function Academia() {
  const { speak: speakTerm } = useTTS();
  const [grid, setGrid] = useState<Array<{ term: string; definition: string } | null>>(() => buildGrid());
  const [callOrder, setCallOrder] = useState<number[]>(() => shuffle([...Array(24).keys()]));
  const [callIdx, setCallIdx] = useState(0);
  const [marked, setMarked] = useState<Set<number>>(() => new Set([12]));
  const [celebratedLines, setCelebratedLines] = useState<Set<string>>(new Set());
  const [showBingo, setShowBingo] = useState(false);
  const [bingoXP, setBingoXP] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const currentEntry = TERMS[callOrder[callIdx] as number];

  const termToGridPos = useCallback(() => {
    const map = new Map<string, number>();
    grid.forEach((cell, pos) => { if (cell) map.set(cell.term, pos); });
    return map;
  }, [grid]);

  const checkBingo = (markedSet: Set<number>) => {
    const newLines: number[][] = [];
    for (const line of BINGO_LINES) {
      const key = line.join(",");
      if (!celebratedLines.has(key) && line.every(i => markedSet.has(i))) newLines.push(line);
    }
    return newLines;
  };

  const handleCellClick = (gridPos: number) => {
    if (marked.has(gridPos) || grid[gridPos] === null) return;
    const cell = grid[gridPos];
    if (!cell) return;
    const calledTerms = new Set(callOrder.slice(0, callIdx + 1).map(i => TERMS[i as number].term));
    if (!calledTerms.has(cell.term)) return;

    const newMarked = new Set(marked);
    newMarked.add(gridPos);
    setMarked(newMarked);

    const justBingo = checkBingo(newMarked);
    if (justBingo.length > 0) {
      const xp = justBingo.length * 100;
      setBingoXP(xp);
      addXP(xp);
      const newCelebrated = new Set(celebratedLines);
      justBingo.forEach(l => newCelebrated.add(l.join(",")));
      setCelebratedLines(newCelebrated);
      setShowBingo(true);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2200);
    }

    if (newMarked.size === 25) {
      completeMission(99);
      addXP(300);
      setTimeout(() => { setGameOver(true); setShowCertificate(true); setConfetti(true); }, 700);
    }
  };

  const nextCall = () => { if (callIdx + 1 < 24) setCallIdx(c => c + 1); };

  const newGame = () => {
    setGrid(buildGrid());
    setCallOrder(shuffle([...Array(24).keys()]));
    setCallIdx(0);
    setMarked(new Set([12]));
    setCelebratedLines(new Set());
    setShowBingo(false);
    setShowCertificate(false);
    setGameOver(false);
    setConfetti(false);
  };

  const highlightedCells = new Set<number>();
  for (const line of BINGO_LINES) {
    const key = line.join(",");
    if (celebratedLines.has(key)) line.forEach(i => highlightedCells.add(i));
  }

  const calledTerms = new Set(callOrder.slice(0, callIdx + 1).map(i => TERMS[i as number].term));
  const termToPos = termToGridPos();

  // ── Certificado ────────────────────────────────────────────────────────────
  if (showCertificate) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-5 px-4 -mx-4 -my-4 py-10"
        style={{ background: FB.bg }}
      >
        {confetti && <Confetti />}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="w-full max-w-md rounded-2xl p-8"
          style={{ background: FB.white, boxShadow: FB.shadowMd, border: `3px solid ${FB.blue}` }}
        >
          <div className="text-7xl mb-4">🎓</div>
          <h1 className="text-3xl font-extrabold mb-1" style={{ color: FB.blue }}>BINGO COMPLETO!</h1>
          <h2 className="text-xl font-bold mb-4" style={{ color: FB.textPrimary }}>Cidadão Democrata</h2>
          <p className="text-lg font-medium leading-relaxed" style={{ color: FB.textMuted }}>
            Você marcou toda a cartela e ganhou <strong style={{ color: FB.blue }}>+300 XP</strong>!<br />
            Sua democracia agradece. 🗳️
          </p>
        </motion.div>
        <button
          onClick={newGame}
          className="flex items-center gap-2 font-bold text-lg h-12 px-8 rounded-lg transition-colors"
          style={{ background: FB.blue, color: FB.white }}
          onMouseOver={e => (e.currentTarget.style.background = FB.blueDark)}
          onMouseOut={e => (e.currentTarget.style.background = FB.blue)}
        >
          <RefreshCw className="h-5 w-5" /> Jogar Novamente
        </button>
      </div>
    );
  }

  // ── Jogo ───────────────────────────────────────────────────────────────────
  return (
    <div
      className="-mx-4 -my-4 min-h-full pb-6"
      style={{ background: FB.bg }}
    >
      {confetti && <Confetti />}

      {/* Modal BINGO */}
      <AnimatePresence>
        {showBingo && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowBingo(false)}
          >
            <div className="absolute inset-0 bg-black/50" />
            <motion.div
              className="relative z-10 rounded-2xl p-8 text-center max-w-sm w-full"
              style={{ background: FB.white, boxShadow: FB.shadowMd }}
              initial={{ scale: 0.6, y: 40 }} animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.45 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-6xl mb-3">🎉</div>
              <h2 className="text-4xl font-black mb-2" style={{ color: FB.blue }}>BINGO!</h2>
              <p className="text-xl font-semibold mb-5" style={{ color: FB.textMuted }}>
                Você ganhou <strong style={{ color: FB.green }}>+{bingoXP} XP</strong>!
              </p>
              <button
                onClick={() => setShowBingo(false)}
                className="w-full h-11 rounded-lg font-bold text-lg transition-colors"
                style={{ background: FB.blue, color: FB.white }}
                onMouseOver={e => (e.currentTarget.style.background = FB.blueDark)}
                onMouseOut={e => (e.currentTarget.style.background = FB.blue)}
              >
                Continuar jogando
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-4 pt-5">
        {/* ── Header (estilo post do Facebook) ── */}
        <div
          className="rounded-xl mb-4 px-4 py-3 flex items-center justify-between"
          style={{ background: FB.white, boxShadow: FB.shadow }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg"
              style={{ background: FB.blue, color: FB.white }}
            >
              🎱
            </div>
            <div>
              <div className="font-bold text-lg leading-tight" style={{ color: FB.textPrimary }}>Bingo Cívico</div>
              <div className="text-sm" style={{ color: FB.textMuted }}>Academia da Democracia</div>
            </div>
          </div>
          <button
            onClick={newGame}
            className="flex items-center gap-2 font-semibold text-sm px-4 h-9 rounded-lg border transition-colors"
            style={{ background: FB.bg, border: `1.5px solid ${FB.border}`, color: FB.textPrimary }}
            onMouseOver={e => (e.currentTarget.style.background = FB.border)}
            onMouseOut={e => (e.currentTarget.style.background = FB.bg)}
          >
            <RefreshCw className="h-4 w-4" /> Nova Cartela
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-4">
          {/* ── Cartela ── */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: FB.white, boxShadow: FB.shadow }}
          >
            {/* Cabeçalho B-I-N-G-O */}
            <div className="grid grid-cols-5" style={{ background: FB.blue }}>
              {["B","I","N","G","O"].map(l => (
                <div key={l} className="h-10 flex items-center justify-center font-black text-xl" style={{ color: FB.white }}>
                  {l}
                </div>
              ))}
            </div>

            {/* Células */}
            <div className="grid grid-cols-5 gap-1.5 p-2">
              {grid.map((cell, pos) => {
                const isFree      = cell === null;
                const isMarked    = marked.has(pos);
                const isHighlight = highlightedCells.has(pos);
                const isCallable  = cell && calledTerms.has(cell.term);
                const isClickable = cell && isCallable && !isMarked;

                let bg     = FB.white;
                let border = `1.5px solid ${FB.border}`;
                let color  = FB.textMuted;
                if (isFree)        { bg = FB.blue;       border = `1.5px solid ${FB.blue}`;      color = FB.white; }
                else if (isHighlight){ bg = FB.green;    border = `2px solid ${FB.green}`;       color = FB.white; }
                else if (isMarked) { bg = FB.blue;       border = `2px solid ${FB.blueDark}`;    color = FB.white; }
                else if (isCallable){ bg = FB.blueLight; border = `2px solid ${FB.blue}`;        color = FB.blue;  }

                return (
                  <motion.div
                    key={pos}
                    onClick={() => handleCellClick(pos)}
                    whileHover={isClickable ? { scale: 1.03 } : {}}
                    whileTap={isClickable ? { scale: 0.97 } : {}}
                    className="relative flex flex-col items-center justify-center rounded-lg text-center font-semibold select-none transition-colors"
                    style={{
                      minHeight: "96px",
                      padding: "8px 5px 26px",
                      cursor: isClickable ? "pointer" : "default",
                      background: bg,
                      border,
                      color,
                    }}
                  >
                    {isFree ? (
                      <div className="flex flex-col items-center gap-1">
                        <img src={mascoteImg} alt="FREE" className="h-10 w-10 rounded-full object-cover ring-2 ring-white" />
                        <span className="text-xs font-bold" style={{ color: FB.white }}>FREE</span>
                      </div>
                    ) : (
                      <>
                        {isMarked && (
                          <span className="absolute top-1.5 left-2 text-base font-black leading-none" style={{ color: FB.white }}>✓</span>
                        )}
                        {isHighlight && !isMarked && (
                          <span className="absolute top-1.5 left-2 text-base leading-none">★</span>
                        )}
                        <span
                          className="leading-snug font-bold"
                          style={{ fontSize: "clamp(20px, 1.5vw, 21px)", hyphens: "auto" }}
                        >
                          {cell!.term}
                        </span>
                        <button
                          type="button"
                          aria-label={`Ouvir: ${cell!.term}`}
                          onClick={(e) => { e.stopPropagation(); speakTerm(cell!.term); }}
                          className="absolute bottom-1.5 right-1.5 rounded-full p-1 transition-opacity hover:opacity-70"
                          style={{ color: isMarked || isHighlight ? FB.white : isCallable ? FB.blue : FB.border }}
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Legenda */}
            <div className="flex flex-wrap gap-3 px-3 pb-3 text-xs font-semibold" style={{ color: FB.textMuted }}>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded inline-block" style={{ background: FB.blue }} /> Marcado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded inline-block border-2" style={{ background: FB.blueLight, borderColor: FB.blue }} /> Chamado — toque para marcar
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded inline-block" style={{ background: FB.green }} /> Bingo!
              </span>
            </div>
          </div>

          {/* ── Painel da Sônia ── */}
          <div className="flex flex-col gap-3">
            {/* Card da definição (estilo "post" do Facebook) */}
            <motion.div
              key={callIdx}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl overflow-hidden"
              style={{ background: FB.white, boxShadow: FB.shadow }}
            >
              {/* Cabeçalho do "post" */}
              <div className="flex items-center gap-3 px-4 pt-4 pb-3" style={{ borderBottom: `1px solid ${FB.border}` }}>
                <img src={mascoteImg} alt="Sônia" className="h-12 w-12 rounded-full object-cover ring-2" style={{ ringColor: FB.blue }} />
                <div>
                  <div className="font-bold leading-tight" style={{ color: FB.textPrimary }}>Sônia</div>
                  <div className="text-xs" style={{ color: FB.textMuted }}>Chamada {callIdx + 1} de 24</div>
                </div>
              </div>

              {/* Corpo do "post" */}
              <div className="px-4 py-4">
                <p className="text-base font-medium leading-relaxed" style={{ color: FB.textPrimary, minHeight: 64 }}>
                  "{currentEntry.definition}"
                </p>
              </div>

              {/* Ações (like/comment/share style) */}
              <div
                className="flex items-center gap-2 px-4 pb-4"
                style={{ borderTop: `1px solid ${FB.border}`, paddingTop: "12px" }}
              >
                <div className="flex-shrink-0">
                  <SpeakerButton text={currentEntry.definition} className="h-10 w-10 border-0" />
                </div>
                <button
                  onClick={nextCall}
                  disabled={callIdx + 1 >= 24 || gameOver}
                  className="flex-1 h-10 rounded-lg font-bold flex items-center justify-center gap-1 text-sm transition-colors disabled:opacity-50"
                  style={{ background: FB.blue, color: FB.white }}
                  onMouseOver={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = FB.blueDark; }}
                  onMouseOut={e => { e.currentTarget.style.background = FB.blue; }}
                >
                  Próxima <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>

            {/* Histórico (estilo sidebar do Facebook) */}
            <div
              className="rounded-xl p-4"
              style={{ background: FB.white, boxShadow: FB.shadow }}
            >
              <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: FB.textMuted }}>
                Termos já chamados ({callIdx + 1})
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto">
                {callOrder.slice(0, callIdx + 1).map((tIdx, i) => {
                  const t = TERMS[tIdx as number];
                  const gridPos = termToPos.get(t.term);
                  const isMarkedOnGrid = gridPos !== undefined && marked.has(gridPos);
                  return (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                      style={{
                        background: isMarkedOnGrid ? FB.blue : FB.bg,
                        color: isMarkedOnGrid ? FB.white : FB.textPrimary,
                      }}
                    >
                      {isMarkedOnGrid && <Star className="h-2.5 w-2.5" />}
                      {t.term}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Bingos conquistados */}
            {celebratedLines.size > 0 && (
              <div
                className="rounded-xl p-4"
                style={{ background: FB.greenLight, border: `1.5px solid ${FB.green}`, boxShadow: FB.shadow }}
              >
                <div className="font-bold text-sm mb-0.5" style={{ color: FB.green }}>
                  🏆 {celebratedLines.size} {celebratedLines.size === 1 ? "Bingo" : "Bingos"} conquistado{celebratedLines.size > 1 ? "s" : ""}!
                </div>
                <div className="text-xs font-semibold" style={{ color: "#2D7A1F" }}>
                  +{celebratedLines.size * 100} XP ganhos
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
