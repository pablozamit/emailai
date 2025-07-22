import type { PromptData, GeneratedEmail, Feedback } from "../types";

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
      apiKey,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error en la comunicación con el servidor');
  }

  return await response.json();
};

export const generateSuggestion = async (instruction: string, apiKey: string): Promise<string> => {
    // This function will also need to be moved to a serverless function
    // For now, we will leave it as is, but it should be refactored
    // to call a new endpoint e.g. /api/generate-suggestion
    return "Suggestion generation needs to be migrated to the backend.";
}
