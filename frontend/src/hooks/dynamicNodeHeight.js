import React, {useEffect} from 'react'
import { useReactFlow } from 'reactflow';

export const useDynamicNodeHeight = (ref, nodeId) => {

    const {setNodes} = useReactFlow();

    useEffect(() => {
        const listener = () => {
            if (ref.current) {
                const textarea = ref.current;
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
                    if (node.id === nodeId) {
                      return {
                        ...node,
                        width: newWidth,
                        height: newHeight + 80, 
                      };
                    }
                    return node;
                  })
                );
              }
        }
        ref.current.addEventListener("input", listener);
    }, [ref]);
}
