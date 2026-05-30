import { useState } from "react";
import { SpeakerButton } from "@/components/speaker-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { addQuizScore, addMedal, getQuizMedals } from "@/lib/progress";
import mascoteImg from "@/assets/mascote.png";

type QuizItem = { id: number; text: string; isFake: boolean; explanation: string };

const QUIZ_ITEMS: QuizItem[] = [
  { id:1, text: '"URGENTE: Governo vai cancelar aposentadoria de todos os acima de 65 anos ainda este mês! Compartilhe antes que apaguem!"', isFake: true, explanation: 'Fake! Mudanças na previdência passam pelo Congresso e levam meses. Desconfie de urgências e exclamações.' },
  { id:2, text: '"O TSE (Tribunal Superior Eleitoral) confirmou que as eleições municipais acontecerão no primeiro domingo de outubro."', isFake: false, explanation: 'Verdade! As eleições municipais são sempre no primeiro domingo de outubro, conforme a lei eleitoral brasileira.' },
  { id:3, text: '"Médico famoso descobriu chá que cura qualquer doença em 3 dias. Hospitais estão escondendo do povo!"', isFake: true, explanation: 'Fake! Curas milagrosas e conspirações médicas são sinais clássicos de desinformação. Consulte sempre um profissional de saúde.' },
  { id:4, text: '"O Bolsa Família é um programa federal de transferência de renda criado para apoiar famílias em situação de pobreza."', isFake: false, explanation: 'Verdade! O Bolsa Família existe desde 2003 e é comprovado por dados do governo federal.' },
  { id:5, text: '"Cientistas provaram que vacinas causam autismo — pesquisa foi censurada pela mídia!"', isFake: true, explanation: 'Fake! Esse estudo foi desmentido e o autor perdeu o registro médico por fraude. Vacinas são seguras e aprovadas por órgãos de saúde.' },
];

export default function Quiz() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<{isCorrect: boolean, explanation: string} | null>(null);
  const [finished, setFinished] = useState(false);
  const [earnedMedals, setEarnedMedals] = useState<string[]>([]);

  const handleStart = () => setStarted(true);

  const handleAnswer = (isFake: boolean) => {
    const current = QUIZ_ITEMS[currentIndex];
    const isCorrect = isFake === current.isFake;

    if (isCorrect) {
      setScore(s => s + 10);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }

    setFeedback({ isCorrect, explanation: current.explanation });

    const newMedals: string[] = [];
    if (currentIndex === 0) newMedals.push("Iniciante Curioso");
    if (isCorrect && streak + 1 === 5) newMedals.push("Caçador de Fake News");

    newMedals.forEach(m => {
      if (!getQuizMedals().includes(m)) {
        addMedal(m);
        setEarnedMedals(prev => [...prev, m]);
      }
    });
  };

  const nextQuestion = () => {
    setFeedback(null);
    if (currentIndex + 1 < QUIZ_ITEMS.length) {
      setCurrentIndex(c => c + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    addQuizScore(score);
    const newMedals: string[] = ["Verificador de Fontes"];
    if (score === QUIZ_ITEMS.length * 10) newMedals.push("Guardião da Informação");

    newMedals.forEach(m => {
      if (!getQuizMedals().includes(m)) {
        addMedal(m);
        setEarnedMedals(prev => [...prev, m]);
      }
    });

    setFinished(true);
  };

  const restartQuiz = () => {
    setStarted(false);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setFinished(false);
    setEarnedMedals([]);
  };

  if (!started) {
    const introText = "Fake ou Fato? Leia a mensagem e diga se é uma notícia falsa ou informação verdadeira. Vamos testar seus conhecimentos!";
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 max-w-md mx-auto">
        <div className="text-6xl bg-primary/10 p-6 rounded-full">🧠</div>
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold text-foreground">Fake ou Fato?</h1>
          <SpeakerButton text={introText} />
        </div>
        <p className="text-xl max-w-[250px] mx-auto text-muted-foreground">
          Leia a mensagem e diga se é uma notícia falsa ou informação verdadeira. Vamos testar seus conhecimentos!
        </p>
        <Button onClick={handleStart} className="w-full text-2xl h-16 rounded-xl shadow-lg mt-4" data-testid="button-start-quiz">
          Começar Quiz
        </Button>
      </div>
    );
  }

  if (finished) {
    const resultsText = `Quiz Concluído! Sua pontuação foi ${score} de ${QUIZ_ITEMS.length * 10} pontos.${earnedMedals.length > 0 ? ` Você desbloqueou as medalhas: ${earnedMedals.join(", ")}.` : ""}`;
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center space-y-6 max-w-md mx-auto">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-7xl">🏆</motion.div>
        <div className="flex items-center gap-3">
          <h2 className="text-4xl font-bold text-foreground">Quiz Concluído!</h2>
          <SpeakerButton text={resultsText} />
        </div>
        <p className="text-2xl text-muted-foreground">Sua pontuação: <span className="font-bold text-primary">{score}</span> / {QUIZ_ITEMS.length * 10}</p>

        {earnedMedals.length > 0 && (
          <div className="w-full bg-accent/20 p-6 rounded-2xl border border-accent">
            <h3 className="font-bold text-xl mb-4 text-foreground">Novas Medalhas Desbloqueadas:</h3>
            <div className="flex flex-col gap-3">
              {earnedMedals.map(m => (
                <div key={m} className="bg-card p-3 rounded-lg flex items-center justify-center gap-3 shadow-sm">
                  <span className="text-xl font-bold text-foreground">{m}</span>
                  <SpeakerButton text={`Medalha desbloqueada: ${m}`} className="h-9 w-9" />
                </div>
              ))}
            </div>
          </div>
        )}

        <Button onClick={restartQuiz} className="w-full text-2xl h-16 mt-8" variant="outline" data-testid="button-restart-quiz">
          Jogar Novamente
        </Button>
      </div>
    );
  }

  const current = QUIZ_ITEMS[currentIndex];

  return (
    <div className="max-w-xl mx-auto py-4 flex flex-col min-h-[70vh]">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-lg text-muted-foreground">Questão {currentIndex + 1} de {QUIZ_ITEMS.length}</span>
          <span className="font-bold text-lg text-primary">Pontos: {score}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div className="bg-primary h-3 rounded-full transition-all duration-300" style={{ width: `${((currentIndex) / QUIZ_ITEMS.length) * 100}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!feedback ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <Card className="mb-8 border-2 border-primary/10 bg-white">
              <CardContent className="p-6 md:p-8 flex flex-col items-center text-center relative pt-12">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white border-2 border-primary/20 p-2 rounded-full shadow-sm">
                  <SpeakerButton text={current.text} className="h-10 w-10 border-0" />
                </div>
                <p className="text-2xl font-medium leading-relaxed italic text-foreground">
                  {current.text}
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
              <Button
                onClick={() => handleAnswer(true)}
                variant="destructive"
                className="h-20 text-2xl shadow-md font-bold w-full"
                data-testid="button-answer-fake"
              >
                📰 Fake News
              </Button>
              <Button
                onClick={() => handleAnswer(false)}
                className="h-20 text-2xl shadow-md font-bold bg-green-600 hover:bg-green-700 w-full"
                data-testid="button-answer-fact"
              >
                ✅ Verdade
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col"
          >
            <div className={`p-6 rounded-2xl mb-6 shadow-lg border-2 ${feedback.isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
              <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                <img src={mascoteImg} alt="Sônia" className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-sm shrink-0" />
                <div className="text-center md:text-left flex-1">
                  <div className="text-4xl mb-2">{feedback.isCorrect ? '👏' : '❌'}</div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold">{feedback.isCorrect ? 'Você Acertou!' : 'Você Errou...'}</h2>
                    <SpeakerButton
                      text={`${feedback.isCorrect ? 'Você Acertou!' : 'Você Errou.'} ${feedback.isCorrect ? 'Muito bem! Você está aprendendo rápido.' : 'Excelente tentativa! Vamos descobrir juntos...'}`}
                      className="h-10 w-10 shrink-0"
                    />
                  </div>
                  <p className="text-lg font-medium opacity-80 mt-1">
                    {feedback.isCorrect ? 'Muito bem! Você está aprendendo rápido.' : 'Excelente tentativa! Vamos descobrir juntos...'}
                  </p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl text-left relative shadow-sm border border-black/5">
                <p className="text-xl leading-relaxed pr-12 text-foreground font-medium">{feedback.explanation}</p>
                <div className="absolute top-4 right-4">
                  <SpeakerButton text={feedback.explanation} />
                </div>
              </div>
            </div>

            <Button onClick={nextQuestion} className="w-full h-16 text-2xl mt-auto shadow-md" data-testid="button-next-question">
              Continuar
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
