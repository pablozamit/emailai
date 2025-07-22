import { PromptData } from "./types";

export const COPYWRITING_FORMULAS: { name: string; description: string }[] = [
  { name: "AIDA", description: "Atención, Interés, Deseo, Acción." },
  { name: "PAS", description: "Problema, Agitación, Solución." },
  { name: "Storytelling", description: "Contar una historia que conecte emocionalmente." },
  { name: "4P", description: "Picture, Promise, Prove, Push." },
  { name: "BAB", description: "Before, After, Bridge." },
  { name: "FAB", description: "Features, Advantages, Benefits." },
  { name: "QUEST", description: "Qualify, Understand, Educate, Stimulate, Transition." },
  { name: "SLAP", description: "Stop, Look, Act, Purchase." },
  { name: "SUCCESs", description: "Simple, Unexpected, Concrete, Credible, Emotional, Stories." },
  { name: "The 4 U's", description: "Useful, Urgent, Unique, Ultra-specific." },
];

export const SUBJECT_OPTIONS = {
  intriga: "Intriga (generar curiosidad)",
  dolor: "Dolor (apelar a un dolor del avatar)",
  shock: "Shock (sorpresa, contraste, etc)",
  resumen: "Resumen (el email resumido en pocas palabras)",
  actualidad: "Actualidad (tocar temas de moda)"
};

export const EXAMPLE_PROMPT_DATA: PromptData = {
  topic: 'Usar un testimonio potente de un referente para justificar una inminente subida de precio y crear urgencia.',
  objective: 'Que el lector compre el curso "El mejor negocio del mundo" antes de que suba de precio y desaparezca un bonus valioso.',
  details: 'El curso cuesta 120€. El bonus es una entrevista exclusiva sobre "Cambiar palabras para sacudir cerebros". La oferta termina el sábado a las 23:59.',
  negativePrompt: 'No sonar como un vendedor de humo. Ser directo, un poco crudo y muy convincente.',
  copywritingPrinciple: 'Usar la urgencia (fecha límite) y la prueba social (testimonios de referentes) para impulsar la acción. El bonus que desaparece crea escasez.',
  formulas: COPYWRITING_FORMULAS.reduce((acc, f) => {
    if (f.name === 'Storytelling' || f.name === 'PAS') {
        acc[f.name] = 8;
    } else {
        acc[f.name] = Math.floor(Math.random() * 4);
    }
    return acc;
  }, {}),
  toneDescription: 'Directo, sin rodeos, un poco provocador pero increíblemente seguro de sí mismo. Tono de experto que ha descubierto algo valioso y no tiene tiempo que perder.',
  toneExamples: '"Lo que te voy a contar en este email no es poca cosa, sino mucha cosa."\n"Si eso no es la prueba definitiva de lo desproporcionadamente lucrativo que es este método, no sé qué más decirte."',
  length: 'largo',
  paragraphLength: 0.3,
  cta: 'El mejor negocio del mundo, destripado: [link]',
  postscript: 'PD: solo hasta el sábado, 26 de julio a las 23:59.\nPD 2: toda la información, arriba. En serio, te interesa, poca broma.',
  subjectOptions: { intriga: true, dolor: false, shock: true, resumen: false, actualidad: false },
  avatar: 'Emprendedores, vendedores ambiciosos y gente de negocios que busca métodos probados para escalar sus ventas y mejorar su comunicación.',
  pains: 'Están cansados de estrategias de marketing que no funcionan, se sienten estancados en sus ventas y buscan una ventaja competitiva real que les permita vender más con menos esfuerzo.',
  anecdote: 'Encontré una entrevista a una emprendedora que me hizo flipar. Investigué más y más, y me di cuenta de que tenía un talento natural para los negocios. Copié todo lo que pude y eso cambió mi trayectoria, permitiéndome vender más yo solo que antes con un equipo de 12 personas.',
  testimonial: '"Acabo de terminar el curso del mejor negocio y solo te digo que si no veo que le subes el precio es que no he entendido bien tu mensaje. Puro oro. Peta cabezas." - Daniel Marín Carrillo, danimarin.com',
  imagePlacement: { auto: true, description: '', imageData: null },
  serviceReferences: [
      { id: 1, title: 'Asesoría Personalizada', description: 'Una sesión 1 a 1 para resolver tus dudas.', link: 'https://ejemplo.com/asesoria', enabled: true },
  ]
};