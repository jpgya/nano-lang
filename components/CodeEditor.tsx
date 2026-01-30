import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, RefreshCw, Wand2, Terminal, Layers, BookOpen, Download, Globe, FileCode, Plus, Trash2, User, LogOut, Import, HelpCircle } from 'lucide-react';
import { Button } from './Button';
import { transpileNanoToJs, executeCode } from '../services/compiler';
import { generateNanoCode, explainNanoCode, convertJsToNano } from '../services/geminiService';
import { EXAMPLES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { NanoFile, TutorialStep } from '../types';

interface CodeEditorProps {
  initialCode: string;
  onBack: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode, onBack }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // File System State
  const [files, setFiles] = useState<NanoFile[]>([
    { id: '1', name: 'main.nano', content: initialCode }
  ]);
  const [activeFileId, setActiveFileId] = useState<string>('1');

  // Derived active file
  const activeFile = files.find(f => f.id === activeFileId) || files[0];
  
  const [jsOutput, setJsOutput] = useState('');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showDocs, setShowDocs] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  
  // UI States
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsContent, setImportJsContent] = useState('');
  const [loginName, setLoginName] = useState('');
  
  // Tutorial State
  const [tutorialActive, setTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto-transpile when code changes
  useEffect(() => {
    const transpiled = transpileNanoToJs(activeFile.content);
    setJsOutput(transpiled);
  }, [activeFile.content]);

  // Scroll console to bottom on update
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleOutput]);

  const updateActiveFileContent = (newContent: string) => {
    setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: newContent } : f));
  };

  const handleRun = async () => {
    setIsRunning(true);
    setConsoleOutput([]); 
    setTimeout(async () => {
      const logs = await executeCode(jsOutput);
      setConsoleOutput(logs.length > 0 ? logs : [t('noOutput')]);
      setIsRunning(false);
    }, 300);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    const generated = await generateNanoCode(aiPrompt, language);
    if (generated) {
      updateActiveFileContent(generated);
      setAiPrompt('');
    }
    setIsGenerating(false);
  };

  const handleAiExplain = async () => {
    setIsGenerating(true);
    const result = await explainNanoCode(activeFile.content, language);
    setExplanation(result);
    setIsGenerating(false);
  };

  const handleImportJs = async () => {
    if (!importJsContent.trim()) return;
    setIsGenerating(true);
    const nanoCode = await convertJsToNano(importJsContent);
    if (nanoCode) {
      const newFileId = Date.now().toString();
      const newFile: NanoFile = { id: newFileId, name: `imported_${files.length + 1}.nano`, content: nanoCode };
      setFiles([...files, newFile]);
      setActiveFileId(newFileId);
      setShowImportModal(false);
      setImportJsContent('');
    }
    setIsGenerating(false);
  };

  const handleNewFile = () => {
    const newFileId = Date.now().toString();
    const newFile: NanoFile = { 
      id: newFileId, 
      name: `script_${files.length + 1}.nano`, 
      content: 'note New file created\nsay "Hello!"' 
    };
    setFiles([...files, newFile]);
    setActiveFileId(newFileId);
  };

  const handleDeleteFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (files.length <= 1) return;
    const newFiles = files.filter(f => f.id !== id);
    setFiles(newFiles);
    if (activeFileId === id) {
      setActiveFileId(newFiles[0].id);
    }
  };

  const handleDownloadJs = () => {
    const blob = new Blob([jsOutput], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name.replace('.nano', '.js');
    a.click();
  };

  const toggleLanguage = () => setLanguage(language === 'en' ? 'ja' : 'en');

  // Tutorial logic
  const tutorialSteps: TutorialStep[] = [
    { target: '#sidebar-area', title: t('tourStep1'), content: t('tourContent1'), position: 'right' },
    { target: '#editor-area', title: t('tourStep2'), content: t('tourContent2'), position: 'bottom' },
    { target: '#run-actions', title: t('tourStep3'), content: t('tourContent3'), position: 'left' },
    { target: '#ai-tools', title: t('tourStep4'), content: t('tourContent4'), position: 'bottom' },
  ];

  return (
    <div className="h-screen flex flex-col bg-slate-50 relative">
      {/* Import Modal */}
      {showImportModal && (
         <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg">
               <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-brand-700">
                 <FileCode /> {t('importJs')}
               </h3>
               <p className="text-slate-500 mb-4 text-sm">{t('importJsDesc')}</p>
               <textarea 
                  className="w-full h-40 border border-slate-300 rounded-lg p-3 font-mono text-sm focus:border-brand-500 outline-none"
                  placeholder="console.log('Hello');"
                  value={importJsContent}
                  onChange={e => setImportJsContent(e.target.value)}
               />
               <div className="flex justify-end gap-2 mt-4">
                  <Button variant="ghost" onClick={() => setShowImportModal(false)}>{t('cancel')}</Button>
                  <Button disabled={isGenerating} onClick={handleImportJs}>
                    {isGenerating ? t('converting') : t('convert')}
                  </Button>
               </div>
            </div>
         </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
           <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm">
              <h3 className="text-xl font-bold mb-4 text-center">{t('login')}</h3>
              <input 
                 type="text" 
                 placeholder="Username" 
                 className="w-full border border-slate-300 rounded-lg p-3 mb-4 outline-none focus:border-brand-500"
                 value={loginName}
                 onChange={e => setLoginName(e.target.value)}
              />
              <div className="flex gap-2">
                 <Button variant="ghost" className="flex-1" onClick={() => setShowLoginModal(false)}>{t('cancel')}</Button>
                 <Button className="flex-1" onClick={() => {
                    if (loginName) {
                      login(loginName);
                      setShowLoginModal(false);
                    }
                 }}>{t('login')}</Button>
              </div>
           </div>
        </div>
      )}

      {/* Tutorial Overlay */}
      {tutorialActive && (
         <div className="absolute inset-0 z-[60] pointer-events-none">
            {/* Highlight Box */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Tooltip */}
            {(() => {
                const step = tutorialSteps[tutorialStep];
                const el = document.querySelector(step.target);
                if (!el) return null;
                const rect = el.getBoundingClientRect();
                
                let top = 0, left = 0;
                // Simple positioning logic
                if (step.position === 'right') { top = rect.top; left = rect.right + 20; }
                if (step.position === 'left') { top = rect.top; left = rect.left - 320; }
                if (step.position === 'bottom') { top = rect.bottom + 20; left = rect.left; }
                if (step.position === 'top') { top = rect.top - 150; left = rect.left; }

                return (
                   <div 
                      className="absolute w-72 bg-white p-4 rounded-xl shadow-2xl pointer-events-auto transition-all duration-300 animate-bounce-in"
                      style={{ top, left }}
                   >
                      <h4 className="font-bold text-lg text-brand-600 mb-2">{step.title}</h4>
                      <p className="text-slate-600 mb-4 text-sm">{step.content}</p>
                      <div className="flex justify-between">
                         <button onClick={() => setTutorialActive(false)} className="text-slate-400 text-xs hover:text-slate-600">{t('cancel')}</button>
                         <Button 
                            className="px-3 py-1 text-sm h-8" 
                            onClick={() => {
                                if (tutorialStep < tutorialSteps.length - 1) setTutorialStep(s => s + 1);
                                else setTutorialActive(false);
                            }}
                         >
                            {tutorialStep < tutorialSteps.length - 1 ? t('next') : t('finish')}
                         </Button>
                      </div>
                   </div>
                );
            })()}
         </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shadow-sm z-10 h-16">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
             <h2 className="font-bold text-slate-800 leading-tight hidden sm:block">{t('editorTitle')}</h2>
             {isAuthenticated && <span className="text-xs text-brand-600 font-medium">{t('welcomeUser')}{user?.username}</span>}
          </div>
          <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
          
          <button onClick={toggleLanguage} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 flex items-center gap-1" title="Switch Language">
             <Globe size={18} /> <span className="text-xs font-bold">{language.toUpperCase()}</span>
          </button>
          
          <button onClick={() => { setTutorialStep(0); setTutorialActive(true); }} className="p-2 rounded-lg text-brand-500 bg-brand-50 hover:bg-brand-100 flex items-center gap-1" title={t('tutorialStart')}>
             <HelpCircle size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
           {/* AI Input */}
          <div id="ai-tools" className="hidden md:flex items-center gap-2 bg-slate-100 p-1 rounded-full border border-slate-200">
             <input 
                type="text" 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder={t('askAiPlaceholder')}
                className="bg-transparent border-none text-sm px-3 w-32 lg:w-48 focus:outline-none focus:ring-0 text-slate-700"
                onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
             />
             <button onClick={handleAiGenerate} disabled={isGenerating || !aiPrompt} className="bg-white p-1.5 rounded-full shadow-sm text-brand-500 hover:text-brand-600 disabled:opacity-50">
                {isGenerating ? <RefreshCw className="animate-spin" size={16}/> : <Wand2 size={16} />}
             </button>
          </div>

          <div id="run-actions" className="flex items-center gap-2">
             <Button onClick={handleRun} disabled={isRunning} className="px-4 py-2 text-sm" icon={isRunning ? <RefreshCw className="animate-spin" /> : <Play fill="currentColor" />}>
                {isRunning ? t('running') : t('runCode')}
             </Button>
             
             {!isAuthenticated ? (
               <button onClick={() => setShowLoginModal(true)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600">
                 <User size={20} />
               </button>
             ) : (
               <button onClick={logout} className="p-2 bg-red-50 hover:bg-red-100 rounded-full text-red-500" title={t('logout')}>
                 <LogOut size={20} />
               </button>
             )}
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* File Sidebar */}
        <div id="sidebar-area" className="w-16 md:w-48 bg-slate-100 border-r border-slate-200 flex flex-col">
            <div className="p-2 md:p-4 border-b border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase hidden md:block">{t('files')}</span>
                <button onClick={handleNewFile} className="p-1 hover:bg-white rounded shadow-sm text-brand-600">
                   <Plus size={16} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {files.map(file => (
                    <div 
                       key={file.id}
                       onClick={() => setActiveFileId(file.id)}
                       className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer text-sm transition-colors ${file.id === activeFileId ? 'bg-white shadow text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-200'}`}
                    >
                       <div className="flex items-center gap-2 overflow-hidden">
                          <FileCode size={16} className="shrink-0"/>
                          <span className="truncate hidden md:block">{file.name}</span>
                       </div>
                       {files.length > 1 && (
                         <button 
                            onClick={(e) => handleDeleteFile(file.id, e)}
                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
                         >
                            <Trash2 size={14} />
                         </button>
                       )}
                    </div>
                ))}
            </div>
            <div className="p-2 border-t border-slate-200">
               <button onClick={() => setShowImportModal(true)} className="w-full flex items-center justify-center gap-2 p-2 text-slate-600 hover:bg-slate-200 rounded text-xs font-medium">
                  <Import size={14} /> <span className="hidden md:block">{t('importJs')}</span>
               </button>
            </div>
        </div>

        {/* Code Editor */}
        <div id="editor-area" className="flex-1 flex flex-col border-r border-slate-200 relative">
            {/* Documentation Overlay */}
            {showDocs && (
                <div className="absolute top-4 right-4 z-20 w-64 bg-white/95 backdrop-blur shadow-xl rounded-xl border border-slate-200 p-4 text-sm animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-slate-800">{t('quickDocs')}</h3>
                        <button onClick={() => setShowDocs(false)} className="text-slate-400 hover:text-slate-600">×</button>
                    </div>
                    <div className="prose prose-sm prose-slate">
                        <ul className="list-disc pl-4 space-y-1 text-slate-600">
                             <li><code className="text-brand-600 bg-brand-50 px-1 rounded">say</code> {t('syntaxSay')}</li>
                             <li><code className="text-brand-600 bg-brand-50 px-1 rounded">set</code> {t('syntaxSet')}</li>
                             <li><code className="text-brand-600 bg-brand-50 px-1 rounded">repeat</code> {t('syntaxRepeat')}</li>
                             <li><code className="text-brand-600 bg-brand-50 px-1 rounded">check</code> {t('syntaxCheck')}</li>
                             <li><code className="text-brand-600 bg-brand-50 px-1 rounded">end</code> {t('syntaxEnd')}</li>
                        </ul>
                    </div>
                </div>
            )}

            <div className="bg-slate-50 text-xs text-slate-500 px-4 py-2 font-mono flex justify-between items-center border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-700">{activeFile.name}</span>
                    <button onClick={handleDownloadJs} className="flex items-center gap-1 hover:text-brand-600 transition-colors hidden sm:flex" title={t('downloadJs')}>
                        <Download size={14}/> {t('downloadJs')}
                    </button>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setShowDocs(!showDocs)}
                        className="text-slate-500 hover:text-brand-600 flex items-center gap-1"
                    >
                        <BookOpen size={14} /> {t('quickDocs')}
                    </button>
                    <button onClick={handleAiExplain} className="text-brand-600 hover:underline flex items-center gap-1">
                        <Wand2 size={12}/> {t('explainCode')}
                    </button>
                </div>
            </div>
            
            <textarea
                value={activeFile.content}
                onChange={(e) => updateActiveFileContent(e.target.value)}
                className="flex-1 w-full p-4 font-mono text-lg bg-white text-slate-800 focus:outline-none resize-none leading-relaxed"
                placeholder="// Start writing NanoLang..."
                spellCheck={false}
            />
            
            {/* AI Explanation Popover */}
            {explanation && (
                <div className="absolute bottom-0 left-0 right-0 bg-brand-50 p-4 border-t border-brand-100 shadow-lg z-30">
                    <div className="flex justify-between items-start mb-2">
                         <div className="flex items-center gap-2 text-brand-700 font-bold">
                            <Wand2 size={16} /> {t('aiExplainTitle')}
                         </div>
                         <button onClick={() => setExplanation(null)} className="text-brand-400 hover:text-brand-600">{t('close')}</button>
                    </div>
                    <p className="text-brand-900 text-sm leading-relaxed">{explanation}</p>
                </div>
            )}
        </div>

        {/* Output Panel */}
        <div className="w-1/2 hidden lg:flex flex-col bg-slate-900 text-slate-300">
            {/* JS Transpilation */}
            <div className="flex-1 flex flex-col border-b border-slate-700 min-h-0">
                 <div className="bg-slate-800 px-4 py-2 text-xs font-mono flex justify-between items-center text-slate-400">
                    <div className="flex items-center gap-2">
                        <Layers size={14} />
                        <span>{t('generatedJs')}</span>
                    </div>
                 </div>
                 <pre className="flex-1 p-4 font-mono text-sm overflow-auto text-green-400/90 selection:bg-green-900">
                    {jsOutput || '// Transpiled output will appear here...'}
                 </pre>
            </div>

            {/* Console Output */}
            <div className="flex-1 flex flex-col min-h-0 bg-black">
                 <div className="bg-slate-800 px-4 py-2 text-xs font-mono flex items-center gap-2 text-slate-400 border-t border-slate-700">
                    <Terminal size={14} />
                    <span>{t('terminal')}</span>
                 </div>
                 <div className="flex-1 p-4 font-mono text-sm overflow-auto font-bold">
                    {consoleOutput.length === 0 && !isRunning && (
                        <span className="text-slate-600 opacity-50">...</span>
                    )}
                    {consoleOutput.map((log, idx) => (
                        <div key={idx} className="mb-1 text-white border-b border-white/10 pb-1 last:border-0 animate-fade-in break-words">
                            <span className="text-brand-500 mr-2">➜</span>
                            {log}
                        </div>
                    ))}
                    <div ref={consoleEndRef} />
                 </div>
            </div>
        </div>
      </div>
      
       {/* Mobile Output Drawer */}
       <div className="lg:hidden h-1/3 bg-slate-900 flex flex-col border-t border-slate-200">
         <div className="bg-slate-800 px-4 py-2 text-xs font-mono text-slate-400 flex justify-between">
            <span>TERMINAL</span>
         </div>
         <div className="flex-1 p-4 font-mono text-sm overflow-auto text-white">
             {consoleOutput.map((log, idx) => (
                <div key={idx} className="mb-1">
                     <span className="text-green-500 mr-2">➜</span>
                     {log}
                </div>
            ))}
            <div ref={consoleEndRef} />
         </div>
      </div>
    </div>
  );
};