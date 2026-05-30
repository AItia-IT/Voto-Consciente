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
    <div className="space-y-6 pb-8">
      <div className="text-center pt-4 mb-8">
        <div className="text-6xl bg-yellow-100 p-6 rounded-full inline-block mb-4 border-4 border-yellow-300">👤</div>
        <h1 className="text-4xl font-extrabold mb-1">Seu Perfil</h1>
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-xl">
          <Star className="h-6 w-6 fill-primary" />
          Nível: {data.level}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-card border-2">
          <CardContent className="p-5 flex flex-col items-center text-center">
            <Trophy className="h-10 w-10 text-yellow-500 mb-2" />
            <span className="text-3xl font-extrabold text-foreground">{data.xp}</span>
            <span className="text-lg font-bold text-muted-foreground">XP Total</span>
          </CardContent>
        </Card>
        <Card className="bg-card border-2">
          <CardContent className="p-5 flex flex-col items-center text-center">
            <Target className="h-10 w-10 text-blue-500 mb-2" />
            <span className="text-3xl font-extrabold text-foreground">{data.missions.length}/5</span>
            <span className="text-lg font-bold text-muted-foreground">Missões</span>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2">
        <CardHeader className="pb-2 border-b">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" /> Desempenho no Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-medium">Pontuação Total:</span>
            <span className="text-3xl font-extrabold text-primary">{data.quizScore} pts</span>
          </div>
          
          <h3 className="text-xl font-bold mb-4 text-muted-foreground">Medalhas Conquistadas</h3>
          {data.medals.length === 0 ? (
            <div className="bg-muted p-6 rounded-xl text-center">
              <p className="text-lg text-muted-foreground">Nenhuma medalha ainda. Jogue o quiz para ganhar!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {data.medals.map(m => (
                <div key={m} className="bg-card border-2 p-4 rounded-xl flex items-center gap-3">
                  <div className="text-3xl bg-muted p-2 rounded-full">🏅</div>
                  <span className="text-xl font-bold">{m}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {data.missions.length >= 5 && (
        <Card className="bg-yellow-50 border-4 border-yellow-400 overflow-hidden">
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
