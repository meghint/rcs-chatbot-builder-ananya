import React, { useState } from 'react';
import {  ReactFlowProvider } from '@xyflow/react';
import FlowBuilder from './components/FlowBuilder';
import { Button } from './components/ui/button';
import ViewMode from './components/ViewMode';

/**
 * The `App` component serves as the main entry point for the Chatbot Flow Builder application.
 * It provides a user interface for toggling between "Edit" and "View" modes, and renders the appropriate
 * content based on the selected mode.
 *
 * @component
 * @returns {JSX.Element} The rendered App component.
 *
 * @remarks
 * - The component uses the `useState` hook to manage the `isEditMode` state, which determines
 *   whether the application is in "Edit" mode or "View" mode.
 * - The `ReactFlowProvider` is used to wrap the main content, ensuring that the React Flow context
 *   is available to child components.
 *
 * @example
 * ```tsx
 * <App />
 * ```
 *
 * @dependencies
 * - `useState` from React for state management.
 * - `ReactFlowProvider` from React Flow for context management.
 * - `FlowBuilder` and `ViewMode` components for rendering the respective modes.
 * - `Switch` component for toggling between modes.
 */
const App: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(true);

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <header className="p-4 border-b flex justify-between items-center shrink-0">
        <h3 className="text-xl font-bold">Chatbot Flow Builder</h3>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsEditMode(false)}
            className={`px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-200 text-sm ${!isEditMode ? 'bg-black hover:bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            View
          </Button>
          <Button
            onClick={() => setIsEditMode(true)}
            className={`px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-200 text-sm ${isEditMode ? 'bg-black hover:bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Edit
          </Button>
        </div>
      </header>
      
      <main className="flex-1 relative w-full" >
        <ReactFlowProvider>   
          {isEditMode ? (
            <FlowBuilder />
          ) : (
            <ViewMode />
          )}
        </ReactFlowProvider>
      </main>
    </div>
  );
};

export default App;