import type { PromptData, GeneratedEmail, Feedback } from "../types";

/**
 * Llama al endpoint del backend para generar el cuerpo y asunto del email.
 * @param data - Los datos del prompt del usuario.
 * @param emailCount - El número de variantes de email a generar.
 * @param feedbackHistory - El historial de feedback del usuario.
 * @param apiKey - La API Key del usuario (se enviará al backend para validación/uso).
 * @returns Una promesa que resuelve a un array de emails generados.
 */
export const generateEmailCopy = async (
  data: PromptData,
  emailCount: number,
  feedbackHistory: Feedback[],
  apiKey: string
): Promise<GeneratedEmail[]> => {
  const response = await fetch('/api/generate-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      promptData: data,
      emailCount,
      feedbackHistory,
      apiKey, // Se envía al backend de forma segura
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error en la comunicación con el servidor' }));
    throw new Error(errorData.message || 'Ocurrió un error desconocido');
  }

  return await response.json();
};

/**
 * Llama al endpoint del backend para generar una sugerencia para un campo específico.
 * @param instruction - El prompt para generar la sugerencia.
 * @param apiKey - La API Key del usuario.
 * @returns Una promesa que resuelve a un string con la sugerencia.
 */
export const generateSuggestion = async (instruction: string, apiKey: string): Promise<string> => {
  if (instruction.includes("No hay suficiente contexto")) {
    return "Por favor, rellena primero el tema o el objetivo para obtener una sugerencia.";
  }
  
  const response = await fetch('/api/generate-suggestion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      instruction,
      apiKey,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error al generar la sugerencia' }));
    throw new Error(errorData.message || 'Ocurrió un error desconocido');
  }
  
  const data = await response.json();
  return data.suggestion;
};