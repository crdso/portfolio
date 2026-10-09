/* ==========================================================================
   BODEGA — Dados do site
   Para atualizar preços/itens, edite apenas este arquivo.
   Preços em reais (número). Descrições em texto corrido.
   ========================================================================== */

// Informações de contato. Deixe em branco ("") o que ainda não tiver —
// o site esconde automaticamente o que estiver vazio.
const CONFIG = {
  whatsapp: "5535999893555",   // só números, com DDI
  telefoneFmt: "(35) 99989-3555",
  instagram: "",               // só o usuário, sem @. Ex: "bodegapocos"
  endereco: "Av. Champagnat, 355 – São Domingos, Poços de Caldas – MG, 37701-860",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bodega%2C+Av.+Champagnat%2C+355+-+S%C3%A3o+Domingos%2C+Po%C3%A7os+de+Caldas+-+MG%2C+37701-860",
  mapEmbed: "https://maps.google.com/maps?q=Bodega%2C+Av.+Champagnat%2C+355%2C+S%C3%A3o+Domingos%2C+Po%C3%A7os+de+Caldas+-+MG&z=16&output=embed",
  // Horário por dia da semana (0 = domingo … 6 = sábado). null = fechado.
  // Horas em formato 24h; 24 significa meia-noite.
  funcionamento: {
    0: null,
    1: null,
    2: [16, 23],
    3: [16, 23],
    4: [16, 23],
    5: [16, 24],
    6: [16, 24],
  },
};

const CARDAPIO = [
  {
    id: "fondues",
    titulo: "Fondues",
    nav: "Fondues",
    intro:
      "Nossos fondues nasceram da nossa paixão por queijos e sabores artesanais. Dessa paixão surgiu a parceria com o chef Thiago Nishida, formado em gastronomia e chef de cozinha há mais de 20 anos, que já trabalhou ao lado do chef Olivier Anquier e em restaurantes duas estrelas Michelin em Sion, na Suíça. Todos os nossos fondues são receitas exclusivas da Bodega.",
    itens: [
      {
        nome: "Cinco Queijos",
        preco: 250,
        desc: "Elaborado com os queijos Mantiqueira, Porão, Tulha, Alagoa e Canastra, criando um fondue intenso, cremoso e cheio de personalidade. Acompanha filé mignon, filé de frango, filé mignon suíno, linguiça fina, brócolis, batata, tomate cereja, pêra e pão italiano.",
        destaque: true,
      },
      {
        nome: "Chocolate com Doce de Leite",
        preco: 195,
        desc: "Uma combinação sofisticada de chocolate nobre meio amargo e doce de leite Aviação, criando um fondue cremoso e irresistível. Servido com frutas frescas, marshmallow, canudos de wafer e pão italiano.",
      },
      {
        nome: "Dois Amores",
        preco: 220,
        desc: "Metade chocolate nobre branco, metade creme de avelã: uma combinação perfeita entre suavidade e intensidade. O lado branco ganha uma finalização especial com leite Ninho polvilhado. Servido com frutas frescas, marshmallow, canudos de wafer e pão italiano.",
      },
    ],
  },
  {
    id: "entradas",
    titulo: "Entradas",
    nav: "Entradas",
    itens: [
      { nome: "Sopa de Tomate", preco: 40, desc: "Sopa de tomate assado com legumes caramelizados, textura cremosa e sabor profundo. Acompanha pão italiano com grana padano gratinado." },
      { nome: "Carpaccio", preco: 60, desc: "Rosbife de mignon servido com homus e rúcula. Finalizado com parmesão ralado. Acompanha pães italianos." },
      { nome: "Dueto", preco: 60, desc: "Bruschettas com quatro opções de recheio (queijos especiais, presunto parma, caprese ou cogumelos). Escolha duas opções." },
    ],
  },
  {
    id: "principais",
    titulo: "Principais",
    nav: "Principais",
    aviso: "Não fazemos troca de ingredientes.",
    itens: [
      { nome: "Tagliatelle al Sugo", preco: 55, desc: "Massa artesanal ao molho sugo. Acompanha tiras de mignon." },
      { nome: "Fetuccine do Chef", preco: 68, desc: "Massa artesanal envolvida em molho bechamel e gorgonzola, tiras de mignon e finalizada com nozes." },
      { nome: "Fetuccine Alagoa", preco: 70, desc: "Massa artesanal salteada na manteiga finalizada com parmesão Alagoa. Acompanha medalhão de mignon." },
      { nome: "Risotto Blu", preco: 75, desc: "Arroz arbóreo incorporado com gorgonzola e damasco. Acompanha bife ancho." },
      { nome: "Risotto Speciale", preco: 75, desc: "Arroz arbóreo incorporado com parmesão Alagoa. Acompanha medalhão de mignon." },
      { nome: "Risotto Caprese", preco: 60, desc: "Arroz arbóreo incorporado com tomates assados da casa, muçarela de búfala e pesto de manjericão fresco." },
      { nome: "Escondidinho de Fraldinha", preco: 75, desc: "Camadas de fraldinha desfiada ao molho sugo artesanal e purê de mandioquinha-salsa enriquecido com queijo Canastra, gratinadas ao forno até atingir uma crosta dourada e irresistível." },
      { nome: "Lasanha Bolonhesa", preco: 68, desc: "Massa fresca em camadas recheada com molho bolonhesa, mix de queijos artesanais e molho ao sugo." },
      { nome: "Lasanha de Frango Cremoso", preco: 69, desc: "Massa fresca em camadas recheada com frango desfiado ao molho sugo e requeijão, envolvida no molho bechamel e mix de queijos especiais gratinados." },
    ],
  },
  {
    id: "porcoes",
    titulo: "Porções",
    nav: "Porções",
    aviso: "Embalagem para viagem R$ 3.",
    itens: [
      { nome: "Picanha Angus Argentina", preco: 150, desc: "Corte especial de picanha angus grelhada no broiler. Acompanha pão de alho artesanal, aioli de dijon, vinagrete, farofa e salada de rúcula fresca.", destaque: true },
      { nome: "Ancho com Fritas", preco: 115, desc: "Bife ancho especial grelhado no broiler. Acompanha fritas, farofa artesanal, vinagrete e molho de pimenta da casa." },
      { nome: "Linguiça Artesanal", preco: 115, desc: "Elaborada com 100% de pernil suíno, sem conservantes. Grelhada no azeite. Acompanha vinagrete, farofa e pães italianos." },
      { nome: "Panhoca", preco: 105, desc: "Pão italiano artesanal, recheado com blend de queijos artesanais gratinados no forno. Acompanha melaço e crocante de castanhas." },
      { nome: "Burrata", preco: 99, desc: "Queijo de mussarela de búfala, molho pesto artesanal, copa lombo, tomates assados e folhas de rúcula. Acompanha pães italianos." },
      { nome: "Pernil Mirepoix", preco: 80, desc: "Pernil suíno desfiado e suculento envolto em mirepoix. Acompanha batata canoa crocante, pães italianos e geleia de abacaxi com pimenta." },
      { nome: "Carne Seca com Mandioca", preco: 70, desc: "Carne seca artesanal desfiada puxada na manteiga, servida com mandioca frita ou cozida." },
      { nome: "Isca de Tilápia", preco: 65, desc: "Filé de tilápia com empanamento duplo na farinha panko. Acompanha aioli de limão siciliano." },
      { nome: "Croquete de Fraldinha", preco: 50, desc: "Fraldinha cozida e desfiada, empanamento duplo na farinha panko. Acompanha aioli de dijon artesanal." },
      { nome: "Torresmo", preco: 45, desc: "Barriga de porco assada lentamente e frita na hora, crocante por fora e macia por dentro. Acompanha molho de goiabada artesanal." },
      { nome: "Batata Frita", preco: 35, desc: "Batata palito com nuvem de parmesão grana padano." },
      { nome: "Amendoim da Tininha", preco: 12, desc: "Amendoim artesanal torrado e temperado." },
    ],
  },
  {
    id: "pizzas",
    titulo: "Pizzas",
    nav: "Pizzas",
    intro: "Massa artesanal de longa fermentação e molho de tomate feito na casa.",
    itens: [
      { nome: "Margherita", preco: 60, desc: "Molho de tomate artesanal, mussarela, Canastra e tomate cereja. Finalizada com manjericão fresco." },
      { nome: "Italiana", preco: 75, desc: "Molho de tomate artesanal, mussarela, Canastra e salame italiano." },
      { nome: "Especiale do Gui", preco: 115, desc: "Molho de tomate artesanal, mussarela, Canastra, presunto parma, tomates assados e rúcula fresca." },
    ],
  },
  {
    id: "sobremesas",
    titulo: "Sobremesas",
    nav: "Sobremesas",
    itens: [
      { nome: "Torta Fudge", preco: 45, desc: "Torta cremosa de chocolate meio amargo coberta com brigadeiro de colher e crumble de castanhas." },
      { nome: "Banana Foster", preco: 45, desc: "Base de pão de ló, banana caramelizada em calda amanteigada de açúcar mascavo flambada no conhaque, sorvete de laranja, crumble de castanhas e doce de leite." },
    ],
  },
  {
    id: "tabua",
    titulo: "Charcutarias & Queijos",
    nav: "Tábua",
    intro: "Monte sua experiência: escolha entre nossa seleção de charcutarias e queijos especiais e crie uma tábua única, do seu jeito.",
    grupos: [
      {
        subtitulo: "Charcutarias",
        itens: [
          { nome: "Salame Ceratti", medida: "100 g", preco: 35 },
          { nome: "Presunto Cru Ceratti", medida: "100 g", preco: 45, desc: "Maturado naturalmente por 12 meses seguindo os métodos tradicionais da charcutaria italiana." },
          { nome: "Lombo Defumado", medida: "50 g", preco: 20, desc: "Receita autoral. Fica 20 dias no tempero a vácuo em cura seca, depois passa pela defumação natural por 12 h com lenha de laranjeira." },
          { nome: "Copa Lombo Maturada", medida: "50 g", preco: 20, desc: "Temperos caseiros e especiarias. Fica 60 dias maturando em câmara fria." },
          { nome: "Copa Lombo Defumada", medida: "50 g", preco: 20, desc: "Curada nos temperos e embalada a vácuo durante 15 dias, depois defumação natural por 12 h com lenhas de árvores frutíferas." },
        ],
      },
      {
        subtitulo: "Queijos",
        itens: [
          { nome: "Canastra", medida: "50 g", preco: 9, desc: "Típico queijo brasileiro, da Serra da Canastra, em Minas Gerais. Carrega mais de 200 anos de tradição, preservando suas particularidades regionais." },
          { nome: "Alagoa", medida: "50 g", preco: 13, desc: "Queijo mineiro da região de Alagoa, com alto tempo de maturação e notas semelhantes às do parmesão, preservando as nuances do bom e velho queijo mineiro." },
          { nome: "Mantiqueira", medida: "50 g", preco: 15, desc: "Baixa acidez e cremosidade média, produzido a partir do leite de vacas holandesas e maturado por aproximadamente 3 meses." },
          { nome: "Gorgonzola", medida: "50 g", preco: 20, desc: "Queijo de mofo azul, caracterizado por sua textura cremosa e sabor marcante." },
          { nome: "Porão", medida: "50 g", preco: 20, desc: "Massa semidura, com presença de olhaduras e paladar amanteigado, maturado por aproximadamente cinco meses." },
          { nome: "Tulha", medida: "50 g", preco: 25, desc: "Maturado por 12 meses, massa quebradiça com cristais e notas frutadas. Ouro no World Cheese Awards e ouro por 2 anos consecutivos no Prêmio Queijos Brasil." },
          { nome: "Parmesão tipo Grana Padano", medida: "50 g", preco: 25, desc: "O rei dos queijos: segue a fórmula ancestral italiana e passa por ao menos doze meses de maturação, com coloração, textura, sabor e aroma inconfundíveis." },
        ],
      },
    ],
  },
  {
    id: "cafe",
    titulo: "Café Especial",
    nav: "Café",
    intro: "Fazenda Retiro Ponte Preta, Poços de Caldas – MG. Variedade Catucaí.",
    itens: [
      { nome: "Expresso Curto", preco: 7 },
      { nome: "Expresso Longo", preco: 14 },
      { nome: "Pacote 500 g", preco: 65 },
    ],
  },
];

const BEBIDAS = [
  {
    id: "drinks",
    titulo: "Drinks",
    nav: "Drinks",
    itens: [
      { nome: "Gin Tônica", preco: 35, desc: "Gin, água tônica e toque cítrico." },
      { nome: "Carajillo", preco: 42, desc: "Licor 43 e café expresso." },
      { nome: "Moscow Mule", preco: 34, desc: "Vodka, limão, xarope simples, extrato de gengibre, bitter e espuma de gengibre." },
      { nome: "Negroni", preco: 38, desc: "Gin, bitter e vermute Carpano." },
      { nome: "Boulevardier", preco: 40, desc: "Bourbon, bitter e vermute Carpano." },
      { nome: "Fitzgerald", preco: 34, desc: "Gin, limão siciliano, xarope simples e Angostura." },
      { nome: "Whisky Sour", preco: 36, desc: "Bourbon, limão, xarope simples e albumina." },
      { nome: "French 75", preco: 36, desc: "Gin, limão siciliano, xarope simples e espumante brut." },
      { nome: "Aperol Spritz", preco: 40, desc: "Aperol, espumante brut e água com gás." },
      { nome: "Mojito", preco: 35, desc: "Rum branco, limão, xarope de hortelã artesanal e água com gás." },
      { nome: "Macunaíma", preco: 34, desc: "Cachaça premiada Âmago, limão, açúcar e Fernet." },
    ],
  },
  {
    id: "autorais",
    titulo: "Drinks Autorais",
    nav: "Autorais",
    intro: "Coquetelaria autoral, feita para ser sentida. Por Leonardo Willian.",
    itens: [
      { nome: "Sweet Spot", preco: 38, tag: "Aperol, caramelo salgado, limão siciliano e licor de morango", perfil: "Levemente doce, levemente amargo", desc: "Aperol, licor de morango artesanal, xarope de caramelo salgado, suco de limão siciliano e orange bitters Angostura." },
      { nome: "Plot Twist", preco: 40, tag: "Rum, abacaxi, caramelo salgado e canela", perfil: "Cítrico, quente, frutado", desc: "Rum envelhecido, cordial de abacaxi, xarope de caramelo salgado e chá estabilizado de canela." },
      { nome: "Smokin' Pig", preco: 48, tag: "Bourbon, bacon, caramelo salgado e água com gás", perfil: "Salgado, umami, defumado", desc: "Fat wash de bacon em bourbon, xarope de caramelo salgado, orange e aromatic bitters Angostura, solução ácida, água com gás e defumado de casca de laranja.", destaque: true },
      { nome: "Arid", preco: 42, tag: "Caju, gin e vermute", perfil: "Seco, adulto, equilibrado", desc: "Cordial de caju, gin Tanqueray, vermute dry e aromatic bitters Angostura." },
      { nome: "Brio", preco: 40, tag: "Maracujá, vodka, limão, albumina e baunilha", perfil: "Cítrico, refrescante, levemente doce, cremoso e aromático", desc: "Vodka Ketel One, purê de maracujá, xarope cítrico de limão, albumina e farinha de baunilha." },
    ],
  },
  {
    id: "sem-alcool",
    titulo: "Não Alcoólicos",
    nav: "Sem álcool",
    itens: [
      { nome: "Yellow", preco: 22, desc: "Cordial de abacaxi, chá de canela estabilizado, xarope de caramelo salgado e twist de limão siciliano." },
      { nome: "Orange", preco: 22, desc: "Oleo-saccharum de tangerina, chá de pimenta rosa estabilizado, purê de maracujá e twist de laranja." },
      { nome: "Red", preco: 22, desc: "Cordial de melancia, chá de hibisco estabilizado, purê de maracujá e água com gás." },
      { nome: "White", preco: 22, desc: "Shrub de maçã verde, suco de limão siciliano e água tônica zero açúcar." },
      { nome: "Green", preco: 22, desc: "Xarope de hortelã, suco de limão taiti, hortelã, capim-limão e água com gás." },
      { nome: "Sucos Naturais", preco: 9, desc: "Laranja, uva e limão." },
      { nome: "Água com ou sem gás", preco: 6 },
      { nome: "Água Tônica", preco: 9 },
      { nome: "Limoneto", preco: 9 },
      { nome: "H2O", preco: 9 },
      { nome: "Refrigerante lata", preco: 9 },
    ],
  },
  {
    id: "cervejas",
    titulo: "Cervejas",
    nav: "Cervejas",
    grupos: [
      {
        subtitulo: "Long Neck",
        compacto: true,
        itens: [
          { nome: "Heineken", preco: 11 },
          { nome: "Heineken Zero", preco: 11 },
          { nome: "Stella Pure Gold", preco: 11 },
          { nome: "Corona", preco: 11 },
          { nome: "Corona Zero", preco: 11 },
          { nome: "Amstel Ultra", preco: 11 },
          { nome: "Hoegaarden", preco: 15 },
          { nome: "Blue Moon", preco: 18 },
        ],
      },
      {
        subtitulo: "600 ml",
        compacto: true,
        itens: [
          { nome: "Heineken", preco: 18 },
          { nome: "Stella Artois", preco: 17 },
          { nome: "Original", preco: 16 },
          { nome: "Baden Baden", preco: 22 },
        ],
      },
      {
        subtitulo: "Chopp",
        aviso: "Consultar disponibilidade.",
        tabela: {
          colunas: ["300 ml", "500 ml"],
          linhas: [
            { nome: "Heineken", precos: [12, 17] },
            { nome: "Amstel", precos: [10, 15] },
            { nome: "Brahma", precos: [12, 17] },
          ],
        },
      },
    ],
  },
  {
    id: "destilados",
    titulo: "Caipirinhas & Destilados",
    nav: "Destilados",
    grupos: [
      {
        subtitulo: "Caipirinhas",
        tabela: {
          colunas: ["Cachaça", "Vodka"],
          linhas: [
            { nome: "3 limões com rapadura", precos: [30, 35] },
            { nome: "Limão taiti", precos: [20, 25] },
            { nome: "Morango", precos: [30, 35] },
            { nome: "Maracujá", precos: [25, 30] },
          ],
        },
      },
      {
        subtitulo: "Destilados",
        compacto: true,
        itens: [
          { nome: "Whisky Jack Daniel's", preco: 27 },
          { nome: "Whisky Singleton", preco: 50 },
          { nome: "Campari", preco: 20 },
          { nome: "Cachaça Reserva Minas Uai", preco: 9 },
          { nome: "Cachaça Reserva Âmago", preco: 9 },
          { nome: "Tequila Jose Cuervo Ouro", preco: 25 },
          { nome: "Licor 43", preco: 30 },
        ],
      },
    ],
  },
];

// pais: BR, PT, IT, AR, CL, UY, ES, FR
const VINHOS = [
  {
    id: "espumantes",
    titulo: "Espumantes",
    itens: [
      { pais: "BR", nome: "Arpuro Moscato Brut", preco: 142, notas: "Notas de frutas brancas, flor de laranjeira, abacaxi e maracujá. Perlage fina e persistente. Método champenoise.", alc: "11,5%" },
      { pais: "BR", nome: "Casa Geraldo Viognier Brut", preco: 138, notas: "Notas de damasco maduro, pêssego branco e flores brancas. Produzido no método charmat.", alc: "12%" },
      { pais: "BR", nome: "Davo Branco Nature", preco: 145, notas: "Notas de pão tostado, brioches e torrefação. Perlage fino e persistente.", alc: "12%" },
      { pais: "BR", nome: "Maria Maria Sous Les Scaliers", preco: 194, notas: "Notas de panificação, nuances de frutas brancas, como maçã verde. Retrogosto longo e persistente.", alc: "12,8%" },
      { pais: "BR", nome: "Mirante do Vale", preco: 150, notas: "Em boca, equilibrado com perlage aveludada, acidez delicada, complexidade e persistência gustativa.", alc: "12,5%" },
      { pais: "BR", nome: "Primeira Estrada Carvalho Branco", preco: 185, notas: "Notas de manteiga e pão tostado com acidez e final longo.", alc: "12%" },
    ],
  },
  {
    id: "brancos",
    titulo: "Brancos",
    itens: [
      { pais: "PT", nome: "Fonte Sagrada Vinho Verde", preco: 105, notas: "Notas de frutas cítricas, florais e ótima acidez.", alc: "10%" },
      { pais: "PT", nome: "Valemésio Vinho Verde", preco: 95, notas: "Fresco, jovem, com uma acidez equilibrada.", alc: "10%" },
      { pais: "BR", nome: "White Blend 3 Tons Casa Geraldo", preco: 95, notas: "Notas de maçã, pêra e abacaxi com toque floral e mineral.", alc: "11,8%" },
      { pais: "IT", nome: "Angelica Grillo Sicilia DOC", preco: 105, notas: "Fermentada em tanques de concreto, possui aromas vibrantes de frutas tropicais, toques minerais e florais.", alc: "14%" },
      { pais: "AR", nome: "Munay Torrontés", preco: 115, notas: "Notas de frutas tropicais e cítricas. Fresco, jovem e frutado.", alc: "13%" },
      { pais: "BR", nome: "Davo Branco Chardonnay", preco: 120, notas: "Notas de frutas brancas como maçã verde e pêssego.", alc: "12,9%" },
      { pais: "BR", nome: "Primeira Estrada Sauvignon Blanc", preco: 145, notas: "Aromas de maracujá fresco, grama cortada e toques minerais.", alc: "13,4%" },
      { pais: "BR", nome: "Primeira Estrada Chardonnay", preco: 150, notas: "Notas de frutas cítricas, corpo leve e retrogosto longo.", alc: "12,8%" },
      { pais: "BR", nome: "Barbara Eliodora Sauvignon Blanc", preco: 155, notas: "Notas de doce de maracujá e um leve toque de grama cortada.", alc: "13,9%" },
      { pais: "BR", nome: "Kiara Sauvignon Blanc Maria Maria", preco: 185, notas: "Leve toque herbáceo e fruta tropical sutil, destacando maracujá. Final longo e persistente.", alc: "13,4%" },
      { pais: "BR", nome: "Arpuro Sauvignon Blanc", preco: 190, notas: "Notas de ortiga e menta com aromas frescos e frutados.", alc: "12,5%" },
      { pais: "BR", nome: "Três Batalhas Sauvignon Blanc", preco: 240, notas: "Notas de frutas tropicais, pimentão, vegetais e minerais com retrogosto prolongado.", alc: "13,5%" },
      { pais: "BR", nome: "Profano Branco Terra Nossa", preco: 245, notas: "Notas de pera, floral, rosa branca, damasco e cítrico. Passagem em barrica de carvalho francês.", alc: "13,5%" },
    ],
  },
  {
    id: "roses",
    titulo: "Rosés",
    itens: [
      { pais: "BR", nome: "Pink Blend 3 Tons Casa Geraldo", preco: 95, notas: "Notas sutis de flores brancas e de frutas vermelhas, como cereja e framboesa.", alc: "11,5%" },
      { pais: "CL", nome: "Vigia Superior Rosé de Merlot", preco: 110, notas: "Nota refrescante e leve com aroma de frutas vermelhas frescas.", alc: "13%" },
      { pais: "IT", nome: "Kaori Sangiovese", preco: 125, notas: "Notas de pasta de frutas amarelas e cítricas no final.", alc: "12%" },
      { pais: "BR", nome: "Davo Rosé Syrah", preco: 140, notas: "Notas de frutas brancas e vermelhas, com predominância de lichia e morango.", alc: "13,5%" },
      { pais: "BR", nome: "Primeira Estrada Syrah Rosé", preco: 140, notas: "Notas de lichia, morango e um leve toque floral, com frescor evidente.", alc: "13,5%" },
      { pais: "BR", nome: "Rosé Flor Barbara Eliodora", preco: 140, notas: "Notas de frutas brancas e vermelhas, como lichia, morango e pêssego.", alc: "12,4%" },
      { pais: "BR", nome: "Arpuro Rosé", preco: 175, notas: "Notas de frutas vermelhas, pêssego e floral.", alc: "12,5%" },
      { pais: "BR", nome: "Três Batalhas Rosé", preco: 195, notas: "Notas de morango, tutti-frutti e papaia com boa acidez e vivacidade em boca.", alc: "13,9%" },
    ],
  },
  {
    id: "tintos",
    titulo: "Tintos",
    itens: [
      { pais: "CL", nome: "Ilaia Reserva Cabernet Sauvignon", preco: 99, notas: "Notas de frutas negras maduras e toques de especiarias doces.", alc: "13,5%" },
      { pais: "CL", nome: "Ilaia Reserva Carmenere", preco: 99, notas: "Notas de frutas negras e especiarias, café e toques de terra úmida.", alc: "13,5%" },
      { pais: "CL", nome: "Ilaia Reserva Merlot", preco: 99, notas: "Notas leves de tostado e frutas vermelhas.", alc: "13,5%" },
      { pais: "PT", nome: "Terras de Pias", preco: 105, notas: "Frutado com leve tom de madeira.", alc: "13,5%" },
      { pais: "PT", nome: "EA Tinto", preco: 120, notas: "Vinho frutado, jovem e com ligeira adstringência.", alc: "14%" },
      { pais: "AR", nome: "Plan B Malbec", preco: 120, notas: "Notas de frutas roxas e toques sutis de baunilha e especiarias.", alc: "14,1%" },
      { pais: "FR", nome: "La Grive Musicienne Pinot Noir", preco: 125, notas: "Notas de frutas vermelhas maduras e ervas secas.", alc: "12,5%" },
      { pais: "UY", nome: "Dino Darnanelli Tannat", preco: 135, notas: "Taninos doces com notas de frutas vermelhas, pretas e flores.", alc: "12,6%" },
      { pais: "ES", nome: "Don Paulino Tinto", preco: 135, notas: "Notas de frutos vermelhos silvestres, cereja e alcaçuz.", alc: "13,7%" },
      { pais: "IT", nome: "Orlando Nero d'Avola DOC", preco: 140, notas: "Frutado com notas de cereja.", alc: "12,5%" },
      { pais: "IT", nome: "Stallone Primitivo Tarantino", preco: 140, notas: "Notas de frutas maduras e notas leves de canela.", alc: "13,5%" },
      { pais: "AR", nome: "Altus Malbec", preco: 145, notas: "Frutado com notas de ameixa e cerejas.", alc: "14%" },
      { pais: "BR", nome: "Casa Geraldo Syrah Reserva", preco: 145, notas: "Notas de frutas vermelhas maduras, aveludado, com taninos macios e redondos.", alc: "13,8%" },
      { pais: "BR", nome: "Davo Cabernet Franc", preco: 150, notas: "Notas de frutas negras maduras, pimenta negra, ervas e especiarias.", alc: "14,1%" },
      { pais: "BR", nome: "Primeira Estrada Syrah", preco: 155, notas: "Notas de ameixa seca, amora, romã e pimenta preta.", alc: "14,4%" },
      { pais: "BR", nome: "Casa Geraldo Reserva Malbec", preco: 165, notas: "Notas de frutas vermelhas maduras, chocolate, baunilha e especiarias.", alc: "14,3%" },
      { pais: "UY", nome: "Familia Dardanelli Marselan", preco: 165, notas: "Frutado com taninos doces e equilibrados.", alc: "13,5%" },
      { pais: "IT", nome: "Poggio Tosco Sangiovese", preco: 175, notas: "Puras frutas vermelhas frescas, especiarias e um toque de carvalho.", alc: "12,5%" },
      { pais: "BR", nome: "Barbara Eliodora Syrah", preco: 180, notas: "Notas de frutas vermelhas, especiaria, com taninos presentes e aveludados.", alc: "13,8%" },
      { pais: "BR", nome: "Profano Syrah Terra Nossa", preco: 187, notas: "Notas de frutas vermelhas, amoras, ameixa e toques de especiarias.", alc: "14%" },
      { pais: "BR", nome: "Barbara Eliodora Syrah Cuvée", preco: 200, notas: "Reunindo três safras excepcionais: notas de frutas negras maduras, pimenta rosa e cravo.", alc: "14,2%" },
      { pais: "BR", nome: "Junia Syrah Maria Maria", preco: 218, notas: "Notas de frutas vermelhas e negras, jabuticaba, couro e especiarias.", alc: "14,4%" },
      { pais: "AR", nome: "Anaia Cabernet Sauvignon", preco: 220, notas: "Notas de frutas pretas e especiarias.", alc: "14%" },
      { pais: "BR", nome: "Três Batalhas Syrah", preco: 220, notas: "Notas de frutas pretas e vermelhas, taninos macios, excelente acidez e final aveludado.", alc: "13,2%" },
      { pais: "BR", nome: "Arpuro Pix", preco: 257, notas: "Notas de frutas vermelhas maduras, groselha, flores e especiarias. Técnica de fermentação semicarbônica.", alc: "12,8%" },
      { pais: "BR", nome: "Cateto Terra Nossa", preco: 269, notas: "Notas de frutas do bosque e violetas, de corpo médio, com taninos maduros e redondos.", alc: "14%" },
      { pais: "BR", nome: "Arpuro Syrah Concreto", preco: 285, notas: "Notas marcantes de frutas negras, especiarias e uma delicada mineralidade. Fermentado em tanques de concreto.", alc: "14%" },
      { pais: "BR", nome: "Primeira Estrada Gran Reserva", preco: 299, notas: "Notas de ameixa, cassis, pimenta e torrefação. Estágio de 14 meses em carvalho francês.", alc: "15,2%" },
      { pais: "BR", nome: "Hera Gran Reserva Maria Maria", preco: 345, notas: "Notas de madeira, frutas negras e especiarias. Passagem por barricas de carvalho francês.", alc: "15%" },
      { pais: "BR", nome: "Três Batalhas Trincheira", preco: 345, notas: "Notas de azeitona, baunilha, chocolate amargo e frutas vermelhas. Envelhecido 12 meses em carvalho francês.", alc: "13,2%" },
      { pais: "BR", nome: "Davo Syrah Gran Reserva", preco: 349, notas: "Notas de frutas negras em compota com toque de baunilha, coco queimado e chocolate.", alc: "13,5%" },
      { pais: "BR", nome: "Ermitage Barbara Eliodora", preco: 350, notas: "Acidez viva, taninos agradáveis, bom corpo e retrogosto longo. Estagia 12 meses em carvalho francês.", alc: "14,8%" },
      { pais: "BR", nome: "Cabernet Franc Terra Nossa", preco: 395, notas: "Notas de ameixa preta, framboesa, compota de morango e carne de caça.", alc: "14,5%" },
      { pais: "BR", nome: "Syrah Viognier Terra Nossa", preco: 395, notas: "Notas de frutas vermelhas, especiarias e ameixa. Envelhecido em barricas de carvalho francês por 14 meses.", alc: "14%" },
    ],
  },
  {
    id: "tacas",
    titulo: "Taças",
    aviso: "Consultar vinho disponível.",
    itens: [
      { nome: "Vinho Branco", medida: "150 ml", preco: 25 },
      { nome: "Vinho Tinto", medida: "150 ml", preco: 25 },
    ],
  },
];

const PAISES = {
  BR: "Brasil",
  PT: "Portugal",
  IT: "Itália",
  AR: "Argentina",
  CL: "Chile",
  UY: "Uruguai",
  ES: "Espanha",
  FR: "França",
};
