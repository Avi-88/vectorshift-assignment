// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

// Helper function to save state to history
const saveToHistory = (state, nodes, edges) => {
  const history = state.history || [];
  const historyIndex = state.historyIndex !== undefined ? state.historyIndex : -1;
  
  // Remove any future history if we're not at the end
  const newHistory = historyIndex < history.length - 1 
    ? history.slice(0, historyIndex + 1)
    : history;
  
  // Add new state to history (limit to 50 entries)
  const updatedHistory = [...newHistory, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }].slice(-50);
  
  return {
    history: updatedHistory,
    historyIndex: updatedHistory.length - 1
  };
};

export const useStore = create((set, get) => {
  // Initialize with empty state in history
  const initialState = { nodes: [], edges: [] };
  
  return {
    nodes: [],
    edges: [],
    history: [initialState],
    historyIndex: 0,
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        const currentNodes = get().nodes;
        const currentEdges = get().edges;
        const newNodes = [...currentNodes, node];
        const historyUpdate = saveToHistory(get(), newNodes, currentEdges);
        set({
            nodes: newNodes,
            ...historyUpdate
        });
    },
    onNodesChange: (changes) => {
      const currentNodes = get().nodes;
      const currentEdges = get().edges;
      const newNodes = applyNodeChanges(changes, currentNodes);
      const historyUpdate = saveToHistory(get(), newNodes, currentEdges);
      set({
        nodes: newNodes,
        ...historyUpdate
      });
    },
    onEdgesChange: (changes) => {
      const currentNodes = get().nodes;
      const currentEdges = get().edges;
      const newEdges = applyEdgeChanges(changes, currentEdges);
      const historyUpdate = saveToHistory(get(), currentNodes, newEdges);
      set({
        edges: newEdges,
        ...historyUpdate
      });
    },
    onConnect: (connection) => {
      const currentNodes = get().nodes;
      const currentEdges = get().edges;
      const newEdges = addEdge({...connection, type: 'smoothstep', animated: true, markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}}, currentEdges);
      const historyUpdate = saveToHistory(get(), currentNodes, newEdges);
      set({
        edges: newEdges,
        ...historyUpdate
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      const currentNodes = get().nodes;
      const currentEdges = get().edges;
      const newNodes = currentNodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, [fieldName]: fieldValue } };
        }
        return node;
      });
      const historyUpdate = saveToHistory(get(), newNodes, currentEdges);
      set({
        nodes: newNodes,
        ...historyUpdate
      });
    },
    undo: () => {
      const state = get();
      const { history, historyIndex } = state;
      if (historyIndex > 0) {
        const previousState = history[historyIndex - 1];
        set({
          nodes: JSON.parse(JSON.stringify(previousState.nodes)),
          edges: JSON.parse(JSON.stringify(previousState.edges)),
          historyIndex: historyIndex - 1
        });
      }
    },
    redo: () => {
      const state = get();
      const { history, historyIndex } = state;
      if (historyIndex < history.length - 1) {
        const nextState = history[historyIndex + 1];
        set({
          nodes: JSON.parse(JSON.stringify(nextState.nodes)),
          edges: JSON.parse(JSON.stringify(nextState.edges)),
          historyIndex: historyIndex + 1
        });
      }
    },
    canUndo: () => {
      const state = get();
      return state.historyIndex > 0;
    },
    canRedo: () => {
      const state = get();
      return state.historyIndex < (state.history?.length || 0) - 1;
    },
  };
});
