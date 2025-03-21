import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { RichCardData, ButtonData } from '../../types/CardTypes';
// import { saveFlowState } from '../../lib/localStorage';

// Import shadcn components
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppWindowMac, Upload } from 'lucide-react';

const RichCard: React.FC<NodeProps> = ({ data, id, isConnectable }) => {
  const cardData = data as RichCardData;
  const [actions, setActions] = useState<ButtonData[]>(cardData.buttons || []);
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [actionTitle, setActionTitle] = useState<string>('');
  const [card, setCard] = useState<RichCardData>(cardData);
  const [imageUrl, setImageUrl] = useState<string>(cardData.imageUrl || '');

  const addAction = (type: string = 'button') => {
    const newAction: ButtonData = {
      id: `action-${Date.now()}`,
      label: `Action ${actions.length + 1}`,
      action: 'DEFAULT_ACTION',
      type: type,
      title: type === 'action' ? 'Action Title' : '',
    };
    const updatedActions = [...actions, newAction];
    setActions(updatedActions);
    if (cardData.buttons) {
      cardData.buttons = updatedActions;
    } else {
      cardData.buttons = updatedActions;
    }
    autoSave();
  };
  // Start editing action title
  const startEditingTitle = (actionId: string, currentTitle: string = '') => {
    setEditingActionId(actionId);
    setActionTitle(currentTitle);
  };

  // Save edited title
  const saveTitle = (actionId: string) => {
    if (!editingActionId) return;
    
    const updatedActions = actions.map(action => {
      if (action.id === actionId) {
        return { ...action, title: actionTitle };
      }
      return action;
    });
    setActions(updatedActions);
    if (cardData.buttons) {
      cardData.buttons = updatedActions;
    }
    setEditingActionId(null);
    autoSave();
  };

  // Autosave function
  /**
   * Automatically saves the current state of the chatbot flow to localStorage.
   * 
   * This function retrieves the existing flow state from localStorage, updates the specific node
   * with the provided actions, and then saves the updated flow state back to localStorage.
   * 
   * @remarks
   * - This implementation assumes that the flow state is stored in localStorage under the key 
   *   'chatbot-flow-state'.
   * - The function handles errors gracefully by catching and logging any issues during the 
   *   retrieval, parsing, or saving process.
   * 
   * @example
   * // Example usage:
   * autoSave();
   * 
   * @throws Will log an error to the console if there is an issue with localStorage operations
   *         or JSON parsing/stringifying.
   */
  const autoSave = () => {
    try {
      const flowStateStr = localStorage.getItem('chatbot-flow-state');
      if (flowStateStr) {
        const flowState = JSON.parse(flowStateStr);        
        // Update the specific node
        const updatedNodes = flowState.nodes.map((node: any) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                buttons: actions,
                title: card.title,
                description: card.description,
                imageUrl: cardData.imageUrl
              }
            };
          }
          return node;
        });
        
        // Save updated flow state
        const updatedFlowState = {
          ...flowState,
          nodes: updatedNodes,
        };
        
        localStorage.setItem('chatbot-flow-state', JSON.stringify(updatedFlowState));
      }
    } catch (error) {
      console.error('Error autosaving:', error);
    }
  };

  const onChangeContent = (value: string,  type: string) => {
    if (type === 'title') {
      setCard({
        ...card,
        title: value,
      });
      cardData.title = value;
    } else if (type === 'description') {
      setCard({
        ...card,
        description: value,
      });
      cardData.description = value;
    }
    autoSave();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImageUrl = reader.result as string;
        setImageUrl(newImageUrl);
        cardData.imageUrl = newImageUrl;
        autoSave();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-64">
      {/* Top source handle */}
      <Handle
        id={`node-${id}-top`}
        type="source"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-blue-500"
      />
      {/* Left target handle */}
      <Handle
        id={`node-${id}-left`}
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-blue-500"
      />

      {/* Right source handle */}
      <Handle
        id={`node-${id}-right`}
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-blue-500"
      />
        
      <Card className="w-full shadow-md border-gray-200">
        <CardHeader className="p-4 bg-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className='flex items-center'>
              <AppWindowMac />
              <h3 className="text-lg ml-2 font-semibold">Bot says</h3>
            </div>
            <div className="flex space-x-2">
              <button className="text-gray-500">
                <span>⋯</span>
              </button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="">
            <div className="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt="Uploaded" className="w-full h-full object-cover" />
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Click to upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    />
                </label>
              )}
            </div>
          
          <div className="p-4">
            <h4 className="text-md font-medium mb-2">Title</h4>
            <input
              type="text"
              value={card.title}
              className="text-sm text-gray-700 mb-4"
              onChange={(e) => onChangeContent(e.target.value, "title")} />
            
            <h4 className="text-md font-medium mb-2">Description</h4>
            <textarea
              value={card.description}
              className="text-sm text-gray-600 mb-4 max-h-20 overflow-y-auto"
              onChange={(e) => onChangeContent(e.target.value, "description")} />
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col">
          {actions.length > 0 && (
            <div className="w-full">
              <div className="flex flex-col">
                {actions.map((action) => (
                  <div key={action.id} className="relative border-y-1 border-gray-300  p-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded-md">
                        <span>🔘</span>
                      </span>
                      <span className="text-sm font-medium">Action</span>
                    </div>
                    {action.type === 'action' ? (
                      <div className="w-full p-2">
                        {/* Editable title */}
                        <div className="px-2 py-1 text-xs  border-1 border-gray-300 rounded-md mb-2">
                            {action.label}
                        </div>

                        <p className="text-sm font-medium">Title</p>
                        {editingActionId === action.id ? (
                          <div className="flex w-full mb-2">
                            <input
                              type="text"
                              value={actionTitle}
                              onChange={(e) => setActionTitle(e.target.value)}
                              className="flex-1 px-2 py-1 text-xs border-1 border-gray-300 rounded-md"
                              autoFocus
                              onBlur={() => saveTitle(action.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveTitle(action.id);
                              }}
                            />
                          </div>
                        ) : (
                          <div 
                            className="mb-2 px-2 py-1 font-medium text-xs border-1 border-gray-300 rounded-md cursor-pointer hover:text-blue-500"
                            onClick={() => startEditingTitle(action.id, action.title || '')}
                          >
                            {action.title || 'Add Title (Click to Edit)'}
                          </div>
                        )}
                        
                        {/* action display */}
                        {/* <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-md"> */}
                          
                        {/* </div> */}
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-sm"
                      >
                        {action.label}
                      </Button>
                    )}
                    
                    {/* Source handle for each action */}
                    <Handle
                      id={`action-${action.id}`}
                      type="source"
                      position={Position.Right}
                      className="w-2 h-2 bg-green-500 absolute top-1/2 -right-2 transform -translate-y-1/2"
                      isConnectable={isConnectable}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex mt-2">
            <Button 
              size="sm"
              onClick={() => addAction('action')}
            >
              + Add Action
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RichCard;