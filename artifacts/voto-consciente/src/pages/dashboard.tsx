import { useEffect, useState } from "react";
import { getQuizScore, getQuizMedals, getAcademyXP, getMissionsCompleted, getUserLevel } from "@/lib/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Trophy, Star, Target } from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState({
    quizScore: 0,
    medals: [] as string[],
    xp: 0,
    missions: [] as number[],
    level: "Novato"
  });

  useEffect(() => {
    setData({
      quizScore: getQuizScore(),
      medals: getQuizMedals(),
      xp: getAcademyXP(),
      missions: getMissionsCompleted(),
      level: getUserLevel()
    });
  }, []);

  return (
    <div className="space-y-6 pb-8 max-w-3xl mx-auto">
      <div className="text-center pt-4 mb-8">
        <div className="text-6xl bg-primary/10 p-6 rounded-full inline-block mb-4 border border-border">👤</div>
        <h1 className="text-4xl font-extrabold mb-2 text-foreground">Meu Painel</h1>
        <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full font-bold text-xl border border-secondary/30">
          <Star className="h-6 w-6 text-secondary fill-secondary" />
          Nível: {data.level}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white border border-border shadow-sm">
          <CardContent className="p-5 flex flex-col items-center text-center">
            <Trophy className="h-10 w-10 text-secondary mb-2" />
            <span className="text-3xl font-extrabold text-foreground">{data.xp}</span>
            <span className="text-lg font-bold text-muted-foreground">XP Total</span>
          </CardContent>
        </Card>
        <Card className="bg-white border border-border shadow-sm">
          <CardContent className="p-5 flex flex-col items-center text-center">
            <Target className="h-10 w-10 text-primary mb-2" />
            <span className="text-3xl font-extrabold text-foreground">{data.missions.length}/5</span>
            <span className="text-lg font-bold text-muted-foreground">Missões</span>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border shadow-sm bg-white">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <CardTitle className="text-2xl font-bold flex items-center gap-2 text-foreground">
            <Brain className="h-6 w-6 text-primary" /> Desempenho no Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-medium text-foreground">Pontuação Total:</span>
            <span className="text-3xl font-extrabold text-primary">{data.quizScore} pts</span>
          </div>
          
          <h3 className="text-xl font-bold mb-4 text-muted-foreground">Medalhas Conquistadas</h3>
          {data.medals.length === 0 ? (
            <div className="bg-muted/50 p-6 rounded-xl text-center border border-border">
              <p className="text-lg text-muted-foreground font-medium">Nenhuma medalha ainda. Jogue o quiz para ganhar!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.medals.map(m => (
                <div key={m} className="bg-white border border-border p-4 rounded-xl flex items-center gap-3 shadow-sm">
                  <div className="text-3xl bg-secondary/10 p-2 rounded-full">🏅</div>
                  <span className="text-xl font-bold text-foreground">{m}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {data.missions.length >= 5 && (
        <Card className="bg-yellow-50 border-2 border-yellow-200 overflow-hidden shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="text-5xl mb-2">🎓</div>
            <h3 className="text-2xl font-bold text-yellow-800">Cidadão Democrata</h3>
            <p className="text-lg font-medium text-yellow-700">Certificado da Academia conquistado!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
