// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback, useMemo } from 'react';
import ReactFlow, { Background, MiniMap, Controls, ReactFlowProvider } from 'reactflow';
import { useStore } from './utils/store';
import { shallow } from 'zustand/shallow';
import BaseNode from './components/baseNode';
import { nodeConfigs } from './config/nodeConfigs';
import { ResponseModal } from './components/ResponseModal';

import 'reactflow/dist/style.css';
import { BottomToolbar } from './components/bottomToolbar';

const gridSize = 20;
const proOptions = { hideAttribution: true };

// Create nodeTypes mapping using BaseNode with configs
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
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const handleSubmitFlow = async () => {
      setIsLoading(true);
      setError(null);
      setResponse(null);
      try {
        if(nodes.length === 0 && edges.length === 0){
          setError('Failed to validate pipeline. Please create a workflow to begin!.');
          setIsModalOpen(true);
          return;
        };


        const payload = {
          nodes: nodes,
          edges: edges
        };
  
        const apiResponse = await fetch('http://localhost:8000/pipelines/parse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
  
        if (!apiResponse.ok) {
          throw new Error(`API error: ${apiResponse.status} ${apiResponse.statusText}`);
        }
  
        const data = await apiResponse.json();
        setResponse(data);
        setIsModalOpen(true);
      } catch (err) {
        setError(err.message || 'Failed to validate pipeline. Please try again.');
        setIsModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
      setResponse(null);
      setError(null);
    };


    return (
        <ReactFlowProvider>
            <div ref={reactFlowWrapper} className="w-full h-full bg-dark-bg">
                <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
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
          
                <BottomToolbar isLoading={isLoading} handleSubmit={handleSubmitFlow}  />
                <ResponseModal
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                  response={response}
                  error={error}
                />
            </div>
        </ReactFlowProvider>
    )
}
