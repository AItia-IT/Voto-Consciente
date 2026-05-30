import { useState, useCallback } from "react";
import { SpeakerButton } from "@/components/speaker-button";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { addXP, completeMission } from "@/lib/progress";
import { RefreshCw, ChevronRight, Star, Volume2 } from "lucide-react";
import { useTTS } from "@/hooks/use-tts";
import mascoteImg from "@/assets/mascote.png";

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

// Índices das 5 linhas, 5 colunas e 2 diagonais de uma grade 5×5
const BINGO_LINES: number[][] = [
  [0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14], [15,16,17,18,19], [20,21,22,23,24], // linhas
  [0,5,10,15,20], [1,6,11,16,21], [2,7,12,17,22], [3,8,13,18,23], [4,9,14,19,24], // colunas
  [0,6,12,18,24], [4,8,12,16,20],                                                   // diagonais
];

function buildGrid(): Array<{ term: string; definition: string } | null> {
  const picked = shuffle(TERMS).slice(0, 24);
  const grid: Array<{ term: string; definition: string } | null> = [...picked];
  grid.splice(12, 0, null); // FREE no centro (índice 12)
  return grid;
}

// ── Confetti simples ─────────────────────────────────────────────────────────
function Confetti() {
  const pieces = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    color: ["#F59E0B","#1a2744","#22C55E","#EF4444","#3B82F6","#A855F7"][i % 6],
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

// ── Componente principal ─────────────────────────────────────────────────────
export default function Academia() {
  const { speak: speakTerm } = useTTS();
  const [grid, setGrid] = useState<Array<{ term: string; definition: string } | null>>(() => buildGrid());
  const [callOrder, setCallOrder] = useState<number[]>(() => shuffle([...Array(24).keys()])); // índices 0-23 do TERMS original
  const [callIdx, setCallIdx] = useState(0);
  const [marked, setMarked] = useState<Set<number>>(() => new Set([12])); // FREE marcado
  const [celebratedLines, setCelebratedLines] = useState<Set<string>>(new Set());
  const [showBingo, setShowBingo] = useState(false);
  const [bingoXP, setBingoXP] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Definição que a Sônia está "cantando" agora
  // callOrder[callIdx] é o índice no TERMS array; mas o grid tem a célula FREE no meio
  // Precisamos pegar o termo do TERMS pelo callOrder
  const currentTermIdx = callOrder[callIdx] as number; // índice em TERMS (0-23)
  const currentEntry = TERMS[currentTermIdx];

  // Mapeia termo → posição na grade (0-24), ignorando FREE (índice 12 = null)
  const termToGridPos = useCallback(() => {
    const map = new Map<string, number>();
    grid.forEach((cell, pos) => {
      if (cell) map.set(cell.term, pos);
    });
    return map;
  }, [grid]);

  const checkBingo = (markedSet: Set<number>) => {
    const newLines: number[][] = [];
    for (const line of BINGO_LINES) {
      const key = line.join(",");
      if (!celebratedLines.has(key) && line.every(i => markedSet.has(i))) {
        newLines.push(line);
      }
    }
    return newLines;
  };

  const handleCellClick = (gridPos: number) => {
    if (marked.has(gridPos) || grid[gridPos] === null) return;

    // Só marca se o termo foi chamado
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

    // Cartela completa
    if (newMarked.size === 25) {
      completeMission(99); // ID especial do bingo
      addXP(300);
      setTimeout(() => {
        setGameOver(true);
        setShowCertificate(true);
        setConfetti(true);
      }, 700);
    }
  };

  const nextCall = () => {
    if (callIdx + 1 < 24) setCallIdx(c => c + 1);
  };

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

  // Células destacadas (pertencendo a uma linha de bingo celebrada)
  const highlightedCells = new Set<number>();
  for (const line of BINGO_LINES) {
    const key = line.join(",");
    if (celebratedLines.has(key)) line.forEach(i => highlightedCells.add(i));
  }

  // Termos chamados até agora
  const calledTerms = new Set(callOrder.slice(0, callIdx + 1).map(i => TERMS[i as number].term));
  const termToPos = termToGridPos();

  // ── Tela de certificado ────────────────────────────────────────────────────
  if (showCertificate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 px-4">
        {confetti && <Confetti />}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="border-4 border-yellow-400 p-8 rounded-3xl shadow-2xl w-full max-w-md"
          style={{ background: "linear-gradient(135deg,#FFFBEB,#FEF3C7)" }}
        >
          <div className="text-7xl mb-4">🎓</div>
          <h1 className="text-3xl font-extrabold text-yellow-800 mb-1">BINGO COMPLETO!</h1>
          <h2 className="text-2xl font-bold text-yellow-900 mb-4">Cidadão Democrata</h2>
          <p className="text-lg text-yellow-700 font-medium leading-relaxed">
            Você marcou toda a cartela e ganhou <strong>+300 XP</strong>!<br />
            Sua democracia agradece. 🗳️
          </p>
        </motion.div>
        <Button onClick={newGame} className="w-full max-w-md h-14 text-xl font-bold rounded-full shadow-md" style={{ background: "#1a2744" }}>
          <RefreshCw className="h-5 w-5 mr-2" /> Jogar Novamente
        </Button>
      </div>
    );
  }

  // ── Jogo ───────────────────────────────────────────────────────────────────
  return (
    <div className="pb-8">
      {confetti && <Confetti />}

      {/* Modal BINGO */}
      <AnimatePresence>
        {showBingo && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowBingo(false)}
          >
            <div className="absolute inset-0 bg-black/40" />
            <motion.div
              className="relative z-10 rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full"
              style={{ background: "#FEF3C7", border: "4px solid #F59E0B" }}
              initial={{ scale: 0.6, rotate: -6 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-6xl mb-3">🎉</div>
              <h2 className="text-4xl font-black mb-2" style={{ color: "#1a2744" }}>BINGO!</h2>
              <p className="text-xl font-semibold mb-4" style={{ color: "#92400E" }}>
                Você ganhou <strong>+{bingoXP} XP</strong>!
              </p>
              <Button onClick={() => setShowBingo(false)} className="w-full h-12 text-lg font-bold rounded-full" style={{ background: "#1a2744" }}>
                Continuar jogando
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "#1a2744" }}>🎱 Bingo Cívico</h1>
          <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>Academia da Democracia</p>
        </div>
        <Button variant="outline" onClick={newGame} className="rounded-full gap-2 font-semibold border-2" style={{ borderColor: "#1a2744", color: "#1a2744" }}>
          <RefreshCw className="h-4 w-4" /> Nova Cartela
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        {/* ── Cartela 5×5 ── */}
        <div>
          {/* Header BINGO */}
          <div className="grid grid-cols-5 gap-1 mb-1">
            {["B","I","N","G","O"].map(l => (
              <div key={l} className="h-9 flex items-center justify-center font-black text-xl rounded-lg" style={{ background: "#1a2744", color: "#F59E0B" }}>
                {l}
              </div>
            ))}
          </div>

          {/* Células */}
          <div className="grid grid-cols-5 gap-1.5">
            {grid.map((cell, pos) => {
              const isFree = cell === null;
              const isMarked = marked.has(pos);
              const isHighlighted = highlightedCells.has(pos);
              const isCallable = cell && calledTerms.has(cell.term);
              const isClickable = cell && isCallable && !isMarked;

              return (
                <motion.div
                  key={pos}
                  onClick={() => handleCellClick(pos)}
                  whileHover={isClickable ? { scale: 1.03 } : {}}
                  whileTap={isClickable ? { scale: 0.97 } : {}}
                  className="relative flex flex-col items-center justify-center rounded-xl text-center font-bold transition-all select-none"
                  style={{
                    minHeight: "100px",
                    padding: "10px 6px 28px",
                    cursor: isClickable ? "pointer" : "default",
                    background: isFree
                      ? "#1a2744"
                      : isHighlighted
                      ? "#FDE68A"
                      : isMarked
                      ? "#F59E0B"
                      : isCallable
                      ? "#FEF9EC"
                      : "#F3F4F6",
                    border: isHighlighted
                      ? "2.5px solid #F59E0B"
                      : isMarked
                      ? "2.5px solid #D97706"
                      : isCallable
                      ? "2.5px solid #F59E0B"
                      : "2.5px solid #E5E7EB",
                    color: isFree
                      ? "#F59E0B"
                      : isMarked || isHighlighted
                      ? "#1a2744"
                      : isCallable
                      ? "#1a2744"
                      : "#9CA3AF",
                  }}
                >
                  {isFree ? (
                    <img src={mascoteImg} alt="FREE" className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <>
                      {isMarked && (
                        <span className="absolute top-1.5 left-1.5 text-lg leading-none">✓</span>
                      )}
                      <span
                        className="leading-snug font-bold"
                        style={{ fontSize: "clamp(20px, 1.6vw, 22px)", hyphens: "auto" }}
                      >
                        {cell!.term}
                      </span>
                      {/* TTS por célula — acessível para todos os termos */}
                      <button
                        type="button"
                        aria-label={`Ouvir: ${cell!.term}`}
                        onClick={(e) => { e.stopPropagation(); speakTerm(cell!.term); }}
                        className="absolute bottom-1.5 right-1.5 rounded-full p-1 transition-colors hover:bg-black/10"
                        style={{ color: isMarked || isHighlighted ? "#1a2744" : isCallable ? "#F59E0B" : "#9CA3AF" }}
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
          <div className="flex flex-wrap gap-3 mt-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded inline-block" style={{background:"#F59E0B",border:"2px solid #D97706"}} /> Marcado</span>
            <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded inline-block" style={{background:"#FEF9EC",border:"2px solid #F59E0B"}} /> Chamado — toque para marcar</span>
            <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded inline-block" style={{background:"#FDE68A",border:"2px solid #F59E0B"}} /> Bingo!</span>
          </div>
        </div>

        {/* ── Painel da Sônia ── */}
        <div className="flex flex-col gap-4">
          {/* Card da definição atual */}
          <motion.div
            key={callIdx}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-5 shadow-lg"
            style={{ background: "linear-gradient(135deg,#FEF9EC,#FDE8CC)", border: "2px solid #F59E0B" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <img src={mascoteImg} alt="Sônia" className="h-14 w-14 rounded-full object-cover border-3 border-white shadow" />
              <div>
                <div className="font-bold text-sm" style={{ color: "#1a2744" }}>Sônia está chamando…</div>
                <div className="text-xs" style={{ color: "#6B7280" }}>Chamada {callIdx + 1} de 24</div>
              </div>
            </div>

            <p className="text-base font-medium leading-relaxed mb-3" style={{ color: "#1a2744", minHeight: 60 }}>
              "{currentEntry.definition}"
            </p>

            <div className="flex items-center gap-2">
              <SpeakerButton text={currentEntry.definition} className="h-10 w-10 border-2 shrink-0" />
              <Button
                onClick={nextCall}
                disabled={callIdx + 1 >= 24 || gameOver}
                className="flex-1 h-10 font-bold rounded-full gap-1"
                style={{ background: "#1a2744", color: "#fff" }}
              >
                Próxima <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Histórico de chamadas */}
          <div className="rounded-2xl p-4 flex flex-col gap-2" style={{ background: "#F9FAFB", border: "1.5px solid #E5E7EB" }}>
            <div className="text-xs font-bold mb-1 uppercase tracking-wide" style={{ color: "#6B7280" }}>
              Termos já chamados ({callIdx + 1})
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
              {callOrder.slice(0, callIdx + 1).map((tIdx, i) => {
                const t = TERMS[tIdx as number];
                const gridPos = termToPos.get(t.term);
                const isMarkedOnGrid = gridPos !== undefined && marked.has(gridPos);
                return (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      background: isMarkedOnGrid ? "#F59E0B" : "#E5E7EB",
                      color: isMarkedOnGrid ? "#fff" : "#374151",
                    }}
                  >
                    {isMarkedOnGrid && <Star className="h-2.5 w-2.5 inline mb-0.5 mr-0.5" />}
                    {t.term}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Bingos conquistados */}
          {celebratedLines.size > 0 && (
            <div className="rounded-2xl p-4" style={{ background: "#FFFBEB", border: "2px solid #F59E0B" }}>
              <div className="font-bold text-sm mb-1" style={{ color: "#92400E" }}>
                🏆 Bingos: {celebratedLines.size}
              </div>
              <div className="text-xs" style={{ color: "#B45309" }}>
                +{celebratedLines.size * 100} XP conquistados!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
