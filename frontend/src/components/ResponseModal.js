import { X } from 'lucide-react';

export const ResponseModal = ({ isOpen, onClose, response, error }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="glass-panel rounded-2xl border border-white/10 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-glass my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            {error ? 'Error' : 'Pipeline Validation Result'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-dark-text-muted hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {error ? (
          <div className="space-y-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : response ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel rounded-lg p-3 border border-white/5">
                <p className="text-dark-text-muted text-xs uppercase tracking-wider mb-1">Nodes</p>
                <p className="text-white text-xl font-semibold">{response.num_nodes}</p>
              </div>
              <div className="glass-panel rounded-lg p-3 border border-white/5">
                <p className="text-dark-text-muted text-xs uppercase tracking-wider mb-1">Edges</p>
                <p className="text-white text-xl font-semibold">{response.num_edges}</p>
              </div>
            </div>
            
            <div className="glass-panel rounded-lg p-4 border border-white/5">
              <div className="flex items-center justify-between">
                <p className="text-dark-text-muted text-xs uppercase tracking-wider">Is DAG</p>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  response.is_dag 
                    ? 'bg-accent-green/20 text-accent-green border border-accent-green/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {response.is_dag ? 'Yes' : 'No'}
                </div>
              </div>
              {!response.is_dag && (
                <p className="text-dark-text-muted text-xs mt-2">
                  The workflow contains cycles and is not a valid DAG.
                </p>
              )}
            </div>
          </div>
        ) : null}

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-accent-purple/20 hover:bg-accent-purple/30 text-white text-sm font-medium rounded-lg border border-accent-purple/30 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

