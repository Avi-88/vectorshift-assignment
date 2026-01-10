// toolbar.js

import { useState } from 'react';
import { DraggableNode } from './draggableNode';
import { nodeConfigs } from '../config/nodeConfigs';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';

const categories = [
    { label: 'General', items: ['customInput', 'customOutput', 'text'] },
    { label: 'AI Models', items: ['llm'] },
    { label: 'Data Processing', items: ['filter', 'transform'] },
    { label: 'Integration', items: ['apiRequest', 'databaseQuery'] },
    { label: 'Utilities', items: ['note'] },
];

export const PipelineToolbar = () => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className={`fixed left-5 top-1/2 -translate-y-1/2 max-h-[calc(100vh-40px)] transition-all duration-300 ease-in-out z-20 flex flex-col
            ${isExpanded ? 'w-64' : 'w-20'}
        `}>
             <div className="glass-panel w-full h-auto max-h-full rounded-2xl overflow-hidden flex flex-col shadow-2xl relative">
                
                <div className={`flex items-center p-4 border-b border-white/5 bg-white/5 backdrop-blur-xl transition-all
                    ${isExpanded ? 'justify-between' : 'justify-center'}
                `}>
                    {isExpanded && (
                        <div className="flex items-center gap-2 overflow-hidden">
                            <Layers className="w-5 h-5 text-accent-purple shrink-0" />
                            <div>
                                <h2 className="text-base font-bold text-white tracking-tight leading-none">Pipeline</h2>
                                <p className="text-[10px] text-dark-text-muted mt-0.5 truncate">Build your workflow</p>
                            </div>
                        </div>
                    )}
                    
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1.5 rounded-lg text-dark-text-muted hover:text-white hover:bg-white/10 transition-colors"
                    >
                        {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-4 custom-scrollbar">
                    {categories.map((category, index) => (
                        <div key={index} className="space-y-2">
                            <h3 className={`text-[10px] font-semibold text-dark-text-muted uppercase tracking-wider transition-all duration-300
                                ${isExpanded ? 'pl-2 text-left' : 'text-center text-[9px]'}
                            `}>
                                {isExpanded ? category.label : category.label.substring(0, 4) + '..'}
                            </h3>
                            
                            <div className={`grid gap-2 transition-all duration-300
                                ${isExpanded ? 'grid-cols-1' : 'grid-cols-1 justify-items-center'}
                            `}>
                                {category.items.map(itemKey => (
                                    <DraggableNode 
                                        key={itemKey}
                                        type={itemKey} 
                                        label={nodeConfigs[itemKey]?.title || itemKey} 
                                        icon={nodeConfigs[itemKey]?.icon}
                                        accentColor={nodeConfigs[itemKey]?.accentColor}
                                        isExpanded={isExpanded}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {!isExpanded && (
                    <div className="p-2 border-t border-white/5 flex justify-center">
                        <div className="w-1 h-1 rounded-full bg-accent-purple/50" />
                    </div>
                )}
            </div>
        </div>
    );
};
