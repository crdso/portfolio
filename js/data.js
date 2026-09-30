/*
  Conteúdo do portfólio.
  Imagens: assets/work/<id>/ — hero.webp (1600), hero-sm.webp (800),
  section-01/02/03.webp (trechos escolhidos), capturadas dos sites rodando.
*/
window.CONFIG = {
  // Contatos exibidos no rodapé:
  email: 'ezequias.mc@gmail.com',
  whatsapp: '5563991399775',
  instagram: ''    // 'https://instagram.com/seuperfil'
};

window.CATEGORIES = [
  { id: 'moda', name: 'Moda & Beleza' },
  { id: 'tecnologia', name: 'Tecnologia' },
  { id: 'alimentacao', name: 'Alimentação' },
  { id: 'saude', name: 'Saúde' },
  { id: 'energia', name: 'Energia' },
  { id: 'institucional', name: 'Institucional' },
  { id: 'sistemas', name: 'Sistemas' }
];

window.PROJECTS = [
  { id: 'best', cat: 'moda', name: 'Best Multimarcas', type: 'Loja multimarcas', place: 'Araguatins · Augustinópolis — TO',
    text: 'Site de inauguração de uma nova unidade, com uma abertura em capítulos guiada pela rolagem e os produtos entrando em cena.',
    services: ['Web design', 'Desenvolvimento'], tech: ['React', 'TypeScript', 'GSAP'], shots: [], status: 'Em desenvolvimento' },
  { id: 'tavares', cat: 'moda', name: 'Studio Tavares', type: 'Salão de beleza', place: 'Brasil',
    text: 'Presença digital editorial para um estúdio de beleza, com tipografia elegante e agendamento em destaque.',
    services: ['Web design', 'Desenvolvimento'], tech: ['HTML', 'CSS', 'JavaScript'], shots: ['s1', 's2'] },

  { id: 'miphone', cat: 'tecnologia', name: 'MiPhone', type: 'Loja de iPhones e assistência', place: 'Brasil',
    text: 'Loja de aparelhos e assistência técnica. A abertura é um vídeo controlado pela rolagem: os iPhones giram enquanto a mensagem muda.',
    services: ['Web design', 'Desenvolvimento'], tech: ['React', 'Vite'], shots: ['section-02', 'section-03'],
    variants: [{ id: 'jkimports', name: 'JK Imports' }, { id: 'jlcimportados', name: 'JLC Importados' }, { id: 'lealimports', name: 'Leal Imports' }] },
  { id: 'nexa', cat: 'tecnologia', name: 'Nexa Agency', type: 'Agência de sites e sistemas', place: 'Brasil',
    text: 'Site bilíngue de uma agência de sites e sistemas sob medida, com processo, serviços e contato.',
    services: ['Web design', 'Desenvolvimento'], tech: ['Next.js'], shots: ['section-01', 'section-02'] },

  { id: 'blackburguer', cat: 'alimentacao', name: 'Black Burguer', type: 'Hamburgueria artesanal', place: 'Araguatins — TO',
    text: 'O hambúrguer se desmonta camada por camada enquanto a página rola — e cada camada vira um argumento. Cardápio e pedido pelo WhatsApp.',
    services: ['Web design', 'Desenvolvimento'], tech: ['React', 'TypeScript', 'Framer Motion'], shots: [],
    variants: [{ id: 'cajui', name: 'Cajuí — Palmas' }] },
  { id: 'brasa77', cat: 'alimentacao', name: 'Brasa 77', type: 'Hamburgueria artesanal', place: 'São Paulo — SP',
    text: 'Identidade de brasa e fumaça para uma hamburgueria: cardápio visual, destaques da casa e pedido direto.',
    services: ['Web design', 'Desenvolvimento'], tech: ['React'], shots: ['section-01', 'section-02'] },
  { id: 'bucco', cat: 'alimentacao', name: 'Bucco Burger', type: 'Hamburgueria', place: 'Morretes — PR',
    text: 'Hamburgueria da serra paranaense com cardápio completo, avaliações e pedido em destaque.',
    services: ['Web design', 'Desenvolvimento'], tech: ['HTML', 'CSS', 'JavaScript'], shots: ['s1', 'section-03'] },
  { id: 'olimpo', cat: 'alimentacao', name: 'Olimpo Restaurante', type: 'Gastronomia regional', place: 'Morretes — PR',
    text: 'Restaurante tradicional de Morretes, com a história da casa, o barreado e reservas.',
    services: ['Web design', 'Desenvolvimento'], tech: ['HTML', 'CSS', 'JavaScript'], shots: ['section-01', 'section-02'] },
  { id: 'bodega', cat: 'alimentacao', name: 'Bodega Poços', type: 'Charcutaria e vinhos', place: 'Poços de Caldas — MG',
    text: 'Charcutaria, queijos, fondues e vinhos, com cardápio completo e reservas pelo WhatsApp.',
    services: ['Web design', 'Desenvolvimento'], tech: ['HTML', 'CSS', 'JavaScript'], shots: ['section-01', 'section-02'] },
  { id: 'minero', cat: 'alimentacao', name: 'Restaurante do Minero', type: 'Comida mineira', place: 'Morretes — PR',
    text: 'Comida mineira com personalidade: mascote, cores fortes, cardápio e história da casa.',
    services: ['Web design', 'Desenvolvimento'], tech: ['HTML', 'CSS', 'JavaScript'], shots: ['section-01', 'section-02'] },
  { id: 'umami', cat: 'alimentacao', name: 'Umami', type: 'Pizzaria e bistrô', place: '—',
    text: 'Pizzaria e bistrô com abertura de impacto, pratos em destaque, eventos e reservas.',
    services: ['Web design'], tech: ['Framer'], shots: ['section-01', 'section-02'] },
  { id: 'goutu', cat: 'alimentacao', name: 'Goutu', type: 'Hamburgueria', place: '—',
    text: 'Hamburgueria leve e divertida, com cardápio, horários e avaliações.',
    services: ['Web design'], tech: ['Framer'], shots: ['s2', 'section-03'] },
  { id: 'foodee', cat: 'alimentacao', name: 'Foodee', type: 'Restaurante', place: '—',
    text: 'Restaurante com identidade vibrante: vermelho, pratos coloridos e tipografia de impacto.',
    services: ['Web design'], tech: ['Framer'], shots: ['s1', 's2'] },

  { id: 'odonto', cat: 'saude', name: 'Dra. Gabriella Cavalcante', type: 'Odontologia', place: 'Brasil',
    text: 'Consultório odontológico para toda a família: tratamentos, apresentação da profissional e agendamento.',
    services: ['Web design', 'Desenvolvimento'], tech: ['JavaScript', 'Vite'], shots: ['section-01', 'section-02'] },
  { id: 'hospitalvet', cat: 'saude', name: 'Hospital Veterinário 24h', type: 'Hospital veterinário', place: 'Brasil',
    text: 'Landing page de hospital veterinário 24 horas: estrutura, emergência e contato imediato com a equipe.',
    services: ['Web design', 'Desenvolvimento'], tech: ['Next.js'], shots: ['s1', 'section-03'] },

  { id: 'helios', cat: 'energia', name: 'Helios', type: 'Energia solar de alto padrão', place: 'Brasil',
    text: 'Energia solar de alto padrão com uma estética escura e precisa: resultados, engenharia e simulação.',
    services: ['Web design', 'Desenvolvimento'], tech: ['Next.js'], shots: ['s1', 's2'] },
  { id: 'nowtech', cat: 'energia', name: 'Nowtech', type: 'Energia solar', place: 'Brasil',
    text: 'Energia solar que reduz custos: projetos, simulação de economia e depoimentos.',
    services: ['Web design', 'Desenvolvimento'], tech: ['HTML', 'CSS', 'JavaScript'], shots: ['section-01', 'section-02'] },
  { id: 'solvex', cat: 'energia', name: 'Solvex', type: 'Energia renovável', place: '—',
    text: 'Energia renovável com páginas de serviços, projetos e blog.',
    services: ['Web design'], tech: ['Framer'], shots: ['section-01', 'section-02'] },
  { id: 'solare', cat: 'energia', name: 'Solare', type: 'Energia solar residencial', place: '—',
    text: 'Energia solar residencial com calculadora de economia e processo de instalação.',
    services: ['Web design'], tech: ['Framer'], shots: ['section-01', 'section-02'] },
  { id: 'solaix', cat: 'energia', name: 'Solaix', type: 'Energia solar', place: '—',
    text: 'Site multipágina de energia solar com serviços, projetos, calculadora e blog.',
    services: ['Web design'], tech: ['Framer'], shots: ['section-01', 'section-02'] },

  { id: 'advocacia', cat: 'institucional', name: 'Guilherme Podgaietsky', type: 'Advocacia criminal', place: 'Brasil',
    text: 'Advocacia criminal com sobriedade: preto, dourado e uma comunicação direta sobre sigilo e estratégia.',
    services: ['Web design', 'Desenvolvimento'], tech: ['HTML', 'CSS', 'JavaScript'], shots: ['section-01', 'section-02'] },
  { id: 'portoglass', cat: 'institucional', name: 'Porto Glass', type: 'Vidros, alumínio e mármore', place: 'Bacabal — MA',
    text: 'Vidros, espelhos, alumínio e mármore: catálogo de obras, diferenciais e orçamento pelo WhatsApp.',
    services: ['Web design', 'Desenvolvimento'], tech: ['HTML', 'CSS', 'JavaScript'], shots: ['section-01', 'section-02'] },
  { id: 'letsfly', cat: 'institucional', name: "Let'sFly", type: 'Aviação executiva', place: '—',
    text: 'Aviação executiva com fotografia de produto e composição minimalista.',
    services: ['Web design'], tech: ['Framer'], shots: ['section-02', 'section-03'] },

  { id: 'entec', cat: 'sistemas', name: 'ENTEC 2026', type: 'Evento de tecnologia do IFTO', place: 'IFTO — Tocantins',
    text: 'Site do evento e acervo oficial de fotos, com administração, banco de dados e funções no Supabase. Abertura com shader em WebGL e galeria curva.',
    services: ['Web design', 'Front-end', 'Back-end', 'Banco de dados'], tech: ['JavaScript', 'WebGL', 'Supabase'], shots: ['entec-fotos/hero'] },
  { id: 'correio', cat: 'sistemas', name: 'Correio Elegante', type: 'Aplicação web', place: 'IFTO — Tocantins',
    text: 'Aplicação para enviar cartinhas anônimas no evento: fluxo de envio, pagamento, painel administrativo e autenticação.',
    services: ['Web design', 'Front-end', 'Back-end', 'Painel administrativo'], tech: ['React', 'Tailwind', 'Supabase'], shots: ['s1', 's2'] },
  { id: 'findmap', cat: 'sistemas', name: 'FindMap', type: 'Plataforma de prospecção', place: 'Produto próprio',
    text: 'Encontre empresas por categoria e localização. Página pública de produto e área privada de busca.',
    services: ['Web design', 'Front-end', 'Sistema'], tech: ['JavaScript', 'Google Places'], shots: [] }
];
