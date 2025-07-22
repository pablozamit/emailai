import React, { useState, useCallback, useRef } from 'react';
import { PromptData, GeneratedEmail, Feedback, ServiceReference } from './types';
import { COPYWRITING_FORMULAS, SUBJECT_OPTIONS, EXAMPLE_PROMPT_DATA } from './constants';
import { generateEmailCopy } from './services/geminiService';
import { PromptCard } from './components/ui/PromptCard';
import { Textarea } from './components/ui/Textarea';
import { Button } from './components/ui/Button';
import { Icon } from './components/ui/Icon';
import { OutputSection } from './components/OutputSection';
import { Card } from './components/ui/Card';
import { Switch } from './components/ui/Switch';

const initialPromptData: PromptData = {
  topic: '',
  objective: '',
  details: '',
  negativePrompt: "No empieces el email por 'hola' ni ningun saludo",
  copywritingPrinciple: '',
  formulas: COPYWRITING_FORMULAS.reduce((acc, f) => ({ ...acc, [f.name]: 5 }), {}),
  toneDescription: '',
  toneExamples: '',
  length: 'normal',
  paragraphLength: 0.4,
  cta: '',
  serviceReferences: [
    { id: Date.now(), title: '', description: '', link: '', enabled: true },
  ],
  postscript: '',
  subjectOptions: Object.keys(SUBJECT_OPTIONS).reduce((acc, key) => ({...acc, [key]: false}), {}),
  avatar: '',
  pains: '',
  anecdote: '',
  testimonial: '',
  imagePlacement: { auto: true, description: '', imageData: null },
};

const App: React.FC = () => {
  const [promptData, setPromptData] = useState<PromptData>(initialPromptData);
  const [lockedFields, setLockedFields] = useState<Record<string, boolean>>({});
  const [emailCount, setEmailCount] = useState(1);
  const [isEmailCountLocked, setIsEmailCountLocked] = useState(false);
  const [generatedEmails, setGeneratedEmails] = useState<GeneratedEmail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<Feedback[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handlePromptChange = useCallback((field: keyof PromptData, value: any) => {
    setPromptData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleLockToggle = useCallback((field: string) => {
    setLockedFields(prev => ({ ...prev, [field]: !prev[field] }));
  }, []);
  
  const handleServiceChange = (id: number, field: keyof Omit<ServiceReference, 'id'>, value: any) => {
    const newServices = promptData.serviceReferences.map(service => 
      service.id === id ? { ...service, [field]: value } : service
    );
    handlePromptChange('serviceReferences', newServices);
  };
  
  const addServiceReference = () => {
    const newService: ServiceReference = { id: Date.now(), title: '', description: '', link: '', enabled: true };
    handlePromptChange('serviceReferences', [...promptData.serviceReferences, newService]);
  };

  const removeServiceReference = (id: number) => {
    const newServices = promptData.serviceReferences.filter(service => service.id !== id);
    handlePromptChange('serviceReferences', newServices);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handlePromptChange('imagePlacement', {
          ...promptData.imagePlacement,
          imageData: {
            name: file.name,
            type: file.type,
            data: reader.result as string,
          },
          auto: false, // Disable auto placement when an image is uploaded
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    handlePromptChange('imagePlacement', {
        ...promptData.imagePlacement,
        imageData: null,
    });
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }


  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedEmails([]);
    try {
      const emails = await generateEmailCopy(promptData, emailCount, feedbackHistory);
      setGeneratedEmails(emails);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error desconocido.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFeedbackSubmit = (feedback: Feedback, index: number) => {
    setFeedbackHistory(prev => [...prev, feedback]);
  };

  const handleGenerateExample = () => {
    const newPromptData = JSON.parse(JSON.stringify(EXAMPLE_PROMPT_DATA));
    
    Object.keys(lockedFields).forEach(key => {
        if (lockedFields[key]) {
            newPromptData[key as keyof PromptData] = promptData[key as keyof PromptData];
        }
    });

    setPromptData(newPromptData);
    
    if(!isEmailCountLocked) {
        setEmailCount(1);
    }

    setTimeout(() => {
        handleGenerate();
    }, 100);
  };
  
  const getSuggestionPrompt = (fieldTitle: string): string => {
    const contextParts: string[] = [];
    if (promptData.topic) contextParts.push(`- Tema Principal: ${promptData.topic}`);
    if (promptData.objective) contextParts.push(`- Objetivo: ${promptData.objective}`);
    if (promptData.avatar) contextParts.push(`- Avatar: ${promptData.avatar}`);

    const context = contextParts.length > 0
    ? `\n\nAquí tienes algo de contexto del email para ayudarte:\n${contextParts.join('\n')}`
    : ' No hay contexto todavía, sé creativo.';
    
    if (contextParts.length === 0 && !fieldTitle.toLowerCase().includes('tema')) {
        return "No hay suficiente contexto. Por favor, rellena primero el tema o el objetivo.";
    }
    
    return `Eres un experto en copywriting. Genera una sugerencia creativa y concisa para el campo "${fieldTitle}" de un newsletter.${context}\n\nResponde únicamente con el texto para el campo, sin adornos, explicaciones, ni comillas. Solo el texto puro.`;
  };

  const renderPromptCard = (field: keyof PromptData, title: string, subtitle: string, children: React.ReactNode, isOptional = false) => (
    <PromptCard
      title={title}
      subtitle={subtitle}
      isLocked={!!lockedFields[String(field)]}
      onLockToggle={() => handleLockToggle(String(field))}
      suggestionPrompt={getSuggestionPrompt(title + ' ' + subtitle)}
      onSuggestion={(suggestion) => handlePromptChange(field, suggestion)}
      isOptional={isOptional}
    >
      {children}
    </PromptCard>
  );

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <header className="bg-brand-card/80 backdrop-blur-sm shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center">
          <h1 className="text-4xl font-extrabold text-brand-text font-heading">AI Email Copywriter</h1>
          <p className="text-gray-500 mt-1">Crea newsletters con un IA auto-entrenado y un panel de control creativo.</p>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Controls */}
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-bold border-b-2 border-brand-accent pb-2">Panel de Control</h2>

            {/* --- ESTRATEGIA Y AUDIENCIA --- */}
            {renderPromptCard('topic', 'Tema', 'o Premisa del Email', <Textarea rows={3} value={promptData.topic} onChange={e => handlePromptChange('topic', e.target.value)} placeholder="Ej: 'Usar un testimonio para anunciar una subida de precio', 'Contar mi mayor fracaso para vender mi curso', 'Analizar un error común y presentar mi servicio como la solución'..." />)}
            {renderPromptCard('objective', 'Objetivo', 'del Email', <Textarea value={promptData.objective} onChange={e => handlePromptChange('objective', e.target.value)} placeholder="¿Qué acción específica quieres que haga el lector?" />)}
            {renderPromptCard('avatar', 'Avatar', 'del Cliente', <Textarea value={promptData.avatar} onChange={e => handlePromptChange('avatar', e.target.value)} placeholder="Descripción del cliente ideal al que te diriges." />)}
            {renderPromptCard('pains', 'Dolores', 'del Avatar', <Textarea value={promptData.pains} onChange={e => handlePromptChange('pains', e.target.value)} placeholder="¿Qué problemas, frustraciones o miedos tiene?" />)}

            {/* --- CONTENIDO Y ESTRUCTURA --- */}
            {renderPromptCard('details', 'Detalles', 'a Incluir', <Textarea rows={4} value={promptData.details} onChange={e => handlePromptChange('details', e.target.value)} placeholder="Información factual que debe aparecer sí o sí (fechas, precios, etc.)." />, true)}
            {renderPromptCard('anecdote', 'Anécdota', '', <Textarea value={promptData.anecdote} onChange={e => handlePromptChange('anecdote', e.target.value)} placeholder="Una historia personal o relevante para conectar." />, true)}
            {renderPromptCard('testimonial', 'Testimonio', '', <Textarea value={promptData.testimonial} onChange={e => handlePromptChange('testimonial', e.target.value)} placeholder="Cita de un cliente satisfecho que aporte prueba social." />, true)}
            {renderPromptCard('imagePlacement', 'Imagen', '', 
              <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                      <Switch checked={promptData.imagePlacement.auto && !promptData.imagePlacement.imageData} onChange={e => handlePromptChange('imagePlacement', {...promptData.imagePlacement, auto: e})} disabled={!!promptData.imagePlacement.imageData}/>
                      <span>Dejar que la IA sugiera una imagen</span>
                  </label>
                  
                  {promptData.imagePlacement.imageData ? (
                    <div className="mt-2 p-2 border border-gray-200 rounded-lg flex items-center gap-4">
                        <img src={promptData.imagePlacement.imageData.data} alt="Preview" className="w-16 h-16 object-cover rounded-md" />
                        <div className="text-sm">
                            <p className="font-semibold text-gray-700">{promptData.imagePlacement.imageData.name}</p>
                            <button onClick={removeImage} className="text-red-500 hover:text-red-700 text-xs">Quitar imagen</button>
                        </div>
                    </div>
                  ) : (
                    !promptData.imagePlacement.auto && (
                      <div className="mt-2">
                        <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>Subir Imagen</Button>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden"/>
                      </div>
                    )
                  )}
              </div>,
            true)}

            {/* --- CIERRE Y CONVERSIÓN --- */}
            {renderPromptCard('cta', 'CTA', 'y Link', <Textarea value={promptData.cta} onChange={e => handlePromptChange('cta', e.target.value)} placeholder="Texto y/o link para la llamada a la acción." />)}
            {renderPromptCard('serviceReferences', 'Referencias', 'de Servicios', 
              <div className="space-y-3">
                {promptData.serviceReferences.map((service) => (
                  <div key={service.id} className="p-3 bg-gray-50/80 rounded-lg border border-gray-200 space-y-2 relative group">
                     <div className="flex justify-between items-start mb-2">
                        <input type="text" value={service.title} onChange={(e) => handleServiceChange(service.id, 'title', e.target.value)} placeholder="Título del servicio" className="font-semibold text-brand-text bg-transparent w-full mr-2 focus:outline-none focus:border-b border-brand-primary" />
                        <Switch checked={service.enabled} onChange={(checked) => handleServiceChange(service.id, 'enabled', checked)} />
                    </div>
                    <Textarea value={service.description} onChange={(e) => handleServiceChange(service.id, 'description', e.target.value)} placeholder="Descripción breve del servicio" className="text-sm" rows={2}/>
                    <Textarea value={service.link} onChange={(e) => handleServiceChange(service.id, 'link', e.target.value)} placeholder="https://ejemplo.com/servicio" className="text-sm" rows={1}/>
                    {promptData.serviceReferences.length > 1 && (
                      <button onClick={() => removeServiceReference(service.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs">&times;</button>
                    )}
                  </div>
                ))}
                <Button variant="secondary" onClick={addServiceReference} className="w-full">+ Añadir Servicio</Button>
              </div>,
            true)}
            {renderPromptCard('postscript', 'Postdata', '', <Textarea value={promptData.postscript} onChange={e => handlePromptChange('postscript', e.target.value)} placeholder="P.S.: ¿De qué se habla en la postdata?" />, true)}
            
            {/* --- VOZ Y ESTILO --- */}
            {renderPromptCard('toneDescription', 'Tono', 'y Voz', <Textarea value={promptData.toneDescription} onChange={e => handlePromptChange('toneDescription', e.target.value)} placeholder="Describe la personalidad de quien escribe." />)}
            {renderPromptCard('toneExamples', 'Ejemplos', 'de Tono', <Textarea rows={4} value={promptData.toneExamples} onChange={e => handlePromptChange('toneExamples', e.target.value)} placeholder="Pega aquí frases de ejemplo o el contenido de tu Google Doc. La IA no puede acceder a links externos." />)}
            {renderPromptCard('negativePrompt', 'Negative Prompt', 'Qué NO Hacer', <Textarea value={promptData.negativePrompt} onChange={e => handlePromptChange('negativePrompt', e.target.value)} placeholder="Ej: No usar emojis, no ser demasiado formal..." />)}

            {/* --- AJUSTES FINOS DE IA --- */}
            {renderPromptCard('copywritingPrinciple', 'Principio', 'de Copywriting', (
              <Textarea value={promptData.copywritingPrinciple} onChange={e => handlePromptChange('copywritingPrinciple', e.target.value)} placeholder="Describe en tus palabras el principio o enfoque a usar. Ej: 'Generar urgencia con una fecha límite', 'Usar la prueba social de expertos'..." />
            ))}
            <PromptCard title="Fórmulas" subtitle="(Panel DJ)" isLocked={!!lockedFields['formulas']} onLockToggle={() => handleLockToggle('formulas')} suggestionPrompt="No se pueden generar sugerencias para este campo" onSuggestion={()=>{}}>
              <div className="space-y-4">
                {COPYWRITING_FORMULAS.map(formula => (
                  <div key={formula.name}>
                    <label className="block text-sm font-medium text-gray-700">{formula.name} ({promptData.formulas[formula.name]})</label>
                    <p className="text-xs text-gray-500 mb-1">{formula.description}</p>
                    <input type="range" min="0" max="10" value={promptData.formulas[formula.name]} onChange={e => handlePromptChange('formulas', {...promptData.formulas, [formula.name]: +e.target.value})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary" />
                  </div>
                ))}
              </div>
            </PromptCard>
            <PromptCard title="Longitud" subtitle="de Email y Párrafos" isLocked={!!lockedFields['length']} onLockToggle={() => handleLockToggle('length')} suggestionPrompt="No se pueden generar sugerencias para este campo" onSuggestion={()=>{}}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Longitud de Email</label>
                  <div className="flex flex-wrap gap-2">
                    {(['corto', 'normal', 'largo'] as const).map(len => (
                      <button key={len} onClick={() => handlePromptChange('length', len)} className={`px-4 py-2 text-sm rounded-md transition-colors ${promptData.length === len ? 'bg-brand-primary text-white' : 'bg-brand-secondary hover:bg-brand-secondary-hover'}`}>
                        {len.charAt(0).toUpperCase() + len.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Longitud de Párrafo ({promptData.paragraphLength.toFixed(1)})</label>
                    <input type="range" min="0" max="1" step="0.1" value={promptData.paragraphLength} onChange={e => handlePromptChange('paragraphLength', +e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary" />
                </div>
              </div>
            </PromptCard>
            <PromptCard title="Asunto" subtitle="Técnicas de Apertura" isLocked={!!lockedFields['subjectOptions']} onLockToggle={() => handleLockToggle('subjectOptions')} suggestionPrompt="No se pueden generar sugerencias para este campo" onSuggestion={()=>{}}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                {Object.entries(SUBJECT_OPTIONS).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-50">
                    <input type="checkbox" checked={!!promptData.subjectOptions[key]} onChange={e => handlePromptChange('subjectOptions', {...promptData.subjectOptions, [key]: e.target.checked})} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                    {label}
                  </label>
                ))}
              </div>
            </PromptCard>
          </div>

          {/* Right Column: Output & Actions */}
          <div className="sticky top-28 self-start space-y-6">
            <Card>
              <h3 className="font-heading text-xl font-bold text-gray-800 mb-4">Acciones</h3>
              <div className="space-y-4">
                  <div className="flex items-center justify-between">
                      <label htmlFor="emailCount" className="block font-medium text-gray-700">Número de emails a generar</label>
                      <div className="flex items-center gap-2" title="Bloquear este campo para que no cambie al generar ejemplos">
                          <Icon name={isEmailCountLocked ? "lock" : "unlock"} className="w-5 h-5 text-gray-400" />
                          <Switch checked={isEmailCountLocked} onChange={() => setIsEmailCountLocked(!isEmailCountLocked)} />
                      </div>
                  </div>
                  <input
                    type="number"
                    id="emailCount"
                    min="1"
                    max="5"
                    value={emailCount}
                    onChange={(e) => setEmailCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    disabled={isEmailCountLocked}
                  />
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="secondary" onClick={handleGenerateExample} isLoading={isLoading} className="w-full">
                    <Icon name="wand" className="w-5 h-5" />
                    Generar Ejemplo
                  </Button>
                  <Button onClick={handleGenerate} isLoading={isLoading} className="w-full">
                    <Icon name={isLoading ? 'spinner' : 'send'} className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    Generar
                  </Button>
                </div>
              </div>
            </Card>
            
            <div className="max-h-[calc(100vh-20rem)] overflow-y-auto custom-scrollbar pr-2">
                <OutputSection 
                  emails={generatedEmails} 
                  isLoading={isLoading} 
                  error={error} 
                  onFeedbackSubmit={handleFeedbackSubmit}
                />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
