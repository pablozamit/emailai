import React, { useState } from 'react';
import { Card } from './Card';
import { Switch } from './Switch';
import { Icon } from './Icon';
import { generateSuggestion } from '../../services/geminiService';

interface PromptCardProps {
  title: string;
  subtitle: string;
  isLocked: boolean;
  onLockToggle: () => void;
  onSuggestion: (suggestion: string) => void;
  suggestionPrompt: string;
  children: React.ReactNode;
  isOptional?: boolean;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  title,
  subtitle,
  isLocked,
  onLockToggle,
  onSuggestion,
  suggestionPrompt,
  children,
  isOptional = false,
}) => {
  const [isSuggesting, setIsSuggesting] = useState(false);
  
  const handleSuggestion = async () => {
    if (suggestionPrompt.includes('No se pueden generar sugerencias')) return;
    setIsSuggesting(true);
    try {
      const suggestion = await generateSuggestion(suggestionPrompt);
      onSuggestion(suggestion);
    } catch (error) {
      console.error("Failed to get suggestion");
      // Optionally show an error to the user
    } finally {
      setIsSuggesting(false);
    }
  };
  
  return (
    <Card className={`transition-all duration-300 ${isLocked ? 'border-brand-primary bg-fuchsia-50/20' : 'border-transparent'} border-2 relative pt-8`}>
      <div className="absolute top-0 left-0 w-full h-2 bg-brand-primary rounded-t-lg"></div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-heading">
          <span className="font-bold text-brand-text">{title}</span>
          <span className="font-normal text-gray-500 ml-2">{subtitle}</span>
          {isOptional && <span className="text-gray-400 font-normal ml-2 text-base">(Opcional)</span>}
        </h3>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSuggestion}
            disabled={isSuggesting || isLocked || suggestionPrompt.includes('No se pueden generar sugerencias')}
            className="p-1.5 text-gray-500 hover:text-brand-primary disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            aria-label={`Generar sugerencia para ${title}`}
          >
            {isSuggesting ? <Icon name="spinner" className="w-5 h-5 animate-spin"/> : <Icon name="wand" className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Icon name={isLocked ? "lock" : "unlock"} className="w-5 h-5 text-gray-400" />
            <Switch checked={isLocked} onChange={onLockToggle} ariaLabel={`Bloquear ${title}`} />
          </div>
        </div>
      </div>
      <div className={`${isLocked ? 'opacity-60 pointer-events-none' : ''}`}>
        {children}
      </div>
    </Card>
  );
};
