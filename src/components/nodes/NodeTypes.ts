// Importing the NodeTypes enum to define the types of nodes used in the flow
import { NodeTypes } from '../../types/FlowTypes';

// Importing custom node components
import RichCard from './RichCard'; // Component for rendering a rich card node
import CarouselCard from './CarouselCard'; // Component for rendering a carousel card node

/**
 * nodeTypes Object
 * This object maps node types (defined in the NodeTypes enum) to their corresponding React components.
 * It is used by the React Flow library to render custom nodes in the flow diagram.
 */
export const nodeTypes = {
  [NodeTypes.RICH_CARD]: RichCard, // Mapping the RICH_CARD node type to the RichCard component
  [NodeTypes.CAROUSEL_CARD]: CarouselCard, // Mapping the CAROUSEL_CARD node type to the CarouselCard component
};