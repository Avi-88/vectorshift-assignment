import { useStore } from '../utils/store';
import { shallow } from 'zustand/shallow';
import { Undo2, Redo2, Loader2} from 'lucide-react';

export const BottomToolbar = ({isLoading, handleSubmit}) => {

  const { undo, redo, historyIndex, historyLength} = useStore(
    (state) => ({
      undo: state.undo,
      redo: state.redo,
      historyIndex: state.historyIndex,
      historyLength: state.history?.length || 0,
      nodes: state.nodes,
      edges: state.edges,
    }),
    shallow
  );
  
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyLength - 1;

  const handleUndo = () => {
    if (canUndo) {
      undo();
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      redo();
    }
  };


  const actionButtonClass = "p-2 rounded-lg border border-white/10 text-dark-text hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2 focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed";
  const iconSize = 16;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="glass-panel rounded-2xl border border-white/10 px-4 py-3 flex items-center gap-3 shadow-glass">
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            className={actionButtonClass}
            aria-label="Undo"
            title="Undo"
            disabled={!canUndo}
          >
            <Undo2 size={iconSize} />
          </button>
          <button
            onClick={handleRedo}
            className={actionButtonClass}
            aria-label="Redo"
            title="Redo"
            disabled={!canRedo}
          >
            <Redo2 size={iconSize} />
          </button>
        </div>

        <div className="h-8 w-px bg-white/10" />

        <button 
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-6 py-2 bg-gradient-to-r from-accent-purple to-accent-pink hover:from-accent-pink hover:to-accent-purple text-white text-sm font-semibold rounded-lg shadow-glow transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2 focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          aria-label="Run pipeline"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <span className="text-sm" aria-hidden="true">▶</span>
          )}
          {isLoading ? 'Validating...' : 'Submit Pipeline'}
        </button>
      </div>
    </div>
  );
};

