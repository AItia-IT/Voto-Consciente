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
  // ── 1. Tabata Amaral ──────────────────────────────────────────────────
  {
    politico: { nome: "Tabata Amaral", nomeUrna: "TABATA AMARAL", partido: "PSB", esfera: "federal", localidade: "São Paulo - SP", cargo: "Deputada Federal", foto: "👩‍💼", urlCamara: "https://www.camara.leg.br/deputados/204380" },
    promessas: [
      { categoria: "Educação", descricao: "Ampliar acesso à educação básica de qualidade com foco em escolas públicas nas periferias", fonte: "Plano de Governo 2022" },
      { categoria: "Tecnologia", descricao: "Levar internet de alta velocidade a todas as escolas públicas do Brasil até 2026", fonte: "Plano de Governo 2022" },
      { categoria: "Saúde", descricao: "Ampliar a rede de atenção primária nas regiões mais vulneráveis", fonte: "Plano de Governo 2022" },
    ],
    realizacoes: [
      { titulo: "PL 4.372/2021 — Internet nas Escolas", descricao: "Projeto de lei para garantir conectividade de qualidade em escolas públicas, aprovado na Câmara", status: "Aprovado", urlOficial: "https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2304234", ano: "2021" },
      { titulo: "PL 1.087/2023 — Piso Salarial de Professores", descricao: "Regulamenta o piso salarial nacional do magistério público", status: "Em tramitação", urlOficial: "https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2351020", ano: "2023" },
    ],
  },
  // ── 2. Guilherme Boulos ───────────────────────────────────────────────
  {
    politico: { nome: "Guilherme Boulos", nomeUrna: "GUILHERME BOULOS", partido: "PSOL", esfera: "municipal", localidade: "São Paulo - SP", cargo: "Prefeito", foto: "👨‍💼", urlCamara: null },
    promessas: [
      { categoria: "Habitação", descricao: "Construir 10.000 novas unidades habitacionais populares em quatro anos via COHAB-SP", fonte: "Plano de Governo 2024" },
      { categoria: "Transporte", descricao: "Ampliar a malha cicloviária para 1.000 km e integrar com o transporte público", fonte: "Plano de Governo 2024" },
      { categoria: "Saúde", descricao: "Abrir 100 novos centros de saúde nas regiões periféricas e contratar 2.000 agentes comunitários", fonte: "Plano de Governo 2024" },
    ],
    realizacoes: [
      { titulo: "Decreto 63.202/2024 — Tarifa Zero Noturna", descricao: "Gratuidade nas linhas de ônibus municipais entre 00h e 4h30 para trabalhadores e estudantes", status: "Aprovado", urlOficial: "https://legislacao.prefeitura.sp.gov.br", ano: "2024" },
      { titulo: "Programa Laje Legal SP", descricao: "Regularização de ampliações em habitações populares, reduzindo custos de licenciamento", status: "Em tramitação", urlOficial: "https://legislacao.prefeitura.sp.gov.br", ano: "2025" },
    ],
  },
  // ── 3. Kim Kataguiri ──────────────────────────────────────────────────
  {
    politico: { nome: "Kim Kataguiri", nomeUrna: "KIM KATAGUIRI", partido: "União Brasil", esfera: "federal", localidade: "São Paulo - SP", cargo: "Deputado Federal", foto: "👨‍🎓", urlCamara: "https://www.camara.leg.br/deputados/178988" },
    promessas: [
      { categoria: "Economia", descricao: "Reduzir a carga tributária sobre pequenas e médias empresas para estimular o empreendedorismo", fonte: "Plano de Governo 2022" },
      { categoria: "Segurança Pública", descricao: "Ampliar o efetivo policial e modernizar as delegacias com tecnologia de vigilância", fonte: "Plano de Governo 2022" },
      { categoria: "Desburocratização", descricao: "Simplificar os processos de abertura de empresas e licenciamentos para empreendedores", fonte: "Plano de Governo 2022" },
    ],
    realizacoes: [
      { titulo: "PL 3.149/2020 — Startup Act Nacional", descricao: "Lei que cria ambiente regulatório mais simples para startups no Brasil", status: "Aprovado", urlOficial: "https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2260069", ano: "2020" },
      { titulo: "PL 1.998/2022 — Desburocratização de MEI", descricao: "Simplificação do processo de formalização de microempreendedores individuais", status: "Em tramitação", urlOficial: "https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2330108", ano: "2022" },
    ],
  },
  // ── 4. Sâmia Bomfim ───────────────────────────────────────────────────
  {
    politico: { nome: "Sâmia Bomfim", nomeUrna: "SÂMIA BOMFIM", partido: "PSOL", esfera: "federal", localidade: "São Paulo - SP", cargo: "Deputada Federal", foto: "👩‍⚖️", urlCamara: "https://www.camara.leg.br/deputados/204402" },
    promessas: [
      { categoria: "Direitos Humanos", descricao: "Combater a violência contra mulheres com ampliação das delegacias especializadas e casas-abrigo", fonte: "Plano de Governo 2022" },
      { categoria: "Meio Ambiente", descricao: "Ampliar a fiscalização do desmatamento na Amazônia e criar fundo de compensação para comunidades locais", fonte: "Plano de Governo 2022" },
      { categoria: "Saúde", descricao: "Defender o SUS e ampliar o financiamento federal para a atenção primária à saúde", fonte: "Plano de Governo 2022" },
    ],
    realizacoes: [
      { titulo: "PL 2.339/2023 — Violência Doméstica Virtual", descricao: "Tipifica e pune a violência psicológica e o stalking digital contra mulheres", status: "Em tramitação", urlOficial: "https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2357892", ano: "2023" },
      { titulo: "PEC 18/2023 — Renda Básica Universal", descricao: "Proposta de Emenda Constitucional para garantir renda mínima a todas as famílias brasileiras", status: "Em tramitação", urlOficial: "https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2352540", ano: "2023" },
    ],
  },
  // ── 5. Nikolas Ferreira ───────────────────────────────────────────────
  {
    politico: { nome: "Nikolas Ferreira", nomeUrna: "NIKOLAS FERREIRA", partido: "PL", esfera: "federal", localidade: "Minas Gerais - MG", cargo: "Deputado Federal", foto: "🧑‍💼", urlCamara: "https://www.camara.leg.br/deputados/220539" },
    promessas: [
      { categoria: "Segurança", descricao: "Ampliar o efetivo policial nas cidades e endurecer as penas para crimes violentos", fonte: "Plano de Governo 2022" },
      { categoria: "Economia", descricao: "Reduzir impostos e a presença do Estado na economia para estimular o setor privado", fonte: "Plano de Governo 2022" },
      { categoria: "Educação", descricao: "Fomentar o ensino domiciliar e garantir a liberdade de ensino às famílias", fonte: "Plano de Governo 2022" },
    ],
    realizacoes: [
      { titulo: "PL 3.261/2022 — Ensino Domiciliar", descricao: "Regulamentação do homeschooling no Brasil com supervisão estatal", status: "Em tramitação", urlOficial: "https://www.camara.leg.br", ano: "2022" },
      { titulo: "Requerimento de Fiscalização do INEP", descricao: "Requerimento para auditoria nos processos do ENEM e acesso às questões por ideologia", status: "Aprovado", urlOficial: "https://www.camara.leg.br", ano: "2023" },
    ],
  },
  // ── 6. Duda Salabert ──────────────────────────────────────────────────
  {
    politico: { nome: "Duda Salabert", nomeUrna: "DUDA SALABERT", partido: "PDT", esfera: "federal", localidade: "Minas Gerais - MG", cargo: "Deputada Federal", foto: "👩‍🏫", urlCamara: "https://www.camara.leg.br/deputados/220562" },
    promessas: [
      { categoria: "Direitos Humanos", descricao: "Garantir direitos e proteção às populações LGBTQIA+ e combater a discriminação", fonte: "Plano de Governo 2022" },
      { categoria: "Meio Ambiente", descricao: "Promover transição para energias renováveis e políticas de sustentabilidade climática", fonte: "Plano de Governo 2022" },
      { categoria: "Mobilidade", descricao: "Ampliar ciclovias e integrar modal cicloviário ao transporte público nas grandes cidades", fonte: "Plano de Governo 2022" },
    ],
    realizacoes: [
      { titulo: "PL 1.672/2023 — Combate à LGBTfobia no Trabalho", descricao: "Projeto de lei que proíbe discriminação por orientação sexual e identidade de gênero no mercado de trabalho", status: "Em tramitação", urlOficial: "https://www.camara.leg.br", ano: "2023" },
      { titulo: "PL 2.234/2023 — Transição Energética Justa", descricao: "Criação de fundo para requalificação de trabalhadores de setores afetados pela descarbonização", status: "Em tramitação", urlOficial: "https://www.camara.leg.br", ano: "2023" },
    ],
  },
  // ── 7. Maria do Rosário ───────────────────────────────────────────────
  {
    politico: { nome: "Maria do Rosário", nomeUrna: "MARIA DO ROSÁRIO", partido: "PT", esfera: "federal", localidade: "Rio Grande do Sul - RS", cargo: "Deputada Federal", foto: "👩‍⚕️", urlCamara: "https://www.camara.leg.br/deputados/73615" },
    promessas: [
      { categoria: "Direitos Humanos", descricao: "Fortalecer o Estatuto da Criança e do Adolescente e combater a violência infantil", fonte: "Plano de Governo 2022" },
      { categoria: "Saúde", descricao: "Ampliar o SUS, com ênfase em saúde mental e cobertura nas regiões remotas", fonte: "Plano de Governo 2022" },
      { categoria: "Inclusão Social", descricao: "Expandir programas de transferência de renda e garantia de renda mínima às famílias vulneráveis", fonte: "Plano de Governo 2022" },
    ],
    realizacoes: [
      { titulo: "PL 4.837/2020 — Proteção a Crianças e Adolescentes", descricao: "Atualiza o ECA para proteger crianças de violência digital e exposição em redes sociais", status: "Aprovado", urlOficial: "https://www.camara.leg.br", ano: "2020" },
      { titulo: "PL 3.920/2021 — CAPS na Atenção Básica", descricao: "Integração dos Centros de Atenção Psicossocial às Unidades Básicas de Saúde", status: "Em tramitação", urlOficial: "https://www.camara.leg.br", ano: "2021" },
    ],
  },
  // ── 8. Gleisi Hoffmann ────────────────────────────────────────────────
  {
    politico: { nome: "Gleisi Hoffmann", nomeUrna: "GLEISI HOFFMANN", partido: "PT", esfera: "federal", localidade: "Paraná - PR", cargo: "Deputada Federal", foto: "👩‍💻", urlCamara: "https://www.camara.leg.br/deputados/160511" },
    promessas: [
      { categoria: "Economia", descricao: "Fortalecer as empresas estatais e o papel estratégico do Estado na economia", fonte: "Plano de Governo 2022" },
      { categoria: "Transporte", descricao: "Ampliar transporte público de qualidade e garantir tarifas acessíveis nas grandes cidades", fonte: "Plano de Governo 2022" },
      { categoria: "Inclusão Social", descricao: "Ampliar políticas de transferência de renda e de geração de emprego formal", fonte: "Plano de Governo 2022" },
    ],
    realizacoes: [
      { titulo: "PL 2.630/2023 — Regulação das Plataformas Digitais", descricao: "Aprovação de marco regulatório para redes sociais com foco em combate à desinformação", status: "Em tramitação", urlOficial: "https://www.camara.leg.br", ano: "2023" },
      { titulo: "Emenda ao Orçamento — Programa Bolsa Família", descricao: "Emenda parlamentar ampliando o teto de beneficiários do Bolsa Família em 2023", status: "Aprovado", urlOficial: "https://www.camara.leg.br", ano: "2023" },
    ],
  },
  // ── 9. Erika Kokay ────────────────────────────────────────────────────
  {
    politico: { nome: "Erika Kokay", nomeUrna: "ERIKA KOKAY", partido: "PT", esfera: "federal", localidade: "Distrito Federal - DF", cargo: "Deputada Federal", foto: "👩‍🦱", urlCamara: "https://www.camara.leg.br/deputados/141428" },
    promessas: [
      { categoria: "Habitação", descricao: "Ampliar o programa Minha Casa Minha Vida e regularizar assentamentos irregulares no DF", fonte: "Plano de Governo 2022" },
      { categoria: "Saúde", descricao: "Fortalecer o SUS e ampliar a cobertura da saúde pública nas regiões administrativas do DF", fonte: "Plano de Governo 2022" },
      { categoria: "Trabalho", descricao: "Proteger os direitos trabalhistas e combater a precarização do trabalho", fonte: "Plano de Governo 2022" },
    ],
    realizacoes: [
      { titulo: "PL 1.544/2021 — Proteção ao Trabalho Doméstico", descricao: "Amplia direitos trabalhistas de empregadas domésticas, incluindo seguro-desemprego", status: "Aprovado", urlOficial: "https://www.camara.leg.br", ano: "2021" },
      { titulo: "PL 529/2023 — Regularização Fundiária no DF", descricao: "Acesso simplificado à regularização de imóveis em regiões administrativas do Distrito Federal", status: "Em tramitação", urlOficial: "https://www.camara.leg.br", ano: "2023" },
    ],
  },
  // ── 10. Glauber Braga ─────────────────────────────────────────────────
  {
    politico: { nome: "Glauber Braga", nomeUrna: "GLAUBER BRAGA", partido: "PSOL", esfera: "federal", localidade: "Rio de Janeiro - RJ", cargo: "Deputado Federal", foto: "👨‍🏫", urlCamara: "https://www.camara.leg.br/deputados/204423" },
    promessas: [
      { categoria: "Economia", descricao: "Reverter privatizações e fortalecer o papel das estatais no desenvolvimento nacional", fonte: "Plano de Governo 2022" },
      { categoria: "Meio Ambiente", descricao: "Combater o garimpo ilegal na Amazônia e demarcação de todas as terras indígenas", fonte: "Plano de Governo 2022" },
      { categoria: "Saúde", descricao: "Defender o SUS 100% público e barrar qualquer forma de privatização da saúde", fonte: "Plano de Governo 2022" },
    ],
    realizacoes: [
      { titulo: "PEC — Estatização de Serviços Essenciais", descricao: "Proposta de Emenda Constitucional para barrar privatizações de saneamento e energia elétrica", status: "Arquivado", urlOficial: "https://www.camara.leg.br", ano: "2022" },
      { titulo: "Requerimento — CPI das Privatizações", descricao: "Requerimento solicitando instalação de CPI para investigar processos de privatização da Eletrobras", status: "Arquivado", urlOficial: "https://www.camara.leg.br", ano: "2022" },
    ],
  },
  // ── 11. Natália Bonavides ─────────────────────────────────────────────
  {
    politico: { nome: "Natália Bonavides", nomeUrna: "NATÁLIA BONAVIDES", partido: "PT", esfera: "federal", localidade: "Rio Grande do Norte - RN", cargo: "Deputada Federal", foto: "👩‍🔬", urlCamara: "https://www.camara.leg.br/deputados/204560" },
    promessas: [
      { categoria: "Educação", descricao: "Ampliar vagas nas universidades federais e garantir permanência estudantil para jovens de baixa renda", fonte: "Plano de Governo 2022" },
      { categoria: "Meio Ambiente", descricao: "Investir em energia eólica e solar para o Nordeste, gerando empregos e sustentabilidade", fonte: "Plano de Governo 2022" },
      { categoria: "Inclusão Social", descricao: "Fortalecer cotas raciais e sociais no ensino superior e no serviço público", fonte: "Plano de Governo 2022" },
    ],
    realizacoes: [
      { titulo: "PL 4.560/2023 — Energia Solar para Comunidades", descricao: "Desconto de 50% na conta de luz para famílias de baixa renda que aderirem à energia solar", status: "Em tramitação", urlOficial: "https://www.camara.leg.br", ano: "2023" },
      { titulo: "PL 1.290/2023 — Cotas nas Pós-Graduações Federais", descricao: "Ampliação do sistema de cotas para programas de mestrado e doutorado nas universidades federais", status: "Em tramitação", urlOficial: "https://www.camara.leg.br", ano: "2023" },
    ],
  },
  // ── 12. Reginaldo Lopes ───────────────────────────────────────────────
  {
    politico: { nome: "Reginaldo Lopes", nomeUrna: "REGINALDO LOPES", partido: "PT", esfera: "federal", localidade: "Minas Gerais - MG", cargo: "Deputado Federal", foto: "👨‍⚖️", urlCamara: "https://www.camara.leg.br/deputados/73574" },
    promessas: [
      { categoria: "Economia", descricao: "Fortalecer o investimento público em infraestrutura para gerar empregos e aquecer a economia", fonte: "Plano de Governo 2022" },
      { categoria: "Saúde", descricao: "Ampliar o financiamento federal ao SUS e garantir cobertura universal", fonte: "Plano de Governo 2022" },
      { categoria: "Transporte", descricao: "Expandir a cobertura do transporte público coletivo nas regiões metropolitanas", fonte: "Plano de Governo 2022" },
    ],
    realizacoes: [
      { titulo: "PL 2.011/2022 — Novo Programa de Infraestrutura", descricao: "Criação de linha de crédito federal para obras de saneamento e mobilidade urbana", status: "Em tramitação", urlOficial: "https://www.camara.leg.br", ano: "2022" },
      { titulo: "Emenda ao PAC — MG", descricao: "Emendas parlamentares para obras de mobilidade urbana em Belo Horizonte e região metropolitana", status: "Aprovado", urlOficial: "https://www.camara.leg.br", ano: "2023" },
    ],
  },
  // ── 13. Capitão Alberto Neto ──────────────────────────────────────────
  {
    politico: { nome: "Capitão Alberto Neto", nomeUrna: "CAPITÃO ALBERTO NETO", partido: "PL", esfera: "federal", localidade: "Amazonas - AM", cargo: "Deputado Federal", foto: "👮", urlCamara: "https://www.camara.leg.br/deputados/204379" },
    promessas: [
      { categoria: "Segurança", descricao: "Ampliar o efetivo das Forças Armadas e da Polícia Federal na região amazônica para combater o garimpo ilegal e tráfico", fonte: "Plano de Governo 2022" },
      { categoria: "Meio Ambiente", descricao: "Equilibrar preservação ambiental com desenvolvimento econômico sustentável para populações ribeirinhas", fonte: "Plano de Governo 2022" },
      { categoria: "Economia", descricao: "Reduzir impostos sobre produção agropecuária e ampliar crédito rural para o Norte do Brasil", fonte: "Plano de Governo 2022" },
    ],
    realizacoes: [
      { titulo: "PL 1.920/2022 — Operações de Garantia da Lei e da Ordem na Amazônia", descricao: "Amplia a competência das Forças Armadas em operações de combate ao crime organizado na região Norte", status: "Em tramitação", urlOficial: "https://www.camara.leg.br", ano: "2022" },
      { titulo: "Emenda — Infraestrutura Rural no AM", descricao: "Emenda destinando recursos para estradas vicinais e energia elétrica em comunidades rurais do Amazonas", status: "Aprovado", urlOficial: "https://www.camara.leg.br", ano: "2023" },
    ],
  },
  // ── 14. Coronel Meira ─────────────────────────────────────────────────
  {
    politico: { nome: "Coronel Meira", nomeUrna: "CORONEL MEIRA", partido: "PL", esfera: "federal", localidade: "Pernambuco - PE", cargo: "Deputado Federal", foto: "🪖", urlCamara: "https://www.camara.leg.br/deputados/220467" },
    promessas: [
      { categoria: "Segurança", descricao: "Defender o porte de armas para cidadãos de bem e ampliar as leis de legítima defesa", fonte: "Plano de Governo 2022" },
      { categoria: "Economia", descricao: "Privatizar empresas deficitárias e cortar gastos públicos desnecessários", fonte: "Plano de Governo 2022" },
      { categoria: "Educação", descricao: "Combater a ideologia nas escolas e garantir o ensino de valores tradicionais", fonte: "Plano de Governo 2022" },
    ],
    realizacoes: [
      { titulo: "PL 2.338/2022 — Legítima Defesa Ampliada", descricao: "Amplia as hipóteses de legítima defesa para agentes de segurança pública em serviço", status: "Em tramitação", urlOficial: "https://www.camara.leg.br", ano: "2022" },
      { titulo: "PL 3.411/2021 — Programa de Concessões no Nordeste", descricao: "Autoriza concessões de serviços de saneamento e energia elétrica em municípios nordestinos", status: "Arquivado", urlOficial: "https://www.camara.leg.br", ano: "2021" },
    ],
  },
  // ── 15. Caroline de Toni ──────────────────────────────────────────────
  {
    politico: { nome: "Caroline de Toni", nomeUrna: "CAROLINE DE TONI", partido: "PL", esfera: "federal", localidade: "Santa Catarina - SC", cargo: "Deputada Federal", foto: "👩‍💼", urlCamara: "https://www.camara.leg.br/deputados/204399" },
    promessas: [
      { categoria: "Segurança", descricao: "Garantir o direito ao porte de arma para cidadãos com ficha limpa e ampliar a legítima defesa", fonte: "Plano de Governo 2022" },
      { categoria: "Economia", descricao: "Reduzir a carga tributária sobre empresas e desburocratizar o ambiente de negócios", fonte: "Plano de Governo 2022" },
      { categoria: "Família", descricao: "Defender pautas conservadoras ligadas à família e à liberdade religiosa", fonte: "Plano de Governo 2022" },
    ],
    realizacoes: [
      { titulo: "PL 3.723/2021 — Estatuto da Família Tradicional", descricao: "Reconhecimento jurídico da família formada por pai, mãe e filhos no Código Civil", status: "Arquivado", urlOficial: "https://www.camara.leg.br", ano: "2021" },
      { titulo: "PL 4.900/2023 — Porte de Arma Simplificado", descricao: "Simplifica os requisitos para obtenção de porte de arma por civis sem antecedentes criminais", status: "Em tramitação", urlOficial: "https://www.camara.leg.br", ano: "2023" },
    ],
  },
  // ── 16. Rodrigo Agostinho ─────────────────────────────────────────────
  {
    politico: { nome: "Rodrigo Agostinho", nomeUrna: "RODRIGO AGOSTINHO", partido: "PSB", esfera: "federal", localidade: "São Paulo - SP", cargo: "Deputado Federal", foto: "🌿", urlCamara: "https://www.camara.leg.br/deputados/178980" },
    promessas: [
      { categoria: "Meio Ambiente", descricao: "Implementar política nacional de transição energética com foco em solar e eólica", fonte: "Plano de Governo 2022" },
      { categoria: "Saúde", descricao: "Ampliar programas de saúde preventiva vinculados à qualidade ambiental", fonte: "Plano de Governo 2022" },
      { categoria: "Mobilidade", descricao: "Expandir ciclovias e promover cidades mais sustentáveis com transporte de baixo carbono", fonte: "Plano de Governo 2022" },
    ],
    realizacoes: [
      { titulo: "PL 2.583/2022 — Marco Legal das Energias Renováveis", descricao: "Simplifica o licenciamento para usinas solares e parques eólicos offshore", status: "Aprovado", urlOficial: "https://www.camara.leg.br", ano: "2022" },
      { titulo: "PL 1.876/2021 — Mercado de Carbono Brasileiro", descricao: "Criação do Sistema Brasileiro de Comércio de Emissões, semelhante ao modelo europeu", status: "Em tramitação", urlOficial: "https://www.camara.leg.br", ano: "2021" },
    ],
  },
  // ── 17. Ivan Valente ──────────────────────────────────────────────────
  {
    politico: { nome: "Ivan Valente", nomeUrna: "IVAN VALENTE", partido: "PSOL", esfera: "federal", localidade: "São Paulo - SP", cargo: "Deputado Federal", foto: "✊", urlCamara: "https://www.camara.leg.br/deputados/73601" },
    promessas: [
      { categoria: "Economia", descricao: "Defender estatais estratégicas e reverter privatizações dos governos anteriores", fonte: "Plano de Governo 2022" },
      { categoria: "Educação", descricao: "Ampliar recursos públicos para universidades federais e garantir educação pública gratuita", fonte: "Plano de Governo 2022" },
      { categoria: "Transporte", descricao: "Defesa de tarifas zero no transporte público e expansão das redes de metrô", fonte: "Plano de Governo 2022" },
    ],
    realizacoes: [
      { titulo: "PL 2.501/2019 — Revogação da Privatização dos Correios", descricao: "Projeto de lei para manter os Correios como empresa pública federal", status: "Arquivado", urlOficial: "https://www.camara.leg.br", ano: "2019" },
      { titulo: "PEC da Educação Gratuita", descricao: "Proposta de Emenda Constitucional garantindo gratuidade total do ensino superior público e proibindo cobranças de taxas", status: "Em tramitação", urlOficial: "https://www.camara.leg.br", ano: "2022" },
    ],
  },
  // ── 18. Celso Sabino ──────────────────────────────────────────────────
  {
    politico: { nome: "Celso Sabino", nomeUrna: "CELSO SABINO", partido: "União Brasil", esfera: "federal", localidade: "Pará - PA", cargo: "Deputado Federal", foto: "🤝", urlCamara: "https://www.camara.leg.br/deputados/204388" },
    promessas: [
      { categoria: "Turismo", descricao: "Desenvolver o turismo sustentável na Amazônia como vetor de geração de renda para populações locais", fonte: "Plano de Governo 2022" },
      { categoria: "Tecnologia", descricao: "Fomentar a transformação digital dos serviços públicos federais para aumentar a eficiência", fonte: "Plano de Governo 2022" },
      { categoria: "Economia", descricao: "Apoiar pequenos e médios empreendedores com crédito acessível e redução de burocracia", fonte: "Plano de Governo 2022" },
    ],
    realizacoes: [
      { titulo: "PL 3.480/2022 — Programa Nacional de Turismo Sustentável", descricao: "Incentivos fiscais para ecoturismo e turismo rural em áreas de preservação ambiental", status: "Aprovado", urlOficial: "https://www.camara.leg.br", ano: "2022" },
      { titulo: "PL 1.109/2023 — Digitalização de Serviços Consulares", descricao: "Modernização dos serviços de passaporte e vistos via plataforma digital integrada", status: "Em tramitação", urlOficial: "https://www.camara.leg.br", ano: "2023" },
    ],
  },
  // ── 19. Pedro Paulo ───────────────────────────────────────────────────
  {
    politico: { nome: "Pedro Paulo", nomeUrna: "PEDRO PAULO", partido: "PSD", esfera: "municipal", localidade: "Rio de Janeiro - RJ", cargo: "Vereador", foto: "🏙️", urlCamara: null },
    promessas: [
      { categoria: "Mobilidade", descricao: "Expandir a rede de BRT e integrar o transporte público carioca via aplicativo único", fonte: "Plano de Governo 2024" },
      { categoria: "Tecnologia", descricao: "Transformar o Rio de Janeiro em cidade inteligente com câmeras, IoT e big data público", fonte: "Plano de Governo 2024" },
      { categoria: "Economia", descricao: "Atrair startups e empresas de tecnologia para o Rio com incentivos fiscais e hub de inovação", fonte: "Plano de Governo 2024" },
    ],
    realizacoes: [
      { titulo: "Projeto Rio Smart City", descricao: "Instalação de câmeras inteligentes e sensores de tráfego em vias arteriais do Rio de Janeiro", status: "Em tramitação", urlOficial: "https://www.camara.rj.gov.br", ano: "2024" },
      { titulo: "Lei de Incentivo a Startups Cariocas", descricao: "Isenção de ISS por 3 anos para startups de tecnologia sediadas no Rio com faturamento até R$1 mi", status: "Aprovado", urlOficial: "https://www.camara.rj.gov.br", ano: "2023" },
    ],
  },
  // ── 20. Felipe Rigoni ─────────────────────────────────────────────────
  {
    politico: { nome: "Felipe Rigoni", nomeUrna: "FELIPE RIGONI", partido: "União Brasil", esfera: "federal", localidade: "Espírito Santo - ES", cargo: "Deputado Federal", foto: "💡", urlCamara: "https://www.camara.leg.br/deputados/204418" },
    promessas: [
      { categoria: "Tecnologia", descricao: "Levar banda larga de alta velocidade para municípios sem cobertura e digitalizr os serviços públicos", fonte: "Plano de Governo 2022" },
      { categoria: "Saúde", descricao: "Ampliar a telemedicina no SUS para atender populações em regiões remotas", fonte: "Plano de Governo 2022" },
      { categoria: "Mobilidade", descricao: "Incentivar o transporte por aplicativo e a mobilidade ativa como complemento ao transporte público", fonte: "Plano de Governo 2022" },
    ],
    realizacoes: [
      { titulo: "PL 4.700/2023 — Marco Legal da Inteligência Artificial", descricao: "Regulamentação do uso de IA pelo poder público e diretrizes para setor privado", status: "Em tramitação", urlOficial: "https://www.camara.leg.br", ano: "2023" },
      { titulo: "PL 2.924/2021 — Telemedicina no SUS", descricao: "Institucionaliza a consulta médica à distância no sistema público de saúde como modalidade permanente", status: "Aprovado", urlOficial: "https://www.camara.leg.br", ano: "2021" },
    ],
  },
];

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
    await db.delete(realizacoes);
    await db.delete(promessas);
    await db.delete(politicos);

    const seeded = await seedItems(STATIC_DATA);
    res.json({ ok: true, seeded, source: "static" });
  } catch (err) {
    req.log?.error({ err }, "Error in admin sync");
    res.status(500).json({ error: "Erro ao sincronizar dados" });
  }
});

export default router;
