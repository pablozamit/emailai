export interface ServiceReference {
  id: number;
  title: string;
  description: string;
  link: string;
  enabled: boolean;
}

export interface PromptData {
  [key: string]: any;
  topic: string;
  objective: string;
  details: string;
  negativePrompt: string;
  copywritingPrinciple: string;
  formulas: { [key: string]: number };
  toneDescription: string;
  toneExamples: string;
  length: 'corto' | 'normal' | 'largo';
  paragraphLength: number;
  cta: string;
  serviceReferences: ServiceReference[];
  postscript: string;
  subjectOptions: { [key: string]: boolean };
  avatar: string;
  pains: string;
  anecdote: string;
  testimonial: string;
  imagePlacement: {
    auto: boolean;
    description: string;
    imageData: {
      name: string;
      type: string;
      data: string; // base64
    } | null;
  };
}

export interface GeneratedEmail {
  subject: string;
  body: string;
}

export interface DetailedFeedback {
  [key: string]: {
    rating: number;
  };
}

export interface Feedback {
  overallRating: number;
  detailed?: DetailedFeedback;
  text?: string;
}
