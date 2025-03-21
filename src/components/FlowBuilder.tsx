// src/components/FlowBuilder.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  useReactFlow,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes } from './nodes/NodeTypes';
import { useAutoSave } from '../hooks/useAutoSave';
import { loadFlowState, clearFlowState } from '../lib/localStorage';
import { FlowState, NodeTypes, CustomNode } from '../types/FlowTypes';
import { RichCardData, CarouselCardData } from '../types/CardTypes';
import { Button } from './ui/button';

const defaultEdgeOptions = {
  animated: true,
  style: { stroke: '#a3a3a3', strokeWidth: 2 },
};

/**
 * FlowBuilder Component
 * 
 * This component provides a visual flow builder interface using React Flow. It allows users to create, edit, and manage
 * nodes and edges in a flow diagram. The component supports loading initial data from localStorage or a sample JSON file,
 * autosaving the flow state, and adding new nodes dynamically.
 * 
 * Features:
 * - Load initial flow data from localStorage or a sample JSON file.
 * - Autosave flow state to localStorage.
 * - Add new nodes of type "Rich Card" or "Carousel Card" to the flow.
 * - Reset the flow by clearing localStorage and reloading the page.
 * - Visualize nodes and edges with React Flow, including controls, minimap, and background grid.
 * 
 * @component
 * @returns {JSX.Element} The FlowBuilder component.
 * 
 * @remarks
 * - This component uses React Flow for rendering and managing the flow diagram.
 * - The flow state (nodes and edges) is managed using React state hooks.
 * - Autosave functionality is implemented using a custom `useAutoSave` hook.
 * 
 * @example
 * ```tsx
 * import FlowBuilder from './FlowBuilder';
 * 
 * const App = () => {
 *   return (
 *     <div>
 *       <FlowBuilder />
 *     </div>
 *   );
 * };
 * 
 * export default App;
 * ```
 * 
 * @dependencies
 * - `react-flow-renderer`: Used for rendering the flow diagram.
 * - `useNodesState`, `useEdgesState`: Hooks for managing nodes and edges state.
 * - `useReactFlow`: Hook for accessing React Flow instance.
 * 
 * @state
 * - `nodes`: Array of nodes in the flow.
 * - `edges`: Array of edges connecting the nodes.
 * - `isLoading`: Boolean indicating whether the initial data is being loaded.
 * 
 * @methods
 * - `fetchInitialData`: Loads initial flow data from localStorage or a sample JSON file.
 * - `onConnect`: Handles edge connections between nodes.
 * - `handleReset`: Resets the flow by clearing localStorage and reloading the page.
 * - `addNode`: Adds a new node of the specified type to the flow.
 * 
 * @hooks
 * - `useEffect`: Used to fetch initial data when the component mounts.
 * - `useCallback`: Used to memoize event handlers for performance optimization.
 * 
 * @ui
 * - Displays a loading screen while data is being fetched.
 * - Provides buttons to add nodes and reset the flow.
 * - Includes React Flow controls, minimap, and background grid for better visualization.
 */

const FlowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isLoading, setIsLoading] = useState(true);
  const reactFlowInstance = useReactFlow();

  // Load sample data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      
      try {
        // First, try to load from localStorage
        const savedState = loadFlowState();
        
        if (savedState && savedState.nodes.length > 0) {
          setNodes(savedState.nodes);
          setEdges(savedState.edges);
        } else {
          // If no saved state, load from sample data
          const response = await fetch('/data/sampleData.json');
          const data = await response.json();
          
          // Create nodes from sample data
          const richCardNodes: CustomNode[] = data.richCards.map((card: RichCardData, index: number) => ({
            id: card.id,
            type: NodeTypes.RICH_CARD,
            data: card,
            position: { x: 250 * index, y: 300 },
          }));
          
          const carouselCardNodes: CustomNode[] = data.carouselCards.map((card: CarouselCardData, index: number) => ({
            id: card.id,
            type: NodeTypes.CAROUSEL_CARD,
            data: card,
            position: { x: 250 * index, y: 50 },
          }));
          
          // Combine nodes
          const allNodes = [...carouselCardNodes, ...richCardNodes];
          
          // Create sample edges
          const sampleEdges: Edge[] = [];
          
          // Connect carousel to its rich cards
          data.carouselCards.forEach((carousel: CarouselCardData) => {
            carousel.cards.forEach((card: RichCardData) => {
              sampleEdges.push({
                id: `${carousel.id}-to-${card.id}`,
                source: carousel.id as string,
                target: card.id,
              });
            });
          });
          
          setNodes(allNodes);
          setEdges(sampleEdges);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [setNodes, setEdges]);

  // Set up autosave
  const flowState: FlowState = {
    nodes,
    edges,
  };
  
  useAutoSave(flowState, { enabled: !isLoading });

  // Handle edge connections
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  // Reset the flow (clear localStorage and reload)
  const handleReset = useCallback(() => {
    clearFlowState();
    window.location.reload();
  }, []);

  // Add new node to the flow
  const addNode = useCallback(
    (type: NodeTypes) => {
      const id = `${type}-${Date.now()}`;
      const { x: viewportX, y: viewportY, zoom } = reactFlowInstance.getViewport();
      const position = {
        x: (Math.random() * 400 - viewportX) / zoom,
        y: (Math.random() * 400 - viewportY) / zoom,
      };

      let newNode: CustomNode;
      
      if (type === NodeTypes.RICH_CARD) {
        newNode = {
          id,
          type,
          position,
          data: {
            id,
            title: 'New Rich Card',
            description: 'Add a description here...',
            imageUrl: '',
            buttons: [],
          },
        } as CustomNode;
      } else {
        // Carousel Card
        newNode = {
          id,
          type,
          position,
          data: {
            cards: [
              {
                id: `${id}-card-1`,
                title: 'Card 1',
                description: 'Add a description here...',
                imageUrl: '',
                buttons: [],
              }
            ]
          },
        } as CustomNode;
      }
      
      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes]
  );

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className=" w-[100%]" style={{height:'94vh'}}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />

        {/* Add to flow section */}
        <Panel position="bottom-center" className="mb-2">
          <div className="bg-white rounded-lg border border-gray-300 overflow-hidden m-2">
            <div className="bg-black text-white px-2 py-2 flex items-center">
              <span className='text-xs'>+ Add to flow</span>
            </div>
            <div className="flex border-b mt-2">
              <Button
                onClick={() => addNode(NodeTypes.RICH_CARD)}
                className=" text-white !px-2 !py-2 rounded hover:bg-gray-600 text-xs"
              >
                <span className='text-xs'>Add Rich Card</span>
                
              </Button>
              <Button
                onClick={() => addNode(NodeTypes.CAROUSEL_CARD)}
                className=" text-white !px-2 !py-2 rounded hover:bg-gray-600"
              >
                <span className='text-xs'>Add Carousel Card</span>
              </Button>
              <Button
                onClick={handleReset}
                className=" text-white !px-2 !py-2 rounded hover:bg-gray-600"
              >
                <span className='text-xs'>Reset Flow</span>
                
              </Button>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default FlowBuilder;