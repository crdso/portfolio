/*
  Arquivo de trabalhos.
  Cada pasta (nicho) guarda projetos. Cada projeto usa a HERO REAL do site,
  capturada rodando o projeto localmente (assets/work/<id>/).

  Para adicionar um projeto: crie assets/work/<id>/ com hero.webp, hero-sm.webp
  (e opcionalmente s1..s3.webp e m.webp) e adicione um objeto em `projects`.
  `caseStudy` fica reservado para uma página de estudo de caso no futuro.
*/
window.CONFIG = {
  name: 'Ezequias Cardoso',
  github: 'https://github.com/crdso',
  // Preencha para exibir no contato:
  email: '',        // ex.: 'contato@seudominio.com'
  whatsapp: '',     // ex.: '5563999999999'
  instagram: ''     // ex.: 'https://instagram.com/seuperfil'
};

window.FOLDERS = [
  { id: 'academias', name: 'Academias', accent: '#E3202A',
    note: 'Estrutura, horário e matrícula — a academia vendida antes da visita.',
    sheets: ['doctorsmall/hero-sm', 'doctorsmall/s1', 'doctorsmall/s2'] },
  { id: 'moda', name: 'Moda', accent: '#D9D2C5',
    note: 'Produto como protagonista, marca como atmosfera.',
    sheets: ['best/hero-sm', 'best/p1', 'best/p2'] },
  { id: 'tecnologia', name: 'Tecnologia', accent: '#FF7A1A', alias: 'Celulares',
    note: 'Lojas de iPhone e assistência. Uma base, várias marcas.',
    sheets: ['miphone/hero-sm', 'lealimports/hero-sm', 'jlcimportados/hero-sm'] },
  { id: 'alimentacao', name: 'Alimentação', accent: '#E8B04B',
    note: 'Hamburguerias com cardápio e pedido a um toque.',
    sheets: ['blackburguer/hero-sm', 'cajui/hero-sm', 'blackburguer/s1'] },
  { id: 'institucional', name: 'Institucional', accent: '#A99BFF', alias: 'Eventos',
    note: 'Eventos e iniciativas do IFTO — da identidade à interação.',
    sheets: ['entec/hero-sm', 'correio/hero-sm', 'entec-fotos/hero-sm'] },
  { id: 'produtos', name: 'Produtos', accent: '#6FD4B4', alias: 'Outros',
    note: 'Ferramentas próprias, com página pública e área de uso.',
    sheets: ['findmap/hero-sm', 'findmap/m', 'findmap/hero-sm'] }
];

window.PROJECTS = [
  {
    id: 'doctorsmall', folder: 'academias',
    name: 'Doctor Small Academia', niche: 'Academia premium', place: 'Araguatins — TO',
    repo: 'crdso/doctorsmall',
    summary: 'Site comercial para uma academia premium. Leva a pessoa da primeira impressão até a matrícula, que continua no checkout da NextFit.',
    highlights: ['Status “aberto agora” calculado no fuso local', 'Bloco do Instagram com posts reais', 'Hero cinematográfica em preto e vermelho'],
    stack: ['HTML', 'CSS', 'JavaScript'],
    screens: ['s1', 's2', 's3'], mobile: true, status: null, caseStudy: null
  },
  {
    id: 'best', folder: 'moda',
    name: 'Best Multimarcas', niche: 'Loja multimarcas', place: 'Araguatins · Augustinópolis — TO',
    repo: null,
    summary: 'Site de inauguração de uma nova unidade. Uma hero em capítulos, guiada pela rolagem, com os produtos entrando em cena.',
    highlights: ['Hero em capítulos guiada por rolagem (GSAP ScrollTrigger)', 'Vitrine de marcas e unidades'],
    stack: ['React', 'TypeScript', 'Tailwind', 'GSAP'],
    screens: [], mobile: false, status: 'Em desenvolvimento — capa montada com os assets do projeto', caseStudy: null
  },
  {
    id: 'miphone', folder: 'tecnologia',
    name: 'MiPhone', niche: 'Loja de iPhones e assistência', place: 'Brasil',
    repo: 'crdso/miphone',
    summary: 'Loja de aparelhos e assistência técnica. A hero é um vídeo controlado pela rolagem: os iPhones giram enquanto a mensagem muda.',
    highlights: ['Vídeo sincronizado com a rolagem (desktop e mobile)', 'Tema claro e escuro', 'Loja, assistência e contato por WhatsApp'],
    stack: ['React', 'Vite', 'React Router'],
    screens: ['s1', 's2', 's3'], mobile: true, status: null, caseStudy: null,
    variants: [
      { id: 'jkimports', name: 'JK Imports', repo: 'crdso/jkimports' },
      { id: 'jlcimportados', name: 'JLC Importados', repo: 'crdso/jlcimportados' },
      { id: 'lealimports', name: 'Leal Imports', repo: 'crdso/lealimports' }
    ]
  },
  {
    id: 'blackburguer', folder: 'alimentacao',
    name: 'Black Burguer', niche: 'Hamburgueria artesanal', place: 'Araguatins — TO',
    repo: 'crdso/burguerv1',
    summary: 'Hamburgueria artesanal. O hambúrguer se desmonta camada por camada enquanto a página rola, e cada camada vira um argumento.',
    highlights: ['Vídeo em scrub quadro a quadro', 'Cardápio e pedido pelo WhatsApp'],
    stack: ['React', 'TypeScript', 'Tailwind', 'Framer Motion'],
    screens: ['s1'], mobile: true, status: null, caseStudy: null,
    variants: [{ id: 'cajui', name: 'Cajuí — Palmas', repo: 'crdso/burguerv2' }]
  },
  {
    id: 'entec', folder: 'institucional',
    name: 'ENTEC 2026', niche: 'Encontro de Tecnologia do IFTO', place: 'IFTO — Tocantins',
    repo: null,
    summary: 'Site do evento e acervo oficial de fotos. Hero com shader em WebGL e uma prévia das fotos em galeria curva.',
    highlights: ['Hero com shader WebGL', 'Galeria de fotos em curva 3D', 'Contador de visitas com Supabase'],
    stack: ['HTML', 'JavaScript', 'WebGL', 'Supabase'],
    screens: [], extra: 'entec-fotos', mobile: true, status: null, caseStudy: null
  },
  {
    id: 'correio', folder: 'institucional',
    name: 'Correio Elegante', niche: 'Cartinhas anônimas', place: 'IFTO — Tocantins',
    repo: 'zRise/correiotrc',
    summary: 'Aplicação para enviar cartinhas anônimas no evento: a pessoa escreve, escolhe o presente e a equipe entrega.',
    highlights: ['Fluxo de envio em 4 passos', 'Painel administrativo', 'Autenticação e dados no Supabase'],
    stack: ['React', 'Tailwind', 'Supabase'],
    screens: ['s1', 's2'], mobile: true, status: null, caseStudy: null
  },
  {
    id: 'findmap', folder: 'produtos',
    name: 'FindMap', niche: 'Plataforma de prospecção', place: 'Produto próprio',
    repo: 'crdso/prospectmap',
    summary: 'Encontre empresas por categoria e localização. Página pública de produto e área privada de busca.',
    highlights: ['Busca por categoria + localização', 'Hero com grade de pontos animada'],
    stack: ['HTML', 'CSS', 'JavaScript'],
    screens: [], mobile: true, status: null, caseStudy: null
  }
];
