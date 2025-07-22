import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { PromptData, GeneratedEmail, Feedback } from "../types";

const getAiClient = (apiKey: string) => {
  if (!apiKey) {
    throw new Error("API key not provided.");
  }
  return new GoogleGenAI({ apiKey });
};

const buildMainPrompt = (data: PromptData, emailCount: number, feedbackHistory: Feedback[]): string => {
  const formulas = Object.entries(data.formulas)
    .map(([key, value]) => `- ${key}: ${value}/10`)
    .join("\n");

  const subjectOptions = Object.entries(data.subjectOptions)
    .filter(([, checked]) => checked)
    .map(([key]) => key)
    .join(", ");
    
  const lengthMap = {
    corto: 'Corto/Directo (3 párrafos o menos)',
    normal: 'Normal (entre 4 y 7 párrafos)',
    largo: 'Largo (más de 7 párrafos, estilo newsletter en profundidad)',
  };

  const enabledServices = data.serviceReferences.filter(s => s.enabled);
  let servicesPrompt = "";
  if (enabledServices.length > 0) {
    servicesPrompt = `
**SERVICIOS A REFERENCIAR (opcional):**
Si es relevante y encaja de forma natural en el email, menciona sutilmente uno o más de los siguientes servicios:
${enabledServices.map(s => `- Título: ${s.title}, Descripción: ${s.description}, Link: ${s.link}`).join('\n')}
`;
  }

  let feedbackPrompt = "";
  if (feedbackHistory.length > 0) {
    feedbackPrompt = `
---
**HISTORIAL DE FEEDBACK PARA MEJORAR:**
He generado emails anteriormente. Por favor, ten en cuenta el siguiente feedback de mis emails anteriores para mejorar esta nueva generación.

${feedbackHistory.map((fb, index) => `
**Feedback Email Anterior #${index + 1}:**
- Puntuación General: ${fb.overallRating}/5
${fb.text ? `- Comentario de texto: ${fb.text}` : ''}
`).join('\n')}

Aplica las lecciones de este feedback para generar un mejor resultado esta vez.
---
`;
  }

  const imagePrompt = () => {
    if (data.imagePlacement.imageData) {
      return `El usuario ha subido una imagen llamada '${data.imagePlacement.imageData.name}'. Debes insertar un marcador de posición, exactamente como este: [IMAGEN: ${data.imagePlacement.imageData.name}], en el lugar más apropiado y natural dentro del cuerpo del email.`;
    }
    if (data.imagePlacement.auto) {
      return 'Incluye una sugerencia de imagen donde creas que mejor encaja en el cuerpo del email, descríbela entre corchetes, ej: [Imagen de una persona trabajando en un portátil con una taza de café al lado].';
    }
    if (data.imagePlacement.description) {
      return `El usuario quiere una imagen en un lugar específico. Incluye un marcador para ella siguiendo esta instrucción: ${data.imagePlacement.description}`;
    }
    return 'No incluir imágenes.';
  };

  return `
Eres un copywriter experto en email marketing, especializado en crear newsletters que convierten. Tu tarea es generar ${emailCount} variante(s) de un email siguiendo estas instrucciones al pie de la letra.

${feedbackPrompt}

**1. ESTRATEGIA Y OBJETIVO:**
- Tema o Premisa del email (el ángulo narrativo central): ${data.topic}
- Objetivo (qué quiero que haga el lector): ${data.objective}

**2. AUDIENCIA (AVATAR):**
- Descripción del avatar: ${data.avatar}
- Dolores del avatar: ${data.pains}

**3. CONTENIDO Y ESTRUCTURA:**
- Detalles clave a incluir (opcional): ${data.details || 'No se proporcionaron detalles específicos.'}
- CTA (Llamada a la acción): ${data.cta}
${servicesPrompt}
${data.anecdote ? `- Anécdota a incluir: ${data.anecdote}` : ''}
${data.testimonial ? `- Testimonio a incluir: ${data.testimonial}` : ''}
${data.postscript ? `- Postdata (P.S.): ${data.postscript}` : ''}

**4. ESTILO Y TONO:**
- Tono y voz: ${data.toneDescription}
- Ejemplos de frases con mi tono: "${data.toneExamples}"
- Principio de copywriting a aplicar: ${data.copywritingPrinciple}

**5. FÓRMULAS DE COPYWRITING (Panel DJ):**
Debes mezclar estas fórmulas con la siguiente "intensidad" (0=nada, 10=máximo):
${formulas}

**6. REGLAS ESTRUCTURALES Y DE FORMATO:**
- Longitud del email: ${lengthMap[data.length]}
- Longitud de párrafo (0=muy corto, 1=largo): ${data.paragraphLength.toFixed(1)}. Un 0.4 corresponde a párrafos de 2 frases (unas 15 palabras). Ajusta la longitud de los párrafos en consecuencia.
- Qué NO hacer (Negative Prompt): ${data.negativePrompt}

**7. ASUNTO DEL EMAIL:**
- Genera un asunto basado en estas técnicas: ${subjectOptions || 'un resumen del contenido'}.

**8. IMAGEN:**
- ${imagePrompt()}

**9. FORMATO DE RESPUESTA:**
Responde OBLIGATORIAMENTE con un array JSON. Cada elemento del array debe ser un objeto con dos claves: "subject" y "body". El "body" debe estar en texto plano con saltos de línea donde corresponda (párrafos separados por \\n\\n). No incluyas nada fuera del array JSON.

Ejemplo de formato de respuesta:
[
  {
    "subject": "Este es el asunto del primer email",
    "body": "Este es el primer párrafo del cuerpo del email.\\n\\nEste es el segundo párrafo."
  }
]
`;
};

export const generateEmailCopy = async (
  data: PromptData,
  emailCount: number,
  feedbackHistory: Feedback[],
  apiKey: string
): Promise<GeneratedEmail[]> => {
  const prompt = buildMainPrompt(data, emailCount, feedbackHistory);
  const ai = getAiClient(apiKey);

  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        subject: { type: Type.STRING },
        body: { type: Type.STRING },
      },
      required: ["subject", "body"],
    },
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text;
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Error generating email copy:", error);
    if (error instanceof SyntaxError) {
        throw new Error("Failed to parse AI response. The response was not valid JSON.");
    }
    throw new Error("Failed to generate email copy from AI.");
  }
};


export const generateSuggestion = async (instruction: string, apiKey: string): Promise<string> => {
    if (instruction.includes("No hay suficiente contexto")) {
        return "Por favor, rellena primero el tema o el objetivo para obtener una sugerencia.";
    }
    const ai = getAiClient(apiKey);
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: instruction,
            config: {
                temperature: 0.7,
            }
        });
        // Clean the response: remove potential markdown and surrounding quotes
        return response.text.trim().replace(/^["']|["']$/g, '').replace(/`/g, '');
    } catch(error) {
        console.error("Error generating suggestion:", error);
        return "No se pudo generar una sugerencia.";
    }
}
