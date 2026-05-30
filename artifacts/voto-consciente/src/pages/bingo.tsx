import { useState, useCallback, useEffect } from "react";
import { SpeakerButton } from "@/components/speaker-button";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { addXP, completeMission } from "@/lib/progress";
import mascoteImg from "@/assets/mascote.png";

// ── Civic terms + their definitions (Sônia "calls" the definition) ──
const TERMS: { term: string; definition: string }[] = [
  { term: "Poder Executivo", definition: "Governa o país, estado ou município. Presidente, governadores e prefeitos fazem parte deste poder." },
  { term: "Poder Legislativo", definition: "Cria as leis. Inclui o Congresso Nacional, Assembleias estaduais e Câmaras municipais." },
  { term: "Poder Judiciário", definition: "Interpreta e aplica as leis, garantindo que todos sejam tratados com justiça, inclusive o governo." },
  { term: "TCU", definition: "Órgão que fiscaliza como o dinheiro público é gasto pelo governo federal." },
  { term: "Ministério Público", definition: "Defende os direitos da sociedade e pode processar políticos por corrupção." },
  { term: "Urna Eletrônica", definition: "Usada nas eleições brasileiras desde 1996. Segura e conta os votos automaticamente." },
  { term: "Segundo Turno", definition: "Ocorre quando nenhum candidato a prefeito ou presidente ultrapassa 50% dos votos válidos." },
  { term: "Fake News", definition: "Notícias falsas espalhadas pela internet, geralmente em mensagens que pedem para compartilhar com urgência." },
  { term: "Vereador", definition: "Representante eleito para a Câmara Municipal. Eleito por votos, sem segundo turno." },
  { term: "Deputado Federal", definition: "Representante eleito para a Câmara dos Deputados, em Brasília, eleito por votos proporcionais." },
  { term: "Senador", definition: "Representa o estado no Senado Federal. São eleitos 3 senadores por estado, com mandato de 8 anos." },
  { term: "Constituição", definition: "A lei mais importante do Brasil. Define os direitos dos cidadãos e as regras do governo." },
  { term: "Título de Eleitor", definition: "Documento obrigatório para votar. Todo brasileiro deve ter a partir dos 18 anos." },
  { term: "Voto Facultativo", definition: "O jovem de 16 ou 17 anos pode votar se quiser, assim como quem tem mais de 70 anos." },
  { term: "Voto Obrigatório", definition: "Todo brasileiro entre 18 e 70 anos é obrigado a votar nas eleições." },
  { term: "Zona Eleitoral", definition: "Local onde o eleitor é cadastrado para votar, geralmente próximo à sua residência." },
  { term: "Candidato", definition: "Pessoa que se apresenta para disputar um cargo público em uma eleição." },
  { term: "Partido Político", definition: "Organização de pessoas com ideias parecidas que se unem para disputar eleições e governar." },
  { term: "Coligação", definition: "União de dois ou mais partidos políticos para disputar uma eleição juntos." },
  { term: "Aos Fatos", definition: "Agência de jornalismo especializada em checar e desmentir notícias falsas no Brasil." },
  { term: "STF", definition: "Supremo Tribunal Federal — a mais alta corte do Judiciário brasileiro, guarda a Constituição." },
  { term: "Câmara dos Deputados", definition: "Parte do Congresso Nacional que representa o povo. Tem 513 deputados federais." },
  { term: "Senado Federal", definition: "Parte do Congresso Nacional que representa os estados. Tem 81 senadores." },
  { term: "Transparência", definition: "Direito do cidadão de acessar informações sobre como o governo usa o dinheiro público." },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Bingo grid: 5×5 = 25 cells; index 12 is FREE (center)
function buildGrid(terms: typeof TERMS) {
  const shuffled = shuffle(terms).slice(0, 24);
  const grid: Array<{ term: string; definition: string } | null> = [];
  for (let i = 0; i < 25; i++) {
    if (i === 12) grid.push(null); // FREE
    else grid.push(shuffled[i < 12 ? i : i - 1]);
  }
  return grid;
}

// All winning lines (rows + cols + diagonals)
const LINES = [
  [0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24], // rows
  [0,5,10,15,20],[1,6,11,16,21],[2,7,12,17,22],[3,8,13,18,23],[4,9,14,19,24], // cols
  [0,6,12,18,24],[4,8,12,16,20], // diagonals
];

function checkBingo(marked: Set<number>): number[][] {
  return LINES.filter(line => line.every(i => marked.has(i)));
}

export default function Bingo() {
  const [grid, setGrid] = useState(() => buildGrid(TERMS));
  const [callOrder, setCallOrder] = useState(() => shuffle(TERMS));
  const [callIndex, setCallIndex] = useState(0);
  const [marked, setMarked] = useState<Set<number>>(() => new Set([12])); // FREE center
  const [bingoLines, setBingoLines] = useState<number[][]>([]);
  const [xpAwarded, setXpAwarded] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [wrongCell, setWrongCell] = useState<number | null>(null);
  const [showBingoAlert, setShowBingoAlert] = useState(false);
  const [prevBingoCount, setPrevBingoCount] = useState(0);

  const currentCall = callOrder[callIndex] ?? null;

  const handleCellClick = useCallback((idx: number) => {
    if (idx === 12) return; // FREE — already marked
    const cell = grid[idx];
    if (!cell || !currentCall) return;
    if (marked.has(idx)) return;

    if (cell.term === currentCall.term) {
      const newMarked = new Set(marked);
      newMarked.add(idx);
      const lines = checkBingo(newMarked);

      // Award XP for new bingo lines
      const newLinesCount = lines.length - prevBingoCount;
      if (newLinesCount > 0) {
        const xp = newLinesCount * 100;
        addXP(xp);
        setXpAwarded(prev => prev + xp);
        setShowBingoAlert(true);
        setPrevBingoCount(lines.length);
        setTimeout(() => setShowBingoAlert(false), 2500);
      }

      setBingoLines(lines);
      setMarked(newMarked);

      // Check if full board complete
      if (newMarked.size === 25) {
        completeMission(99); // special bingo mission id
        addXP(200);
        setXpAwarded(prev => prev + 200);
        setTimeout(() => setShowComplete(true), 600);
      }

      // Advance call
      if (callIndex + 1 < callOrder.length) {
        setCallIndex(c => c + 1);
      }
    } else {
      // Wrong cell flash
      setWrongCell(idx);
      setTimeout(() => setWrongCell(null), 600);
    }
  }, [grid, marked, currentCall, callIndex, callOrder, prevBingoCount]);

  const newGame = useCallback(() => {
    setGrid(buildGrid(TERMS));
    setCallOrder(shuffle(TERMS));
    setCallIndex(0);
    setMarked(new Set([12]));
    setBingoLines([]);
    setPrevBingoCount(0);
    setShowComplete(false);
    setXpAwarded(0);
    setShowBingoAlert(false);
  }, []);

  const isBingoCell = (idx: number) => bingoLines.some(line => line.includes(idx));

  if (showComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-6 px-4"
      >
        <div className="bg-yellow-50 border-4 border-yellow-400 p-8 rounded-3xl shadow-2xl max-w-md w-full">
          <div className="text-7xl mb-4">🎓</div>
          <h1 className="text-3xl font-extrabold text-yellow-800 mb-2">CARTELA COMPLETA!</h1>
          <h2 className="text-xl font-bold text-yellow-900 mb-4">Cidadão Democrata</h2>
          <p className="text-lg text-yellow-700 mb-4">
            Você acertou todos os 24 termos cívicos! Incrível!
          </p>
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-bold text-lg">
            🏆 +{xpAwarded + 200} XP ganhos!
          </div>
        </div>
        <Button
          onClick={newGame}
          className="h-14 px-10 text-xl rounded-full font-bold shadow-lg"
          style={{ background: "#1a2744", color: "#fff" }}
        >
          Jogar Novamente 🎲
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="pb-8 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-5"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-3"
          style={{ background: "#FEF3C7", color: "#92400E" }}>
          🎱 Bingo Cívico
        </div>
        <h1 className="text-2xl font-extrabold" style={{ color: "#1a2744" }}>
          Academia da Democracia
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Sônia chama a definição — toque o termo correto na cartela!
        </p>
      </motion.div>

      {/* Sônia call panel */}
      <motion.div
        key={callIndex}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-4 mb-4 shadow-sm border-2 flex items-start gap-4"
        style={{ background: "linear-gradient(135deg,#FEF9EC,#FDE8CC)", borderColor: "#F59E0B" }}
      >
        <img src={mascoteImg} alt="Sônia" className="h-14 w-14 rounded-full object-cover border-4 border-white shadow-md shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold mb-1" style={{ color: "#92400E" }}>
            Definição {callIndex + 1} de {callOrder.length}
          </p>
          {currentCall ? (
            <p className="text-base font-semibold leading-snug" style={{ color: "#1a2744" }}>
              {currentCall.definition}
            </p>
          ) : (
            <p className="text-base font-semibold" style={{ color: "#6B7280" }}>Todas as definições foram chamadas!</p>
          )}
        </div>
        {currentCall && (
          <SpeakerButton text={currentCall.definition} className="shrink-0 h-10 w-10 border-0" />
        )}
      </motion.div>

      {/* XP + Bingo count bar */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-sm font-bold" style={{ color: "#6B7280" }}>
          ✅ {marked.size - 1}/24 marcados
        </span>
        {bingoLines.length > 0 && (
          <span className="text-sm font-bold px-3 py-1 rounded-full"
            style={{ background: "#FEF3C7", color: "#92400E" }}>
            🎉 {bingoLines.length} BINGO{bingoLines.length > 1 ? "S" : ""}! +{xpAwarded} XP
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={newGame}
          className="text-xs font-semibold rounded-full px-3"
          style={{ borderColor: "#1a2744", color: "#1a2744" }}
        >
          🎲 Nova Cartela
        </Button>
      </div>

      {/* BINGO alert */}
      <AnimatePresence>
        {showBingoAlert && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: -20 }}
            className="text-center py-3 mb-3 rounded-2xl font-extrabold text-2xl shadow-lg"
            style={{ background: "linear-gradient(135deg,#F59E0B,#FBBF24)", color: "#fff" }}
          >
            🎉 BINGO! +100 XP
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5×5 Bingo Grid */}
      <div className="grid grid-cols-5 gap-1.5">
        {grid.map((cell, idx) => {
          const isMarked = marked.has(idx);
          const isFree = idx === 12;
          const isBingo = isBingoCell(idx);
          const isWrong = wrongCell === idx;

          return (
            <motion.button
              key={idx}
              onClick={() => handleCellClick(idx)}
              whileTap={!isMarked && !isFree ? { scale: 0.93 } : {}}
              animate={isWrong ? { x: [-6, 6, -4, 4, 0] } : {}}
              transition={isWrong ? { duration: 0.35 } : { type: "spring", stiffness: 300 }}
              className="relative aspect-square rounded-xl flex items-center justify-center text-center p-1 text-xs font-bold leading-tight transition-colors focus:outline-none select-none"
              style={{
                background: isFree
                  ? "#1a2744"
                  : isBingo
                  ? "#F59E0B"
                  : isMarked
                  ? "#10B981"
                  : isWrong
                  ? "#FEE2E2"
                  : "#fff",
                color: isFree
                  ? "#fff"
                  : isBingo || isMarked
                  ? "#fff"
                  : isWrong
                  ? "#DC2626"
                  : "#1a2744",
                border: `2px solid ${isFree ? "#1a2744" : isBingo ? "#D97706" : isMarked ? "#059669" : "#E5E7EB"}`,
                cursor: isMarked || isFree ? "default" : "pointer",
                boxShadow: isBingo ? "0 0 0 3px #FDE68A" : undefined,
                fontSize: "clamp(8px, 1.8vw, 11px)",
              }}
            >
              {isFree ? (
                <div className="flex flex-col items-center gap-0.5">
                  <img src={mascoteImg} alt="FREE" className="h-7 w-7 rounded-full object-cover border-2 border-white" />
                  <span className="text-white font-extrabold" style={{ fontSize: 9 }}>FREE</span>
                </div>
              ) : isMarked ? (
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-lg leading-none">✓</span>
                  <span className="leading-tight">{cell?.term}</span>
                </div>
              ) : (
                <span className="leading-tight px-0.5">{cell?.term}</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 justify-center text-xs font-medium" style={{ color: "#6B7280" }}>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-white border border-gray-300" />Não marcado</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-green-500" />Acertado</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-amber-400" />Linha BINGO</span>
      </div>
    </div>
  );
}
