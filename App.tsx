
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ArtifactAnalysis, AppStatus } from './types';
import { analyzeArtifactWithGemini } from './services/geminiService';
import HistorySidebar from './components/HistorySidebar';
import ArtifactDetails from './components/ArtifactDetails';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [currentArtifact, setCurrentArtifact] = useState<ArtifactAnalysis | null>(null);
  const [history, setHistory] = useState<ArtifactAnalysis[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Connectivity monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sai_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history to local storage
  useEffect(() => {
    localStorage.setItem('sai_history', JSON.stringify(history));
  }, [history]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOnline) return;
    
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus(AppStatus.LOADING);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const analysis = await analyzeArtifactWithGemini(base64String);
        const completeAnalysis = { ...analysis, imageUrl: base64String };
        
        setCurrentArtifact(completeAnalysis);
        setHistory(prev => [completeAnalysis, ...prev]);
        setStatus(AppStatus.ANALYZED);
      } catch (error) {
        console.error("Analysis failed", error);
        setErrorMessage("Specialized interpretation failed. Please ensure the image is clear and contains a historical artifact.");
        setStatus(AppStatus.ERROR);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => {
    if (!isOnline) {
      alert("Analysis engine is currently offline. You can still browse your existing archives.");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleSelectHistory = (artifact: ArtifactAnalysis) => {
    setCurrentArtifact(artifact);
    setStatus(AppStatus.ANALYZED);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your collection?")) {
      setHistory([]);
      localStorage.removeItem('sai_history');
      setStatus(AppStatus.IDLE);
      setCurrentArtifact(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-slate-950">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-amber-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex flex-col items-center">
          <span className="serif-font text-xl font-bold text-amber-500 tracking-tighter">S A I</span>
          <span className={`text-[8px] uppercase tracking-widest ${isOnline ? 'text-emerald-500' : 'text-amber-500'}`}>
            {isOnline ? 'Cloud Link Active' : 'Offline Mode'}
          </span>
        </div>
        <button onClick={triggerUpload} className={`${isOnline ? 'text-amber-500' : 'text-slate-700'}`}>
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'fixed inset-0 z-50 flex lg:relative lg:z-0' : 'hidden lg:flex'}`}>
        <div className="flex flex-col h-full w-80 shadow-2xl z-50 bg-slate-900">
          <HistorySidebar 
            history={history} 
            onSelect={handleSelectHistory} 
            onClear={clearHistory}
          />
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Local Sync</span>
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
          </div>
        </div>
        <div 
          className="flex-1 bg-black/50 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
        {/* Subtle Decorative Gradient */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-amber-500/5 blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500/5 blur-[150px] pointer-events-none"></div>

        {/* Connection Banner */}
        {!isOnline && (
          <div className="sticky top-0 z-10 bg-amber-600/10 border-b border-amber-600/30 backdrop-blur-md px-6 py-2 flex items-center justify-center gap-3">
             <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
             <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-500">Analysis Engine Offline • Browsing Local Archives Only</p>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
          {/* Top Bar Desktop */}
          <div className="hidden lg:flex justify-between items-center mb-12">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold serif-font text-amber-500 tracking-widest flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-amber-500/30"></span>
                  SPECIALIZED ARTIFACT INTERPRETER
                </h1>
                <span className={`px-2 py-0.5 rounded border text-[9px] uppercase tracking-tighter font-bold ${isOnline ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' : 'border-amber-500/30 text-amber-500 bg-amber-500/5 animate-pulse'}`}>
                  {isOnline ? 'Cloud Analysis System Active' : 'Limited Offline Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-widest ml-10">Archaeological Artificial Intelligence System</p>
            </div>
            <button 
              disabled={!isOnline}
              onClick={triggerUpload}
              className={`${isOnline ? 'bg-amber-600 hover:bg-amber-500 text-slate-900 shadow-lg transform hover:scale-105 active:scale-95' : 'bg-slate-800 text-slate-600 cursor-not-allowed'} px-6 py-2.5 rounded-full font-bold transition-all flex items-center gap-2`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              {isOnline ? 'ANALYZE NEW FIND' : 'ANALYSIS UNAVAILABLE'}
            </button>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept="image/*"
          />

          {/* Conditional Rendering of States */}
          {status === AppStatus.IDLE && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in zoom-in duration-1000">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-3xl"></div>
                <div 
                  className={`relative w-48 h-48 lg:w-64 lg:h-64 rounded-full border border-slate-800 flex items-center justify-center bg-slate-900 shadow-inner group overflow-hidden ${isOnline ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  onClick={triggerUpload}
                >
                   <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                   <svg xmlns="http://www.w3.org/2000/svg" className={`h-20 w-20 transition-colors duration-500 ${isOnline ? 'text-slate-700 group-hover:text-amber-500/50' : 'text-slate-800'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div className="max-w-lg space-y-4">
                <h2 className="text-3xl lg:text-4xl font-light serif-font text-slate-200">
                  {isOnline ? 'Awaiting your discovery' : 'System Hibernation'}
                </h2>
                <p className="text-slate-500 leading-relaxed font-light italic">
                  {isOnline 
                    ? 'Upload a photograph of a historical object, monument, or fragment to begin the analysis. Our systems will interpret materials, cultural origins, and historical significance.'
                    : 'Cloud connectivity lost. The real-time identification engine is currently disabled. You can still view and study previously cataloged items in your archive.'
                  }
                </p>
                {isOnline && (
                  <button 
                    onClick={triggerUpload}
                    className="lg:hidden w-full bg-amber-600 text-slate-950 py-4 rounded-xl font-bold text-lg shadow-xl active:bg-amber-500 transition-colors"
                  >
                    Start Scan
                  </button>
                )}
              </div>
            </div>
          )}

          {status === AppStatus.LOADING && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-pulse">
              <div className="w-32 h-32 relative">
                 <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-t-amber-500 rounded-full animate-spin"></div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl serif-font text-amber-500 mb-2">Analyzing Material Fragments...</h3>
                <p className="text-slate-500 animate-bounce">Consulting chronological records</p>
              </div>
            </div>
          )}

          {status === AppStatus.ERROR && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center animate-in slide-in-from-top-4 duration-500">
              <div className="bg-red-900/20 border border-red-900/50 p-6 rounded-2xl max-w-md">
                <h3 className="text-red-400 font-bold mb-2">Identification Error</h3>
                <p className="text-slate-400 mb-6">{errorMessage}</p>
                <button 
                  disabled={!isOnline}
                  onClick={triggerUpload}
                  className={`${isOnline ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-900 text-slate-700 cursor-not-allowed'} px-6 py-2 rounded-lg transition-colors border border-slate-700`}
                >
                  {isOnline ? 'Try Different Image' : 'Offline - Analysis Impossible'}
                </button>
              </div>
            </div>
          )}

          {status === AppStatus.ANALYZED && currentArtifact && (
            <ArtifactDetails artifact={currentArtifact} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
