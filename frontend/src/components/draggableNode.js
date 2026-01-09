// draggableNode.js

import * as LucideIcons from 'lucide-react';

export const DraggableNode = ({ type, label, icon }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <div
        className="group relative cursor-grab active:cursor-grabbing glass-node p-2.5 flex flex-col items-start gap-1.5 min-w-[80px] hover:scale-[1.02] active:scale-95 transition-all duration-200 hover:shadow-glow/20"
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        draggable
      >
        <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-accent-purple/20 group-hover:border-accent-purple/30 transition-colors">
            {icon && (() => {
              const IconComponent = LucideIcons[icon];
              return IconComponent ? (
                <IconComponent className="w-3.5 h-3.5 text-dark-text-muted group-hover:text-accent-purple transition-colors" />
              ) : (
                <span className="w-3.5 h-3.5 rounded bg-dark-text-muted/30 group-hover:bg-accent-purple/30" />
              );
            })()}
        </div>
        <span className="text-dark-text text-xs font-medium">{label}</span>
      </div>
    );
  };
  