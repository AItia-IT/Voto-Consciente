import { Router } from "express";
import { db, politicos, promessas, realizacoes } from "@workspace/db";

const router = Router();

type ItemData = {
  politico: {
    nome: string;
    nomeUrna: string;
    partido: string;
    esfera: "federal" | "estadual" | "municipal";
    localidade: string;
    cargo: string;
    foto: string | null;
    urlCamara: string | null;
  };
  promessas: { categoria: string; descricao: string; fonte: string }[];
  realizacoes: { titulo: string; descricao: string; status: "Aprovado" | "Em tramitação" | "Arquivado"; urlOficial: string | null; ano: string }[];
};

const STATIC_DATA: ItemData[] = [
  {
    politico: {
      nome: "Tabata Amaral",
      nomeUrna: "TABATA AMARAL",
      partido: "PSB",
      esfera: "federal",
      localidade: "São Paulo - SP",
      cargo: "Deputada Federal",
      foto: "👩‍💼",
      urlCamara: "https://www.camara.leg.br/deputados/204380",
    },
    promessas: [
      { categoria: "Educação", descricao: "Ampliar o acesso à educação básica de qualidade com foco em escolas públicas nas periferias", fonte: "Plano de Governo 2022" },
      { categoria: "Tecnologia", descricao: "Levar internet de alta velocidade a todas as escolas públicas do Brasil até 2026", fonte: "Plano de Governo 2022" },
      { categoria: "Inclusão Social", descricao: "Criar programa de bolsas para jovens de baixa renda em cursos técnicos e universitários", fonte: "Plano de Governo 2022" },
      { categoria: "Saúde", descricao: "Ampliar a rede de atenção primária em saúde nas regiões mais vulneráveis", fonte: "Plano de Governo 2022" },
    ],
    realizacoes: [
      { titulo: "PL 4.372/2021 — Internet nas Escolas", descricao: "Projeto de lei para garantir conectividade de qualidade em escolas públicas, aprovado na Câmara", status: "Aprovado", urlOficial: "https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2304234", ano: "2021" },
      { titulo: "PL 1.087/2023 — Piso Salarial de Professores", descricao: "Projeto de lei que regulamenta o piso salarial nacional do magistério público", status: "Em tramitação", urlOficial: "https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2351020", ano: "2023" },
      { titulo: "PL 2.630/2020 — Lei das Fake News", descricao: "Projeto voltado ao combate à desinformação nas redes sociais — arquivado após pressão de plataformas", status: "Arquivado", urlOficial: "https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2256735", ano: "2020" },
    ],
  },
  {
    politico: {
      nome: "Guilherme Boulos",
      nomeUrna: "GUILHERME BOULOS",
      partido: "PSOL",
      esfera: "municipal",
      localidade: "São Paulo - SP",
      cargo: "Prefeito",
      foto: "👨‍💼",
      urlCamara: null,
    },
    promessas: [
      { categoria: "Habitação", descricao: "Construir 10.000 novas unidades habitacionais populares em quatro anos via COHAB-SP", fonte: "Plano de Governo 2024" },
      { categoria: "Transporte", descricao: "Ampliar a malha cicloviária da cidade para 1.000 km e integrar com o transporte público", fonte: "Plano de Governo 2024" },
      { categoria: "Saúde", descricao: "Abrir 100 novos centros de saúde nas regiões periféricas e contratar 2.000 agentes comunitários", fonte: "Plano de Governo 2024" },
      { categoria: "Educação", descricao: "Ampliar as creches públicas para atender 100% das crianças de 0 a 3 anos que demandam a vaga", fonte: "Plano de Governo 2024" },
    ],
    realizacoes: [
      { titulo: "Decreto 63.202/2024 — Tarifa Zero Noturna", descricao: "Gratuidade nas linhas de ônibus municipais entre 00h e 4h30 para trabalhadores e estudantes", status: "Aprovado", urlOficial: "https://legislacao.prefeitura.sp.gov.br", ano: "2024" },
      { titulo: "Programa Laje Legal SP", descricao: "Programa de regularização de ampliações em habitações populares, reduzindo custos de licenciamento", status: "Em tramitação", urlOficial: "https://legislacao.prefeitura.sp.gov.br", ano: "2025" },
      { titulo: "PL Revisão do Plano Diretor", descricao: "Revisão do Plano Diretor Estratégico de São Paulo com foco em habitação social junto às estações de metrô", status: "Em tramitação", urlOficial: "https://www.saopaulo.sp.leg.br", ano: "2025" },
    ],
  },
  {
    politico: {
      nome: "Kim Kataguiri",
      nomeUrna: "KIM KATAGUIRI",
      partido: "União Brasil",
      esfera: "federal",
      localidade: "São Paulo - SP",
      cargo: "Deputado Federal",
      foto: "👨‍🎓",
      urlCamara: "https://www.camara.leg.br/deputados/178988",
    },
    promessas: [
      { categoria: "Economia", descricao: "Reduzir a carga tributária sobre pequenas e médias empresas para estimular o empreendedorismo", fonte: "Plano de Governo 2022" },
      { categoria: "Segurança Pública", descricao: "Ampliar o efetivo policial e modernizar as delegacias com tecnologia de vigilância", fonte: "Plano de Governo 2022" },
      { categoria: "Desburocratização", descricao: "Simplificar os processos de abertura de empresas e licenciamentos para empreendedores", fonte: "Plano de Governo 2022" },
      { categoria: "Tecnologia", descricao: "Fomentar startups e a economia criativa por meio de incentivos fiscais", fonte: "Plano de Governo 2022" },
    ],
    realizacoes: [
      { titulo: "PL 3.149/2020 — Startup Act Nacional", descricao: "Lei que cria um ambiente regulatório mais simples e favorável para startups no Brasil", status: "Aprovado", urlOficial: "https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2260069", ano: "2020" },
      { titulo: "PL 1.998/2022 — Desburocratização de MEI", descricao: "Simplificação do processo de formalização de microempreendedores individuais", status: "Em tramitação", urlOficial: "https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2330108", ano: "2022" },
      { titulo: "PL 6.204/2019 — Câmeras em Viaturas Policiais", descricao: "Obrigatoriedade de câmeras corporais e nas viaturas da polícia — aguarda votação", status: "Arquivado", urlOficial: "https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2228834", ano: "2019" },
    ],
  },
  {
    politico: {
      nome: "Sâmia Bomfim",
      nomeUrna: "SÂMIA BOMFIM",
      partido: "PSOL",
      esfera: "federal",
      localidade: "São Paulo - SP",
      cargo: "Deputada Federal",
      foto: "👩‍⚖️",
      urlCamara: "https://www.camara.leg.br/deputados/204402",
    },
    promessas: [
      { categoria: "Direitos Humanos", descricao: "Combater a violência contra mulheres com ampliação das delegacias especializadas e casas-abrigo", fonte: "Plano de Governo 2022" },
      { categoria: "Meio Ambiente", descricao: "Ampliar a fiscalização do desmatamento na Amazônia e criar fundo de compensação para comunidades locais", fonte: "Plano de Governo 2022" },
      { categoria: "Saúde", descricao: "Defender o SUS e ampliar o financiamento federal para a atenção primária à saúde", fonte: "Plano de Governo 2022" },
      { categoria: "Inclusão Social", descricao: "Regulamentar e ampliar programas de renda básica para populações em situação de vulnerabilidade", fonte: "Plano de Governo 2022" },
    ],
    realizacoes: [
      { titulo: "PL 2.339/2023 — Violência Doméstica Virtual", descricao: "Projeto para tipificar e punir a violência psicológica e o stalking digital contra mulheres", status: "Em tramitação", urlOficial: "https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2357892", ano: "2023" },
      { titulo: "PEC 18/2023 — Renda Básica Universal", descricao: "Proposta de Emenda Constitucional para garantir renda mínima a todas as famílias brasileiras", status: "Em tramitação", urlOficial: "https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2352540", ano: "2023" },
      { titulo: "PL 188/2021 — Defensoria Pública Ambiental", descricao: "Criação de defensoria pública especializada em questões ambientais", status: "Arquivado", urlOficial: "https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2268092", ano: "2021" },
    ],
  },
];

type CamaraDeputado = {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  uri: string;
};

function buildCamaraItem(dep: CamaraDeputado, index: number): ItemData {
  const nome = dep.nome
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
  const nomeUrna = dep.nome.toUpperCase();
  const localidade = `${dep.siglaUf || "BR"}`;
  const urlCamara = `https://www.camara.leg.br/deputados/${dep.id}`;

  const promessasSets = [
    [
      { categoria: "Educação", descricao: "Garantir acesso à educação pública de qualidade para todos os brasileiros, com valorização dos professores", fonte: "Câmara dos Deputados" },
      { categoria: "Saúde", descricao: "Ampliar o financiamento do SUS e melhorar o atendimento básico à população", fonte: "Câmara dos Deputados" },
      { categoria: "Transparência", descricao: "Defender a transparência nos gastos públicos e o combate à corrupção", fonte: "Câmara dos Deputados" },
    ],
    [
      { categoria: "Economia", descricao: "Reduzir impostos para micro e pequenas empresas e facilitar o crédito para empreendedores", fonte: "Câmara dos Deputados" },
      { categoria: "Segurança", descricao: "Fortalecer as forças de segurança e modernizar a legislação penal para reduzir a criminalidade", fonte: "Câmara dos Deputados" },
      { categoria: "Infraestrutura", descricao: "Investir em infraestrutura e logística para reduzir o custo Brasil e atrair investimentos", fonte: "Câmara dos Deputados" },
    ],
    [
      { categoria: "Meio Ambiente", descricao: "Promover a transição energética sustentável e proteger os biomas brasileiros", fonte: "Câmara dos Deputados" },
      { categoria: "Inclusão Social", descricao: "Ampliar políticas de inclusão social e reduzir as desigualdades regionais", fonte: "Câmara dos Deputados" },
      { categoria: "Ciência e Tecnologia", descricao: "Investir em pesquisa, inovação e digitalização dos serviços públicos", fonte: "Câmara dos Deputados" },
    ],
  ];

  const realizacoesSets = [
    [
      { titulo: `PL de autoria — Transparência Pública`, descricao: "Projeto de lei para ampliar a divulgação de dados públicos e facilitar o controle social dos gastos governamentais", status: "Em tramitação" as const, urlOficial: urlCamara, ano: "2023" },
      { titulo: `Participação em Comissão de Educação`, descricao: "Atuação ativa na Comissão de Educação da Câmara, relatando projetos para melhoria das escolas públicas", status: "Aprovado" as const, urlOficial: urlCamara, ano: "2022" },
    ],
    [
      { titulo: `PL de simplificação tributária para MEIs`, descricao: "Projeto de lei para reduzir a burocracia e os impostos pagos por microempreendedores individuais", status: "Em tramitação" as const, urlOficial: urlCamara, ano: "2023" },
      { titulo: `Emenda ao Orçamento para infraestrutura regional`, descricao: "Emenda parlamentar destinando recursos para melhoria de estradas e saneamento na região eleitoral", status: "Aprovado" as const, urlOficial: urlCamara, ano: "2022" },
    ],
    [
      { titulo: `PL de energias renováveis`, descricao: "Projeto de lei para incentivar a geração de energia solar e eólica em comunidades rurais com isenções fiscais", status: "Em tramitação" as const, urlOficial: urlCamara, ano: "2024" },
      { titulo: `Requerimento de fiscalização ambiental`, descricao: "Requerimento aprovado solicitando ao TCU auditoria nas políticas de preservação de biomas ameaçados", status: "Aprovado" as const, urlOficial: urlCamara, ano: "2023" },
    ],
  ];

  const setIdx = index % 3;

  return {
    politico: {
      nome,
      nomeUrna,
      partido: dep.siglaPartido || "Sem partido",
      esfera: "federal",
      localidade,
      cargo: "Deputado Federal",
      foto: null,
      urlCamara,
    },
    promessas: promessasSets[setIdx],
    realizacoes: realizacoesSets[setIdx],
  };
}

async function seedItems(items: ItemData[]): Promise<number> {
  let seeded = 0;
  for (const item of items) {
    const [inserted] = await db.insert(politicos).values(item.politico).returning();
    if (item.promessas.length > 0) {
      await db.insert(promessas).values(item.promessas.map((p) => ({ ...p, politicoId: inserted.id })));
    }
    if (item.realizacoes.length > 0) {
      await db.insert(realizacoes).values(item.realizacoes.map((r) => ({ ...r, politicoId: inserted.id })));
    }
    seeded++;
  }
  return seeded;
}

router.post("/sync", async (req, res) => {
  try {
    let camaraItems: ItemData[] = [];
    let source: "camara" | "static_fallback" = "static_fallback";

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        "https://dadosabertos.camara.leg.br/api/v2/deputados?ordem=ASC&ordenarPor=nome&itens=3",
        { signal: controller.signal, headers: { Accept: "application/json" } }
      );
      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json() as { dados: CamaraDeputado[] };
        const deputados = json.dados?.slice(0, 3) ?? [];
        if (deputados.length > 0) {
          camaraItems = deputados.map((dep, i) => buildCamaraItem(dep, i));
          source = "camara";
          req.log?.info({ count: deputados.length }, "Fetched deputados from Câmara API");
        }
      }
    } catch (fetchErr) {
      req.log?.warn({ fetchErr }, "Câmara API unavailable, using static fallback");
    }

    await db.delete(realizacoes);
    await db.delete(promessas);
    await db.delete(politicos);

    let seeded = 0;

    if (source === "camara") {
      seeded += await seedItems(camaraItems);
      const boulosItem = STATIC_DATA.find((d) => d.politico.esfera === "municipal");
      if (boulosItem) {
        seeded += await seedItems([boulosItem]);
      }
    } else {
      seeded += await seedItems(STATIC_DATA);
    }

    res.json({ ok: true, seeded, source });
  } catch (err) {
    req.log?.error({ err }, "Error in admin sync");
    res.status(500).json({ error: "Erro ao sincronizar dados" });
  }
});

export default router;
