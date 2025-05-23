import React, { useCallback, useState } from "react";
import { Panel, ReactFlowProvider } from "@xyflow/react";
import FlowBuilder from "./components/FlowBuilder";
import { Button } from "./components/ui/button";
import ViewMode from "./components/ViewMode";
import { clearFlowState } from "./lib/localStorage";

const App: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(true);

  // Reset the flow (clear localStorage and reload)
  const handleReset = useCallback(() => {
    clearFlowState();
    window.location.reload();
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <main className="flex-1 relative w-full">
        <ReactFlowProvider>
          <Panel
            position="top-left"
            className="p-2 border-b flex items-center gap-4 bg-white !m-0"
          >
            <h3 className="text-xl font-bold">Chatbot Flow Builder</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsEditMode(false)}
                  className={`px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-200 text-sm ${
                    !isEditMode
                      ? "bg-black hover:bg-black text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  View
                </Button>
                <Button
                  onClick={() => setIsEditMode(true)}
                  className={`px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-200 text-sm ${
                    isEditMode
                      ? "bg-black hover:bg-black text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Edit
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => handleReset()}
                className={`px-4 py-2 rounded-md bg-gray-300 `}
              >
                Reset
              </Button>
            </div>
          </Panel>
          {isEditMode ? <FlowBuilder /> : <ViewMode />}
        </ReactFlowProvider>
      </main>
    </div>
  );
};

export default App;
