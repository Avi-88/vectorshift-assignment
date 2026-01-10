import { useState, useEffect, useRef, useMemo } from 'react';
import { Handle, Position, useReactFlow, useUpdateNodeInternals } from 'reactflow';
import { useStore } from '../utils/store';
import { nodeConfigs } from './nodeConfigs';
import * as LucideIcons from 'lucide-react';

// Regex to find {{ variableName }} patterns
const VARIABLE_PATTERN = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

// Validate and sanitize JavaScript identifier
const isValidIdentifier = (name) => {
  // Strict validation: must start with letter, underscore, or $, followed by letters, digits, underscore, or $
  const validPattern = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
  return validPattern.test(name) && name.length <= 50; // Limit length for security
};

// Sanitize variable name to prevent injection
const sanitizeVariableName = (name) => {
  // Remove any characters that aren't valid for JS identifiers
  return name.replace(/[^a-zA-Z0-9_$]/g, '').substring(0, 50);
};

export const TextNode = ({ id, data, config }) => {
  const { setNodes } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();
  const { updateNodeField } = useStore();
  const textareaRef = useRef(null);
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  
  // Extract unique variable names from text with sanitization
  const variableNames = useMemo(() => {
    const matches = [...currText.matchAll(VARIABLE_PATTERN)];
    const uniqueVars = new Set();
    matches.forEach(match => {
      const rawName = match[1];
      const sanitized = sanitizeVariableName(rawName);
      if (isValidIdentifier(sanitized) && sanitized.length > 0) {
        uniqueVars.add(sanitized);
      }
    });
    // Limit to maximum 10 handles for performance
    return Array.from(uniqueVars).slice(0, 10);
  }, [currText]);

  // Update node dimensions based on textarea content
  useEffect(() => {
    if (textareaRef.current) {

      const textarea = textareaRef.current;
      const scrollHeight = textarea.scrollHeight;
      const minHeight = 60;
      const maxHeight = 300;
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      
      // Calculate width based on content (with min/max constraints)
      const minWidth = 220;
      const maxWidth = 400;
      const contentWidth = Math.max(textarea.scrollWidth, minWidth);
      const newWidth = Math.min(contentWidth, maxWidth);

      // Update node dimensions
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              width: newWidth,
              height: newHeight + 80, // Add header and padding
            };
          }
          return node;
        })
      );
    }
  }, [currText, id, setNodes]);

  // Update handles when variables change
  useEffect(() => {
    updateNodeInternals(id);
  }, [variableNames, id, updateNodeInternals]);

  // Handle text change
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setCurrText(newText);
    // Update store
    updateNodeField(id, 'text', newText);
  };

  // Get base config for text node
  const baseConfig = nodeConfigs.text;

  return (
    <>
      {/* Render dynamic target handles for variables */}
      {variableNames.map((varName, index) => (
        <Handle
          key={`${id}-${varName}`}
          type="target"
          position={Position.Left}
          id={`${id}-${varName}`}
          style={{
            top: `${((index + 1) * 100) / (variableNames.length + 1)}%`
          }}
          className="!bg-black !border-accent-green !w-2 !h-2 !-left-1"
        />
      ))}
      
      {/* Use BaseNode structure but with dynamic features */}
      <div className="glass-node min-w-[220px]">
        <div className="px-3 py-2 border-b border-white/5 bg-white/5 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-green shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
          {baseConfig.icon && (() => {
            const IconComponent = LucideIcons[baseConfig.icon];
            return IconComponent ? <IconComponent className="w-3 h-3 text-dark-text-muted" /> : null;
          })()}
          <span className="text-white font-semibold text-xs tracking-wide">{baseConfig.title}</span>
        </div>

        <div className="p-3 nodrag">
          <label className="block space-y-1 nodrag">
            <span className="text-dark-text-muted text-[10px] font-medium uppercase tracking-wider">Input Text</span>
            <textarea
              ref={textareaRef}
              value={currText}
              onChange={handleTextChange}
              rows={3}
              className="nodrag w-full px-2.5 py-1.5 bg-black/30 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-accent-green/50 focus:ring-1 focus:ring-accent-green/50 transition-all resize-y min-h-[60px] font-mono leading-relaxed placeholder-white/20"
              placeholder="Type something here... Use {{variable}} for dynamic handles."
              style={{ height: 'auto', overflow: 'hidden' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />
          </label>
        </div>

        <Handle
          type="source"
          position={Position.Right}
          id={`${id}-output`}
          className="!bg-black !border-accent-green !w-2 !h-2 !-right-1"
        />
      </div>
    </>
  );
};
