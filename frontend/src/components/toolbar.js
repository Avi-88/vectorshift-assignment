// toolbar.js

import { DraggableNode } from './draggableNode';
import { nodeConfigs } from '../config/nodeConfigs';

export const PipelineToolbar = () => {

    return (
        <div className="w-64 glass-panel h-[calc(100vh-40px)] m-5 rounded-2xl overflow-hidden flex flex-col shadow-2xl z-10">
            <div className="p-4 border-b border-white/5 bg-white/5 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-2">
                     
                </div>
                <h2 className="text-base font-bold text-white tracking-tight">VectorShift</h2>
                <p className="text-xs text-dark-text-muted mt-0.5">Drag and drop to build</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-dark-text-muted uppercase tracking-wider pl-1">General</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <DraggableNode type='customInput' label={nodeConfigs.customInput.title} icon={nodeConfigs.customInput.icon} />
                        <DraggableNode type='customOutput' label={nodeConfigs.customOutput.title} icon={nodeConfigs.customOutput.icon} />
                        <DraggableNode type='text' label={nodeConfigs.text.title} icon={nodeConfigs.text.icon} />
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-dark-text-muted uppercase tracking-wider pl-1">AI Models</h3>
                    <div className="grid grid-cols-1 gap-2">
                         <DraggableNode type='llm' label={nodeConfigs.llm.title} icon={nodeConfigs.llm.icon} />
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-dark-text-muted uppercase tracking-wider pl-1">Data Processing</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <DraggableNode type='filter' label={nodeConfigs.filter.title} icon={nodeConfigs.filter.icon} />
                        <DraggableNode type='transform' label={nodeConfigs.transform.title} icon={nodeConfigs.transform.icon} />
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-dark-text-muted uppercase tracking-wider pl-1">Integration</h3>
                    <div className="grid grid-cols-1 gap-2">
                        <DraggableNode type='apiRequest' label={nodeConfigs.apiRequest.title} icon={nodeConfigs.apiRequest.icon} />
                        <DraggableNode type='databaseQuery' label={nodeConfigs.databaseQuery.title} icon={nodeConfigs.databaseQuery.icon} />
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-dark-text-muted uppercase tracking-wider pl-1">Utilities</h3>
                    <div className="grid grid-cols-1 gap-2">
                        <DraggableNode type='note' label={nodeConfigs.note.title} icon={nodeConfigs.note.icon} />
                    </div>
                </div>
            </div>
        </div>
    );
};
