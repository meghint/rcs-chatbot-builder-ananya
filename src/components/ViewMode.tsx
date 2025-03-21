import React, { useState, useEffect } from "react";
import { ReactFlow, Background } from "@xyflow/react"; // Importing ReactFlow and Background components from the React Flow library
import "@xyflow/react/dist/style.css"; // Importing the required styles for React Flow
import { nodeTypes } from "./nodes/NodeTypes"; // Importing custom node types for React Flow
import dummyData from "../data/cards.json"; // Importing dummy data for the flow

/**
 * ViewMode Component
 * This component renders a flow diagram using React Flow with nodes and edges.
 * It is designed to display data in a read-only mode.
 */
const ViewMode: React.FC = () => {
  // State to manage the nodes in the flow
  const [nodes, setNodes] = useState<any[]>([]);
  // State to manage the edges in the flow
  const [edges, setEdges] = useState<any[]>([]);

  // useEffect hook to fetch and set flow data when the component mounts
  useEffect(() => {
    /**
     * fetchFlowData Function
     * This function fetches flow data (nodes and edges) and updates the component's state.
     * In this case, it uses dummy data for demonstration purposes.
     */
    const fetchFlowData = async () => {
      try {
        // Assigning the dummy data to the `data` constant
        const data = dummyData;

        // Setting the nodes and edges state with the fetched data
        setNodes(data.nodes);
        setEdges(data.edges);
      } catch (error) {
        // Logging any errors that occur during data fetching
        console.error("Error loading flow data:", error);
      }
    };

    // Calling the fetchFlowData function
    fetchFlowData();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div className="h-full w-full">
      {/* ReactFlow component to render the flow diagram */}
      <ReactFlow
        nodes={nodes} // Nodes to be displayed in the flow
        edges={edges} // Edges connecting the nodes
        nodeTypes={nodeTypes} // Custom node types for rendering
        nodesDraggable={false} // Disabling node dragging
        nodesConnectable={false} // Disabling node connections
        elementsSelectable={false} // Disabling element selection
        fitView // Automatically fitting the view to the flow
      >
        {/* Background component to render a grid in the flow */}
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default ViewMode; // Exporting the ViewMode component as the default export
