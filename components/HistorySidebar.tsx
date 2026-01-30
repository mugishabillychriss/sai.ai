
import React from 'react';
import { ArtifactAnalysis } from '../types';

interface HistorySidebarProps {
  history: ArtifactAnalysis[];
  onSelect: (artifact: ArtifactAnalysis) => void;
  onClear: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect, onClear }) => {
  return (
    <div className="flex flex-col h-full w-full max-w-xs bg-slate-900 border-r border-slate-800 text-slate-300">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <h2 className="text-xl font-semibold tracking-wide serif-font text-amber-400">Archives</h2>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="text-xs text-slate-500 hover:text-red-400 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.length === 0 ? (
          <p className="text-sm text-slate-500 italic text-center mt-10">No artifacts cataloged yet.</p>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full text-left bg-slate-800/50 hover:bg-slate-800 p-3 rounded-lg border border-slate-700/50 transition-all group overflow-hidden"
            >
              <div className="flex items-center space-x-3">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-12 h-12 object-cover rounded border border-slate-700 group-hover:border-amber-500/50"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{item.name}</p>
                  <p className="text-xs text-slate-500 truncate">{item.origin}</p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;
