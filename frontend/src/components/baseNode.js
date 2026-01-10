import { useState, useMemo, useEffect, useRef } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { useStore } from '../utils/store';
import { Node } from '../schemas/nodeSchema';
import * as LucideIcons from 'lucide-react';

const accentColors = {
  blue: { 
    bg: 'bg-accent-blue', 
    text: 'text-accent-blue',
    shadow: 'shadow-[0_0_8px_rgba(99,102,241,0.5)]',
    borderColor: '#6366F1'
  },
  purple: { 
    bg: 'bg-accent-purple', 
    text: 'text-accent-purple',
    shadow: 'shadow-[0_0_8px_rgba(168,85,247,0.5)]',
    borderColor: '#A855F7'
  },
  pink: { 
    bg: 'bg-accent-pink', 
    text: 'text-accent-pink',
    shadow: 'shadow-[0_0_8px_rgba(236,72,153,0.5)]',
    borderColor: '#EC4899'
  },
  green: { 
    bg: 'bg-accent-green', 
    text: 'text-accent-green',
    shadow: 'shadow-[0_0_8px_rgba(74,222,128,0.5)]',
    borderColor: '#4ade80'
  },
};

// Regex to find {{ variableName }} patterns
const VARIABLE_PATTERN = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

// Validate and sanitize JavaScript identifier
const isValidIdentifier = (name) => {
  // Strict validation: must start with letter, underscore, or $, followed by letters, digits, underscore, or $
  const validPattern = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
  return validPattern.test(name) && name.length <= 50; 
};

// Sanitize variable name to prevent injection
const sanitizeVariableName = (name) => {
  return name.replace(/[^a-zA-Z0-9_$]/g, '').substring(0, 50);
};

function BaseNode({ id, data, config }) {
  const { updateNodeField } = useStore();
  const { setNodes } = useReactFlow();
  const textareaRefs = useRef({});
  
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

  const variableNames = useMemo(() => {
    if (!validatedConfig?.inputFields) return [];
    
    const dynamicTextareas = validatedConfig.inputFields.filter(
      field => field.dynamicSize && field.type === 'textarea'
    );
    
    const uniqueVars = new Set();
    
    dynamicTextareas.forEach((field) => {
      const textValue = fieldValues[field.key] || '';
      if (!textValue) return;
      
      const matches = [...textValue.matchAll(VARIABLE_PATTERN)];
      
      matches.forEach(match => {
        const rawName = match[1];
        const sanitized = sanitizeVariableName(rawName);
        if (isValidIdentifier(sanitized) && sanitized.length > 0) {
          uniqueVars.add(sanitized);
        }
      });
    });
    
    // currently limited to 10 
    return Array.from(uniqueVars).slice(0, 10);
  }, [fieldValues, validatedConfig]);

useEffect(() => {
  if (!validatedConfig?.inputFields) return;
  
  // Find all textarea fields with dynamicSize enabled
  const dynamicTextareas = validatedConfig.inputFields.filter(
    field => field.dynamicSize && field.type === 'textarea'
  );
  
  if (dynamicTextareas.length === 0) return;
  
  let maxWidth = 0;
  let totalHeight = 0;
  const baseHeight = 80;
  const fieldSpacing = 12;
  
  dynamicTextareas.forEach((field, index) => {
    const textarea = textareaRefs.current[field.key];
    if (!textarea) return;
    
    const scrollHeight = textarea.scrollHeight;
    const minHeight = field.minHeight || 60;
    const maxHeight = field.maxHeight || 300;
    const calculatedHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    
    const minWidth = field.minWidth || 220;
    const maxWidthField = field.maxWidth || 400;
    const contentWidth = Math.max(textarea.scrollWidth, minWidth);
    const calculatedWidth = Math.min(contentWidth, maxWidthField);
    
    maxWidth = Math.max(maxWidth, calculatedWidth);
    const fieldHeight = calculatedHeight + 20 + (index > 0 ? fieldSpacing : 0);
    totalHeight += fieldHeight;
  });
  
  if (maxWidth === 0) {
    maxWidth = 220;
    totalHeight = 60;
  }
  
  setNodes((nds) =>
    nds.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          width: maxWidth,
          height: totalHeight + baseHeight,
        };
      }
      return node;
    })
  );
}, [fieldValues, validatedConfig, id, setNodes]); 

  if (!validatedConfig) {
    return (
      <div className="glass-node min-w-[200px] p-3 text-red-400 text-xs">
        Invalid node configuration
      </div>
    );
  }

  const accentColor = validatedConfig.accentColor || 'blue';
  const colorConfig = accentColors[accentColor];

  const handleFieldChange = (fieldKey, value) => {
    setFieldValues(prev => ({ ...prev, [fieldKey]: value }));
    updateNodeField(id, fieldKey, value);
  };

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
            ref={(el) => textareaRefs.current[field.key] = el}
            value={value}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            disabled={isDisabled}
            rows={3}
            className="nodrag w-full px-2.5 py-1.5 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-all resize-y min-h-[60px] font-mono leading-relaxed placeholder-white/20"
            aria-label={field.label}
            style={{ 
              height: 'auto',
              overflow: 'hidden' 
            }}
            onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
            }}
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
    <div className="glass-node min-w-[300px] min-h-[150px] flex flex-col">
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
            className={`!bg-black !w-3 !h-3 !border-2 ${handle.position === Position.Left ? '!-left-[6px]' : '!-right-[6px]'}`}
          />
        );
      }) : null}

      {variableNames.map((varName, index) => (
        <Handle
          key={`${id}-${varName}`}
          type="target"
          position={Position.Left}
          id={`${id}-${varName}`}
          style={{
            top: `${((index + 1) * 100) / (variableNames.length + 1)}%`
          }}
          className="!bg-black !border-accent-green !w-3 !h-3 !-left-[6px]"
        />
      ))}


      <div className={`px-4 py-3 rounded-t-2xl border-b border-white/5 bg-white/5 flex items-center gap-3`}>
        <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm`}>
            {validatedConfig.icon && (() => {
            const IconComponent = LucideIcons[validatedConfig.icon];
            return IconComponent ? <IconComponent className={`w-5 h-5 ${colorConfig.text}`} /> : null;
            })()}
        </div>
  
        <div className="flex flex-col flex-1 min-w-0">
            <span className="text-white font-bold text-sm tracking-tight truncate">{validatedConfig.title}</span>
            <span className="text-dark-text-muted text-[10px] font-medium truncate">
                {validatedConfig.description || validatedConfig.subTitle || 'VectorShift Node'}
            </span>
        </div>
      </div>


      {validatedConfig.inputFields && validatedConfig.inputFields.length > 0 && (
        <div className="p-4 space-y-3 nodrag flex-1 bg-black/20">
          {validatedConfig.inputFields.map((field) => (
            <label key={field.key} className="block space-y-1.5 nodrag">
              <span className="text-dark-text-muted text-[10px] font-semibold uppercase tracking-wider ml-0.5">
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
