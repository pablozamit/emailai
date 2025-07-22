
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Icon } from './ui/Icon';
import { Button } from './ui/Button';
import { Rating } from './Rating';
import { GeneratedEmail, Feedback } from '../types';

interface OutputSectionProps {
  emails: GeneratedEmail[];
  isLoading: boolean;
  error: string | null;
  onFeedbackSubmit: (feedback: Feedback, index: number) => void;
}

const EmailCard: React.FC<{ email: GeneratedEmail; index: number; onFeedbackSubmit: (feedback: Feedback, index: number) => void; }> = ({ email, index, onFeedbackSubmit }) => {
    const [copied, setCopied] = useState<'subject' | 'body' | 'all' | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [rating, setRating] = useState(0);
    const [textFeedback, setTextFeedback] = useState('');

    const handleCopy = (text: string, type: 'subject' | 'body' | 'all') => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleSubmitFeedback = () => {
        const feedback: Feedback = {
            overallRating: rating,
            text: textFeedback,
        };
        onFeedbackSubmit(feedback, index);
        setShowFeedback(false);
    };

    return (
        <Card className="mb-6 relative transition-shadow hover:shadow-lg">
             <div className="absolute top-4 right-4 flex gap-1">
                <button
                    onClick={() => handleCopy(`Asunto: ${email.subject}\n\n${email.body}`, 'all')}
                    className="p-2 text-gray-400 hover:bg-gray-100 hover:text-brand-primary rounded-full transition-colors"
                    aria-label="Copy email"
                >
                    {copied === 'all' ? <span className="text-xs text-green-600 px-1">¡Todo copiado!</span> : <Icon name="copy" className="w-5 h-5" />}
                </button>
             </div>
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-500 mb-1">Asunto:</h4>
              <p className="font-bold text-brand-text pr-12">{email.subject}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-1">Cuerpo:</h4>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap bg-gray-50/80 p-4 rounded-md border border-gray-200/80 custom-scrollbar">
                  {email.body}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200/80">
                {!showFeedback ? (
                    <div className="flex justify-between items-center">
                         <span className="text-sm text-gray-600">¿Qué tal este email?</span>
                         <Rating value={rating} onChange={(newRating) => {
                            setRating(newRating);
                            setShowFeedback(true);
                         }}/>
                    </div>
                ) : (
                    <div className="space-y-4 animate-fade-in">
                        <div className="flex justify-between items-center">
                           <span className="text-sm font-semibold text-gray-700">Tu puntuación:</span>
                           <Rating value={rating} onChange={setRating}/>
                        </div>
                        <textarea
                            value={textFeedback}
                            onChange={(e) => setTextFeedback(e.target.value)}
                            placeholder="Feedback opcional (ej: 'El tono es demasiado formal', 'Me encanta la anécdota')"
                            className="w-full p-2 bg-gray-50/80 border border-gray-200 rounded-lg text-sm"
                            rows={2}
                        />
                        <div className="flex justify-end gap-2">
                             <Button variant="ghost" onClick={() => setShowFeedback(false)}>Cancelar</Button>
                             <Button onClick={handleSubmitFeedback}>Enviar Feedback</Button>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};


export const OutputSection: React.FC<OutputSectionProps> = ({ emails, isLoading, error, onFeedbackSubmit }) => {
  if (isLoading) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
        <Icon name="spinner" className="w-16 h-16 text-brand-primary animate-spin mb-4" />
        <h3 className="text-xl font-bold font-heading text-brand-text">Generando tu copy...</h3>
        <p className="text-gray-500">El AI está mezclando los ingredientes perfectos.</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center bg-red-50 border border-red-200 min-h-[300px]">
        <h3 className="text-xl font-bold font-heading text-red-700 mb-2">¡Ups! Algo salió mal</h3>
        <p className="text-red-600 max-w-md">{error}</p>
      </Card>
    );
  }
  
  if (emails.length === 0) {
     return (
        <Card className="flex flex-col items-center justify-center p-8 text-center min-h-[300px] border-2 border-dashed border-gray-300 bg-gray-50/50">
            <Icon name="send" className="w-16 h-16 text-gray-300 mb-4"/>
            <h3 className="text-xl font-bold font-heading text-brand-text">Tus emails aparecerán aquí</h3>
            <p className="text-gray-500 max-w-xs">Configura tus prompts y pulsa "Generar" para empezar.</p>
        </Card>
     )
  }

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold border-b-2 border-brand-accent pb-2 mb-6">Resultados Generados</h2>
      {emails.map((email, index) => (
        <EmailCard key={index} email={email} index={index} onFeedbackSubmit={onFeedbackSubmit} />
      ))}
    </div>
  );
};
