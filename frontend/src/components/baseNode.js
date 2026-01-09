import { useState, useMemo } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../utils/store';
import { Node } from '../schemas/nodeSchema';
import * as LucideIcons from 'lucide-react';

const accentColors = {
  blue: { 
    bg: 'bg-accent-blue', 
    shadow: 'shadow-[0_0_8px_rgba(96,165,250,0.5)]',
    borderColor: '#60a5fa'
  },
  purple: { 
    bg: 'bg-accent-purple', 
    shadow: 'shadow-[0_0_8px_rgba(192,132,252,0.5)]',
    borderColor: '#c084fc'
  },
  pink: { 
    bg: 'bg-accent-pink', 
    shadow: 'shadow-[0_0_8px_rgba(244,114,182,0.5)]',
    borderColor: '#f472b6'
  },
  green: { 
    bg: 'bg-accent-green', 
    shadow: 'shadow-[0_0_8px_rgba(74,222,128,0.5)]',
    borderColor: '#4ade80'
  },
};

function BaseNode({ id, data, config }) {
  const { updateNodeField } = useStore();
  
  // Validate config
  const validatedConfig = useMemo(() => {
    if (!config) return null;
    const result = Node.safeParse(config);
    if (!result.success) {
      console.error('Invalid node config:', result.error);
      return null;
    }
    return result.data;
  }, [config]);

  // Initialize field state from data or defaults - must be called before early return
  const [fieldValues, setFieldValues] = useState(() => {
    if (!config) return {};
    const initial = {};
    if (config.inputFields) {
      config.inputFields.forEach(field => {
        const defaultValue = typeof field.defaultValue === 'function' 
          ? field.defaultValue(id) 
          : (field.defaultValue ?? '');
        initial[field.key] = data?.[field.key] ?? defaultValue;
      });
    }
    return initial;
  });

  if (!validatedConfig) {
    return (
      <div className="glass-node min-w-[200px] p-3 text-red-400 text-xs">
        Invalid node configuration
      </div>
    );
  }

  const accentColor = validatedConfig.accentColor || 'blue';
  const colorConfig = accentColors[accentColor];

  // Generic field change handler
  const handleFieldChange = (fieldKey, value) => {
    setFieldValues(prev => ({ ...prev, [fieldKey]: value }));
    updateNodeField(id, fieldKey, value);
  };

  // Render field based on type
  const renderField = (field) => {
    const value = fieldValues[field.key] ?? '';
    const isDisabled = field.disabled || false;

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            disabled={isDisabled}
            className="nodrag w-full px-2.5 py-1.5 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-all placeholder-white/20"
            aria-label={field.label}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            disabled={isDisabled}
            rows={3}
            className="nodrag w-full px-2.5 py-1.5 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-all resize-y min-h-[60px] font-mono leading-relaxed placeholder-white/20"
            aria-label={field.label}
          />
        );
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            disabled={isDisabled}
            className="nodrag w-full px-2.5 py-1.5 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-all appearance-none cursor-pointer"
            aria-label={field.label}
          >
            {field.options?.map((option, idx) => {
              const optionValue = typeof option === 'string' ? option : option.value;
              const optionLabel = typeof option === 'string' ? option : option.label;
              return (
                <option key={idx} value={optionValue}>
                  {optionLabel}
                </option>
              );
            })}
          </select>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.key, parseFloat(e.target.value) || 0)}
            placeholder={field.placeholder}
            disabled={isDisabled}
            className="nodrag w-full px-2.5 py-1.5 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-all placeholder-white/20"
            aria-label={field.label}
          />
        );
      
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => handleFieldChange(field.key, e.target.checked)}
            disabled={isDisabled}
            className="nodrag w-4 h-4 rounded bg-black/30 border border-white/10 text-accent-blue focus:ring-1 focus:ring-accent-blue/50"
            aria-label={field.label}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="glass-node min-w-[200px]">
      {/* Render handles */}
      {validatedConfig.handles && validatedConfig.handles.length > 0 ? validatedConfig.handles.map((handle, index) => {
        const handleId = handle.id.startsWith(`${id}-`) ? handle.id : `${id}-${handle.id}`;
        const totalHandles = validatedConfig.handles.length;
        const topPosition = totalHandles > 1 
          ? `${((index + 1) * 100) / (totalHandles + 1)}%`
          : '50%';
        
        return (
          <Handle
            key={handleId}
            type={handle.type}
            position={handle.position}
            id={handleId}
            style={{ 
              top: handle.style?.top || topPosition,
              borderColor: colorConfig.borderColor,
              ...handle.style 
            }}
            className={`!bg-black !w-2 !h-2 !border-2 ${handle.position === Position.Left ? '!-left-1' : '!-right-1'}`}
          />
        );
      }) : null}

      {/* Header */}
      <div className={`px-3 py-2 border-b border-white/5 bg-white/5 flex items-center gap-2`}>
        <div className={`w-1.5 h-1.5 rounded-full ${colorConfig.bg} ${colorConfig.shadow}`} />
        {validatedConfig.icon && (() => {
          const IconComponent = LucideIcons[validatedConfig.icon];
          return IconComponent ? <IconComponent className="w-3 h-3 text-dark-text-muted" /> : null;
        })()}
        <span className="text-white font-semibold text-xs tracking-wide">{validatedConfig.title}</span>
        {validatedConfig.subTitle && (
          <span className="text-dark-text-muted text-[10px] ml-auto">{validatedConfig.subTitle}</span>
        )}
      </div>

      {/* Description */}
      {validatedConfig.description && (
        <div className="px-3 py-1.5 border-b border-white/5">
          <p className="text-[10px] text-dark-text-muted">{validatedConfig.description}</p>
        </div>
      )}

      {/* Fields */}
      {validatedConfig.inputFields && validatedConfig.inputFields.length > 0 && (
        <div className="p-3 space-y-3 nodrag">
          {validatedConfig.inputFields.map((field) => (
            <label key={field.key} className="block space-y-1 nodrag">
              <span className="text-dark-text-muted text-[10px] font-medium uppercase tracking-wider">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </span>
              {renderField(field)}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default BaseNode;
