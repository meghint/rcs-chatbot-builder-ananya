# RCS-Chatbot-Builder


## Project Overview

RCS-Chatbot-Builder is a powerful visual editor for creating and managing chatbot conversation flows. Built with React, TypeScript, and @xyflow/react, this tool enables designers and developers to visually construct complex chatbot interactions through a connected flow. The application features customizable card components that can be connected to define conversation paths, with real-time editing and automatic saving to ensure your work is always preserved.

## Key Features

- **Visual Flow Editor**: React Flow for creating and connecting cards
- **Multiple Card Types**:
  - **Rich Cards**: Single message cards with text, image, and action capabilities
  - **Carousel Cards**: Container cards that hold multiple swipeable cards
- **Interactive Connections**: Visually connect cards to define conversation paths
- **Action Management**: Add and configure actions that branch to different paths
- **Real-time Editing**: All changes are immediately reflected in the editor
- **Auto-save**: Automatic saving to localStorage to prevent data loss
- **Responsive Design**: Works across various device sizes and screen resolutions

## Technical Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Flow Visualization**: @xyflow/react (formerly ReactFlow)
- **UI Components**: Custom implementation based on shadcn/ui
- **Styling**: Tailwind CSS for responsive and customizable design
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Storage**: localStorage for persistent data
- **Build Tool**: Create React App / Vite

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher) or Yarn (v1.22.0 or higher)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/reactflow-card-builder.git
cd reactflow-card-builder
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Open your browser and navigate to `http://localhost:5173`

## Implementation Details

### Components

#### Carousel Card Node

The Carousel Card is a container component that displays multiple cards in a swipeable interface:

- **Features**:
  - Navigation controls to browse through cards
  - "+ Card" button to add new cards directly to the carousel
  - Editable title and description fields
  - Support for action nodes with connection points
  - Real-time content updates with autosave

- **Implementation**:
  - Uses the shadcn Carousel component for card navigation
  - Maintains state for all cards within the carousel
  - Implements custom navigation and card management logic
  - Automatically persists changes to localStorage

#### Rich Card Node

The Rich Card represents a single message in the conversation flow:

- **Features**:
  - Editable title and description
  - Image upload placeholder
  - Configurable action buttons
  - Connection points for defining flow paths
  - Real-time content updates with autosave

- **Implementation**:
  - Custom card component with shadcn UI styling
  - Input fields for direct content editing
  - Source and target handles for creating connections
  - State management for local and persistent storage

### Data Management

The application implements a robust data management approach:

- **Card Data Structure**: TypeScript interfaces define the structure of different card types
- **Flow State**: Maintains the state of all nodes and edges in the flow
- **Auto-save**: Changes are automatically saved to localStorage using a debounce mechanism
- **Data Persistence**: Flow state is loaded from localStorage on application startup

### Flow Management

Flow management is handled through @xyflow/react:

- **Node Creation**: Add new nodes through the UI with predefined templates
- **Connection Management**: Create and delete connections between nodes
- **Node Positioning**: Drag and drop nodes to position them in the flow
- **State Handling**: All flow state (nodes, edges, positions) is managed and persisted

## Development Guidelines

When extending or modifying this project:

1. **Component Structure**: Follow the established component structure and patterns
2. **TypeScript**: Maintain strong typing for all components and data structures
3. **State Management**: Use React hooks for state management, avoid global state when possible
4. **UI Consistency**: Adhere to the existing UI patterns and Tailwind classes
5. **Performance**: Be mindful of performance, especially for larger flows

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [@xyflow/react](https://reactflow.dev/) for the flow visualization library
- [shadcn/ui](https://ui.shadcn.com/) for the UI component patterns
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
