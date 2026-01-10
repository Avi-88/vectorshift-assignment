from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PipelineRequest(BaseModel):
    nodes: List[Dict]
    edges: List[Dict]

class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool

# DFS helper function
def dfs(node_id: str, adjacency_list: Dict[str, List[str]], visited: set, rec_stack: set) -> bool:
    if node_id in rec_stack:
        return False

    if node_id in visited:
        return True
    
    # Mark as visited and add to recursion stack
    visited.add(node_id)
    rec_stack.add(node_id)
    
    for neighbor in adjacency_list.get(node_id, []):
        if not dfs(neighbor, adjacency_list, visited, rec_stack):
            return False  
    
    rec_stack.remove(node_id)
    return True

def is_dag(nodes: List[Dict], edges: List[Dict]) -> bool:
    """
    Check if the graph represented by nodes and edges is a DAG using DFS.
    Returns True if no cycles are detected, False otherwise.
    """

    # check for empty graphs
    if not nodes or not edges:
        return True  
    
    # Building an adjacency list to determine DAG
    adjacency_list = {}
    node_ids = {node['id'] for node in nodes}
    
    for node_id in node_ids:
        adjacency_list[node_id] = []
    
    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        if source and target and source in node_ids and target in node_ids:
            adjacency_list[source].append(target)
    
    visited = set()
    rec_stack = set()
    
    # Run DFS 
    for node_id in node_ids:
        if node_id not in visited:
            if not dfs(node_id, adjacency_list, visited, rec_stack):
                return False 
    
    return True  

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse', response_model=PipelineResponse)
def parse_pipeline(request: PipelineRequest):
    nodes = request.nodes
    edges = request.edges
    
    num_nodes = len(nodes)
    num_edges = len(edges)
    
    is_dag_result = is_dag(nodes, edges)
    
    return PipelineResponse(
        num_nodes=num_nodes,
        num_edges=num_edges,
        is_dag=is_dag_result
    )
