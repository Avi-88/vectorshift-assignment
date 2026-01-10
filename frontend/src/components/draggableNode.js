// draggableNode.js

import * as LucideIcons from 'lucide-react';

const textColors = {
    blue: 'text-accent-blue',
    purple: 'text-accent-purple',
    pink: 'text-accent-pink',
    green: 'text-accent-green',
    default: 'text-dark-text-muted',
};

export const DraggableNode = ({ type, label, icon, accentColor = 'blue', isExpanded = true }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };
    
    const textColorClass = textColors[accentColor] || textColors.default;
  
    return (
      <div
        className={`group relative cursor-grab active:cursor-grabbing flex items-center gap-3 transition-all duration-200 
            ${isExpanded ? 'min-w-[180px] w-full p-2 hover:bg-white/5 rounded-xl' : 'w-10 h-10 justify-center hover:scale-110'}
        `}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        draggable
      >
        <div className={`
            flex items-center justify-center rounded-lg shadow-sm transition-all duration-200
            ${isExpanded ? 'w-8 h-8' : 'w-8 h-8'}
            bg-white/5 border border-white/10 backdrop-blur-sm
        `}>
            {icon && (() => {
              const IconComponent = LucideIcons[icon];
              return IconComponent ? (
                <IconComponent className={`w-4 h-4 ${textColorClass}`} />
              ) : (
                <span className={`w-4 h-4 rounded ${textColorClass} bg-current opacity-50`} />
              );
            })()}
        </div>
        
        {isExpanded && (
            <div className="flex flex-col">
                <span className="text-white text-sm font-medium leading-none">{label}</span>
                {/* Optional description or subtitle could go here */}
            </div>
        )}
      </div>
    );
  };
  