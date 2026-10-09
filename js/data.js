/*
  Conteúdo do portfólio.
  Imagens: assets/work/<id>/ — os nomes abaixo não incluem extensão.
  O main.js usa as capturas corrigidas em PNG quando existem; as demais seguem em WebP.
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
  { id: 'ifto', name: 'IFTO' }
];

window.PROJECTS = [
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
  { id: 'solare', cat: 'energia', name: 'Solare', type: 'Energia solar residencial', place: '—',
    text: 'Energia solar residencial com calculadora de economia e processo de instalação.',
    services: ['Web design'], tech: ['Framer'], shots: ['section-01', 'section-02'] },

  { id: 'advocacia', cat: 'institucional', name: 'Guilherme Podgaietsky', type: 'Advocacia criminal', place: 'Brasil',
    text: 'Advocacia criminal com sobriedade: preto, dourado e uma comunicação direta sobre sigilo e estratégia.',
    services: ['Web design', 'Desenvolvimento'], tech: ['HTML', 'CSS', 'JavaScript'], shots: ['section-01', 'section-02'] },
  { id: 'portoglass', cat: 'institucional', name: 'Porto Glass', type: 'Vidros, alumínio e mármore', place: 'Bacabal — MA',
    text: 'Vidros, espelhos, alumínio e mármore: catálogo de obras, diferenciais e orçamento pelo WhatsApp.',
    services: ['Web design', 'Desenvolvimento'], tech: ['HTML', 'CSS', 'JavaScript'], shots: ['section-01', 'section-02'] },

  { id: 'entec', cat: 'ifto', name: 'ENTEC 2026', type: 'Evento de tecnologia do IFTO', place: 'IFTO — Tocantins',
    text: 'Site oficial da ENTEC 2026, criado para reunir as principais informações do evento, inscrições, resultados e o acervo de fotos da edição em uma experiência organizada e fácil de navegar.',
    services: ['Web design', 'Front-end', 'Back-end', 'Banco de dados'], tech: ['JavaScript', 'WebGL', 'Supabase'], shots: ['entec-fotos/hero'] },
  { id: 'correio', cat: 'ifto', name: 'Correio Elegante', type: 'Aplicação web', place: 'IFTO — Tocantins',
    text: 'Aplicação para enviar cartinhas anônimas no evento: fluxo de envio, pagamento, painel administrativo e autenticação.',
    services: ['Web design', 'Front-end', 'Back-end', 'Painel administrativo'], tech: ['React', 'Tailwind', 'Supabase'], shots: ['s1', 's2'] },

  { id: 'marcela', cat: 'moda', name: 'Marcela Mendes', type: 'Salão de beleza', place: 'Tapiratiba e Guaxupé',
    text: 'Site de apresentação e agendamento para um salão de beleza, com foco nos serviços e na identidade da marca.',
    services: ['Web design', 'Desenvolvimento'], tech: ['React', 'Vite'], shots: [] },
  { id: 'sanches', cat: 'moda', name: 'Studio Ricardo Sanches', type: 'Fotografia e revelação', place: 'Araraquara — SP',
    text: 'Presença digital de um estúdio fotográfico, com destaque para ensaios, produtos e revelação.',
    services: ['Web design', 'Desenvolvimento'], tech: ['React', 'Vite'], shots: [] },
  { id: 'donuts', cat: 'alimentacao', name: 'Hello Donuts & Coffee', type: 'Donuts e cafeteria', place: 'Londrina — PR',
    text: 'Vitrine digital para donuts, milkshakes e cookies, com cardápio visual e personalidade de marca.',
    services: ['Web design', 'Desenvolvimento'], tech: ['React', 'Vite'], shots: [] },
  { id: 'chapavoadora', cat: 'alimentacao', name: 'Chapa Voadora', type: 'Hamburgueria', place: 'Brasil',
    text: 'Site de smash burgers com identidade forte, cardápio e caminho direto para o pedido.',
    services: ['Web design', 'Desenvolvimento'], tech: ['React', 'Vite'], shots: [] },
  { id: 'gostoburger', cat: 'alimentacao', name: 'GOSTO! Burger', type: 'Hamburgueria', place: 'Brasil',
    text: 'Uma apresentação de hamburgueria centrada no produto, com cores marcantes e pedido em evidência.',
    services: ['Web design', 'Desenvolvimento'], tech: ['React', 'Vite'], shots: [] },
  { id: 'sabordapraca', cat: 'alimentacao', name: 'Sabor da Praça', type: 'Hamburgueria', place: 'Brasil',
    text: 'Cardápio visual e comunicação direta para aproximar a marca de quem procura sua próxima refeição.',
    services: ['Web design', 'Desenvolvimento'], tech: ['React', 'Vite'], shots: [] },
  { id: 'tmlanches', cat: 'alimentacao', name: 'TM Lanches', type: 'Lanchonete', place: 'Uberlândia — MG',
    text: 'Site de lanchonete com produtos, informações da casa e acesso rápido ao cardápio.',
    services: ['Web design', 'Desenvolvimento'], tech: ['React', 'Vite'], shots: [] },
  { id: 'pastelaria', cat: 'alimentacao', name: 'Pastel do Zoio', type: 'Pastelaria', place: 'Brasil',
    text: 'Apresentação de pastelaria com identidade própria, produtos em destaque e pedido facilitado.',
    services: ['Web design', 'Desenvolvimento'], tech: ['React', 'Vite'], shots: [] },
  { id: 'recantodoguerreiro', cat: 'alimentacao', name: 'Recanto do Guerreiro', type: 'Bar y Parrilla', place: 'Manacapuru — AM',
    text: 'Experiência gastronômica com destaque para pratos, ambiente e delivery.',
    services: ['Web design', 'Desenvolvimento'], tech: ['React', 'Vite'], shots: [] },
  { id: 'pegadaspet', cat: 'saude', name: 'Pegadas Pet', type: 'Pet shop e banho e tosa', place: 'Brasil',
    text: 'Site para serviços de cuidado com cães, banho e tosa e TaxiDog.',
    services: ['Web design', 'Desenvolvimento'], tech: ['React', 'Vite'], shots: [] },
  { id: 'solaris', cat: 'energia', name: 'Solaris Energia', type: 'Energia solar', place: 'Brasil',
    text: 'Apresentação de soluções de energia solar com foco nos serviços e no contato comercial.',
    services: ['Web design', 'Desenvolvimento'], tech: ['React', 'Vite'], shots: [] },
  { id: 'oficinaautomotivo', cat: 'institucional', name: 'Pit Stop Auto Center', type: 'Oficina automotiva', place: 'Piraí do Sul — PR',
    text: 'Site para alinhamento, balanceamento e suspensão, com serviços e contato em destaque.',
    services: ['Web design', 'Desenvolvimento'], tech: ['React', 'Vite'], shots: [] }
];

window.PROJECTS.forEach((project) => {
  project.siteUrl = `/sites/${project.id}/`;
});
