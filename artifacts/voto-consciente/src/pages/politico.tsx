import { useRef } from "react";
import { useParams, Link } from "wouter";
import { useGetPolitico, getGetPoliticoQueryKey } from "@workspace/api-client-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { addXP } from "@/lib/progress";

const STATUS_COLORS: Record<string, string> = {
  Aprovado: "bg-green-100 text-green-800 border-green-300",
  "Em tramitação": "bg-orange-100 text-orange-800 border-orange-300",
  Arquivado: "bg-gray-100 text-gray-600 border-gray-300",
};

const ESFERA_LABELS: Record<string, string> = {
  federal: "Federal",
  estadual: "Estadual",
  municipal: "Municipal",
};

export default function Politico() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id ?? "0");
  const xpGranted = useRef(false);

  const validId = !isNaN(id) && id > 0;
  const { data: politico, isLoading, isError } = useGetPolitico(id, {
    query: { queryKey: getGetPoliticoQueryKey(id), enabled: validId },
  });

  const handleRealizacoesTabClick = () => {
    if (!xpGranted.current && politico) {
      addXP(30);
      xpGranted.current = true;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !politico) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-2xl text-muted-foreground">Político não encontrado.</p>
        <Link href="/match">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-5 w-5" /> Voltar
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <Link href="/match">
        <Button variant="ghost" className="mb-2 text-lg">
          <ArrowLeft className="mr-2 h-5 w-5" /> Voltar ao Match
        </Button>
      </Link>

      <Card className="overflow-hidden shadow-md border border-border">
        <CardContent className="p-0">
          <div className="bg-primary/10 p-6 flex items-center gap-6">
            <div className="text-7xl bg-white p-3 rounded-2xl shadow-sm border border-border select-none">
              {politico.foto ?? "👤"}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-foreground leading-tight">{politico.nome}</h1>
              <p className="text-lg font-semibold text-muted-foreground">{politico.nomeUrna}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline" className="text-base px-3 py-1 font-bold">{politico.partido}</Badge>
                <Badge variant="secondary" className="text-base px-3 py-1">{politico.cargo}</Badge>
                <Badge variant="outline" className="text-base px-3 py-1">{ESFERA_LABELS[politico.esfera] ?? politico.esfera}</Badge>
                <Badge variant="outline" className="text-base px-3 py-1 text-muted-foreground">{politico.localidade}</Badge>
              </div>
              {politico.urlCamara && (
                <a
                  href={politico.urlCamara}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-primary text-base hover:underline font-medium"
                >
                  Ver perfil oficial <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="promessas" className="w-full">
        <TabsList className="w-full grid grid-cols-2 h-14 text-lg">
          <TabsTrigger value="promessas" className="text-lg font-semibold">
            📋 Plano / Promessas
          </TabsTrigger>
          <TabsTrigger
            value="realizacoes"
            className="text-lg font-semibold"
            onClick={handleRealizacoesTabClick}
          >
            ✅ Projetos / Realizações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="promessas" className="mt-4 space-y-3">
          {politico.promessas.length === 0 ? (
            <p className="text-muted-foreground text-lg text-center py-8">Nenhuma promessa registrada.</p>
          ) : (
            politico.promessas.map((p) => (
              <Card key={p.id} className="border border-border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Badge className="shrink-0 mt-0.5 bg-primary/10 text-primary border-primary/20 font-semibold text-sm px-3">
                      {p.categoria}
                    </Badge>
                    <div>
                      <p className="text-lg text-foreground leading-relaxed">{p.descricao}</p>
                      {p.fonte && (
                        <p className="text-sm text-muted-foreground mt-1">Fonte: {p.fonte}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="realizacoes" className="mt-4 space-y-3">
          {politico.realizacoes.length === 0 ? (
            <p className="text-muted-foreground text-lg text-center py-8">Nenhuma realização registrada.</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground text-center pb-1">
                🎉 +30 XP ganhos por explorar as realizações!
              </p>
              {politico.realizacoes.map((r) => (
                <Card key={r.id} className="border border-border shadow-sm">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold text-foreground leading-snug flex-1">{r.titulo}</h3>
                      <span
                        className={`shrink-0 text-sm font-semibold px-3 py-1 rounded-full border ${STATUS_COLORS[r.status] ?? "bg-gray-100 text-gray-600 border-gray-300"}`}
                      >
                        {r.status}
                      </span>
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed">{r.descricao}</p>
                    <div className="flex items-center justify-between">
                      {r.ano && <span className="text-sm text-muted-foreground">Ano: {r.ano}</span>}
                      {r.urlOficial && (
                        <a
                          href={r.urlOficial}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary text-sm hover:underline font-medium"
                        >
                          Ver projeto oficial <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
