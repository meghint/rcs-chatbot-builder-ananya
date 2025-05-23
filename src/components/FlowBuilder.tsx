// src/components/FlowBuilder.tsx
import React, { useState, useEffect, useCallback } from "react";
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
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Plus } from "lucide-react";
import { nodeTypes } from "./nodes/NodeTypes";
import { useAutoSave } from "../hooks/useAutoSave";
import { loadFlowState } from "../lib/localStorage";
import { FlowState, NodeTypes, CustomNode } from "../types/FlowTypes";
import { RichCardData, CarouselCardData } from "../types/CardTypes";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

const defaultEdgeOptions = {
  animated: true,
  style: { stroke: "#a3a3a3", strokeWidth: 2 },
};

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
          const response = await fetch("/data/sampleData.json");
          const data = await response.json();

          // Create nodes from sample data
          const richCardNodes: CustomNode[] = data.richCards.map(
            (card: RichCardData, index: number) => ({
              id: card.id,
              type: NodeTypes.RICH_CARD,
              data: card,
              position: { x: 250 * index, y: 300 },
            })
          );

          const carouselCardNodes: CustomNode[] = data.carouselCards.map(
            (card: CarouselCardData, index: number) => ({
              id: card.id,
              type: NodeTypes.CAROUSEL_CARD,
              data: card,
              position: { x: 250 * index, y: 50 },
            })
          );

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
        console.error("Error loading initial data:", error);
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

  

  // Add new node to the flow
  const addNode = useCallback(
    (type: NodeTypes) => {
      const id = `${type}-${Date.now()}`;
      const {
        x: viewportX,
        y: viewportY,
        zoom,
      } = reactFlowInstance.getViewport();
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
            title: "New Rich Card",
            description: "Add a description here...",
            imageUrl: "",
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
                title: "Card 1",
                description: "Add a description here...",
                imageUrl: "",
                buttons: [],
              },
            ],
          },
        } as CustomNode;
      }

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes]
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className=" w-[100%]" style={{ height: "100vh" }}>
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
        <Panel position="bottom-center" className="mb-4">
          <div className="bg-white rounded-sm border border-gray-300 overflow-hidden m-2 w-[320px] shadow-lg">
            {/* Header */}
            <div className="bg-black text-white px-3 py-2 flex items-center justify-center gap-2">
              <span className="text-lg">
                <Plus className="w-4 h-4" />
              </span>
              <span className="text-xs font-medium">Add to flow</span>
            </div>
            <Tabs defaultValue="rich" className="w-full bg-gray-100">
              <TabsList className="w-full flex border-b">
              <TabsTrigger
                value="text"
                className="flex-1 !p-1 rounded-none text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Text
              </TabsTrigger>
              <TabsTrigger
                value="rich"
                className="flex-1 !p-1 rounded-none text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-black"
                onClick={() => addNode(NodeTypes.RICH_CARD)}
              >
                Rich
              </TabsTrigger>
              <TabsTrigger
                value="carousel"
                className="flex-1 !p-1 rounded-none text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-black"
                onClick={() => addNode(NodeTypes.CAROUSEL_CARD)}
              >
                Carousel
              </TabsTrigger>
              </TabsList>
            </Tabs>
            {/* Tabs for Bot says / User says */}
              <Tabs defaultValue="bot" className="w-full">
              <TabsList className="w-full flex gap-2">
                <TabsTrigger value="bot" className="flex-1 !p-1 rounded-none text-xs font-medium bg-gray-100">
                Bot says
                </TabsTrigger>
                <TabsTrigger value="user" className="flex-1 !p-1 rounded-none text-xs font-medium bg-gray-100">
                User says
                </TabsTrigger>
              </TabsList>
              </Tabs>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default FlowBuilder;
