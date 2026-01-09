// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback, useMemo } from 'react';
import ReactFlow, { Background, MiniMap, Controls, ReactFlowProvider } from 'reactflow';
import { useStore } from './utils/store';
import { shallow } from 'zustand/shallow';
import BaseNode from './components/baseNode';
import { nodeConfigs } from './config/nodeConfigs';
import { TextNode } from './config/textNode';

import 'reactflow/dist/style.css';
import { BottomToolbar } from './components/bottomToolbar';

const gridSize = 20;
const proOptions = { hideAttribution: true };

// Create nodeTypes mapping using BaseNode with configs
// Text node uses special component for dynamic features
const nodeTypes = Object.keys(nodeConfigs).reduce((nodes, type) => {
  nodes[type] = (props) => <BaseNode {...props} config={nodeConfigs[type]} />;
  return nodes;
}, {});

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(selector, shallow);

    // Memoize nodeTypes for performance
    const memoizedNodeTypes = useMemo(() => nodeTypes, []);

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            try {
              const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
              const type = appData?.nodeType;
        
              // check if the dropped element is valid
              if (typeof type === 'undefined' || !type) {
                return;
              }
        
              const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
              });

              const nodeID = getNodeID(type);
              const newNode = {
                id: nodeID,
                type,
                position,
                data: getInitNodeData(nodeID, type),
              };
        
              addNode(newNode);
            } catch (error) {
              console.error('Error parsing dropped node data:', error);
            }
          }
        },
        [reactFlowInstance, getNodeID, addNode]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    // Memoize callbacks for performance
    const memoizedOnNodesChange = useCallback((changes) => {
      onNodesChange(changes);
    }, [onNodesChange]);

    const memoizedOnEdgesChange = useCallback((changes) => {
      onEdgesChange(changes);
    }, [onEdgesChange]);

    const memoizedOnConnect = useCallback((connection) => {
      onConnect(connection);
    }, [onConnect]);

    return (
        <ReactFlowProvider>
            <div ref={reactFlowWrapper} className="w-full h-full bg-dark-bg">
                <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={memoizedOnConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={memoizedNodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
                aria-label="Pipeline canvas"
            >
                <Background variant="dots" gap={gridSize} size={1} color="#52525b" />
                <Controls className="!bg-dark-card/50 !border-white/10 !backdrop-blur-md" />
                <MiniMap 
                    className="!bg-dark-card/50 !border-white/10 !backdrop-blur-md rounded-lg overflow-hidden"
                    nodeColor="#52525b"
                    maskColor="rgba(9, 9, 11, 0.8)"
                />
                </ReactFlow>
          
                <BottomToolbar rfInstance={reactFlowInstance}  />
            </div>
        </ReactFlowProvider>
    )
}
