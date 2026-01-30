
import React from 'react';
import { ArtifactAnalysis } from '../types';

interface ArtifactDetailsProps {
  artifact: ArtifactAnalysis;
}

const ArtifactDetails: React.FC<ArtifactDetailsProps> = ({ artifact }) => {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Visual Analysis (4 cols) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-sm">
              <img 
                src={artifact.imageUrl} 
                alt={artifact.name} 
                className="w-full h-full object-contain p-4 mix-blend-lighten"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-slate-900/80 border border-slate-700 text-[10px] uppercase tracking-widest text-amber-500 font-bold rounded-full backdrop-blur-md">
                  Digital Scan • #{artifact.id.slice(0, 6)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 flex flex-col justify-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-2">Preservation State</p>
              <p className="text-sm text-slate-300 font-medium leading-snug">{artifact.condition}</p>
            </div>
            <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800 flex flex-col justify-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-2">AI Confidence</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-light text-amber-500">{(artifact.confidenceScore * 100).toFixed(0)}</p>
                <p className="text-xs text-slate-600 mb-1.5 font-bold uppercase tracking-tighter">% MATCH</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-950/10 p-6 rounded-xl border border-amber-900/20">
             <h3 className="text-xs uppercase tracking-[0.2em] text-amber-500 font-bold mb-3 flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
               Visual Decorative Analysis
             </h3>
             <p className="text-sm text-slate-400 leading-relaxed italic">
               "{artifact.decorativeElements || "No significant surface iconography or decorative patterns detected on visible fragments."}"
             </p>
          </div>
        </div>

        {/* Right Column: Knowledge Base & Interpretations (7 cols) */}
        <div className="lg:col-span-7 space-y-10">
          <header className="border-b border-slate-800 pb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-px bg-amber-500/40"></span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-amber-600 font-bold">Catalog Entry</span>
            </div>
            <h1 className="text-5xl font-bold serif-font text-white mb-6 leading-[1.1]">
              {artifact.name}
            </h1>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-1.5 bg-slate-800/50 text-slate-200 text-xs rounded-lg border border-slate-700 flex items-center gap-2">
                <span className="text-amber-600">Origin:</span> {artifact.origin}
              </div>
              <div className="px-4 py-1.5 bg-slate-800/50 text-slate-200 text-xs rounded-lg border border-slate-700 flex items-center gap-2">
                <span className="text-amber-600">Period:</span> {artifact.estimatedPeriod}
              </div>
              <div className="px-4 py-1.5 bg-slate-800/50 text-slate-200 text-xs rounded-lg border border-slate-700 flex items-center gap-2">
                <span className="text-amber-600">Material:</span> {artifact.material}
              </div>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-slate-500 font-black mb-5">Technological Features</h3>
              <ul className="space-y-4">
                {artifact.detectedFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <span className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-amber-500 font-mono shrink-0">
                      0{idx + 1}
                    </span>
                    <span className="text-sm text-slate-400 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-8">
               <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] text-slate-500 font-black mb-4">Historical Significance</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {artifact.historicalSignificance}
                  </p>
               </div>
               <div className="p-5 bg-slate-900/80 rounded-xl border-l-2 border-amber-600/50">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-amber-600 font-black mb-2">Conservation Protocol</h3>
                  <p className="text-[13px] text-slate-400 leading-relaxed italic">
                    {artifact.conservationAdvice}
                  </p>
               </div>
            </div>
          </section>

          <section className="bg-slate-900/40 p-8 rounded-2xl border border-slate-800/60 relative overflow-hidden">
            {/* Background Texture for Knowledge Base */}
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
            </div>
            
            <h3 className="text-xs uppercase tracking-[0.25em] text-amber-500 font-bold mb-6 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Comparative Knowledge Base Entry
            </h3>
            <div className="serif-font text-lg text-slate-300 leading-relaxed space-y-4">
              {artifact.knowledgeBaseSummary.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-600 uppercase tracking-widest font-bold">
              <span>Linked Records: {artifact.origin} Archive</span>
              <span className="text-amber-900/50">SAI Knowledge Engine v4.2</span>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

export default ArtifactDetails;
