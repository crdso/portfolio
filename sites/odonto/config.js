/* =====================================================================
   CONFIGURAÇÃO DO SITE  (é o único arquivo que você precisa editar)
   Depois de editar, publique de novo (veja o LEIA-ME.txt).
   ===================================================================== */
const WHATSAPP = "xxxxxxxxxxx";      // DDI + DDD + número, só dígitos
const SERVICES = [
  {short:"Check-up",    name:"Check-up odontológico", desc:"Avaliação completa da saúde da boca, com orientação e plano de cuidado.", price:""},
  {short:"Limpeza",     name:"Limpeza dental",        desc:"Remoção de placa e tártaro para uma boca limpa e saudável.",              price:""},
  {short:"Restauração", name:"Restauração",           desc:"Recuperação de dentes com cárie, com resultado natural.",                 price:""},
  {short:"Gengiva",     name:"Tratamento de gengiva", desc:"Cuidado para gengivas inflamadas, sensíveis ou que sangram.",             price:""},
  {short:"Contenção",   name:"Contenção",             desc:"Manutenção do alinhamento dos dentes após o tratamento ortodôntico.",     price:""}
];
const SCHEDULE = {
  weekdays:[1,2,3,4,5],     // 0 = domingo ... 6 = sábado
  open:"08:00", close:"18:00",
  slot:60,                  // duração de cada horário, em minutos
  breaks:[["12:00","14:00"]],
  daysAhead:21,             // quantos dias à frente aparecem
  minNoticeHours:3,         // antecedência mínima
  blocked:[]                // ocupados: "2026-09-25" (dia todo) ou "2026-09-25 10:00"
};
const ADDRESS = "A definir";          // endereço do consultório
const CRO = "a informar";             // número do CRO (ex.: "CRO-SP 12345")
const ART = [9, 56, 78, 96, 118, 30, 70, 110];  // quadros do vídeo usados nas capas dos cards
