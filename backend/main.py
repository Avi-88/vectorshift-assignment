from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional

app = FastAPI()

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class PipelineRequest(BaseModel):
    nodes: List[Dict]
    edges: List[Dict]

class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool

def is_dag(nodes: List[Dict], edges: List[Dict]) -> bool:
    """
    Check if the graph represented by nodes and edges is a DAG using DFS.
    Returns True if no cycles are detected, False otherwise.
    """
    if not nodes or not edges:
        return True  # Empty graph is considered a DAG
    
    # Build adjacency list from edges
    # Edges have 'source' and 'target' fields
    adjacency_list = {}
    node_ids = {node['id'] for node in nodes}
    
    # Initialize adjacency list for all nodes
    for node_id in node_ids:
        adjacency_list[node_id] = []
    
    # Build edges: source -> target
    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        if source and target and source in node_ids and target in node_ids:
            adjacency_list[source].append(target)
    
    # Track visited nodes and nodes in current recursion stack
    visited = set()
    rec_stack = set()
    
    def dfs(node_id: str) -> bool:
        """
        DFS helper function. Returns False if cycle detected, True otherwise.
        """
        # If node is in recursion stack, we found a cycle
        if node_id in rec_stack:
            return False
        
        # If already visited, skip (already processed)
        if node_id in visited:
            return True
        
        # Mark as visited and add to recursion stack
        visited.add(node_id)
        rec_stack.add(node_id)
        
        # Visit all neighbors
        for neighbor in adjacency_list.get(node_id, []):
            if not dfs(neighbor):
                return False  # Cycle detected
        
        # Remove from recursion stack (backtrack)
        rec_stack.remove(node_id)
        return True
    
    # Run DFS for each unvisited node
    for node_id in node_ids:
        if node_id not in visited:
            if not dfs(node_id):
                return False  # Cycle detected
    
    return True  # No cycles found

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse', response_model=PipelineResponse)
def parse_pipeline(request: PipelineRequest):
    """
    Parse pipeline and check if it's a DAG.
    Returns number of nodes, edges, and whether the graph is a DAG.
    """
    nodes = request.nodes
    edges = request.edges
    
    # Calculate counts
    num_nodes = len(nodes)
    num_edges = len(edges)
    
    # Check if DAG
    is_dag_result = is_dag(nodes, edges)
    
    return PipelineResponse(
        num_nodes=num_nodes,
        num_edges=num_edges,
        is_dag=is_dag_result
    )
