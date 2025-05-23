import React, { useState } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { RichCardData, ButtonData } from "../../types/CardTypes";
// import { saveFlowState } from '../../lib/localStorage';

// Import shadcn components
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppWindowMac, Megaphone, Plus, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";

const RichCard: React.FC<NodeProps> = ({ data, id, isConnectable }) => {
  const cardData = data as RichCardData;
  const [actions, setActions] = useState<ButtonData[]>(cardData.buttons || []);
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [actionTitle, setActionTitle] = useState<string>("");
  const [card, setCard] = useState<RichCardData>(cardData);
  const [imageUrl, setImageUrl] = useState<string>(cardData.imageUrl || "");

  const addAction = (type: string = "button") => {
    const newAction: ButtonData = {
      id: `action-${Date.now()}`,
      label: `Action ${actions.length + 1}`,
      action: "DEFAULT_ACTION",
      type: type,
      title: type === "action" ? "Action Title" : "",
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
  const startEditingTitle = (actionId: string, currentTitle: string = "") => {
    setEditingActionId(actionId);
    setActionTitle(currentTitle);
  };

  // Save edited title
  const saveTitle = (actionId: string) => {
    if (!editingActionId) return;

    const updatedActions = actions.map((action) => {
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
  const autoSave = () => {
    try {
      const flowStateStr = localStorage.getItem("chatbot-flow-state");
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
                imageUrl: cardData.imageUrl,
              },
            };
          }
          return node;
        });

        // Save updated flow state
        const updatedFlowState = {
          ...flowState,
          nodes: updatedNodes,
        };

        localStorage.setItem(
          "chatbot-flow-state",
          JSON.stringify(updatedFlowState)
        );
      }
    } catch (error) {
      console.error("Error autosaving:", error);
    }
  };

  const onChangeContent = (value: string, type: string) => {
    if (type === "title") {
      setCard({
        ...card,
        title: value,
      });
      cardData.title = value;
    } else if (type === "description") {
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
    <div className="w-84">
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

      <Card className="w-full shadow-md border-gray-200 p-0">
        <CardHeader className="p-4 bg-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
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
          <div className="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden mb-4">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  Click to upload image
                </span>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          <div>
            <h4 className="text-md font-medium mb-2">Title</h4>
            <input
              type="text"
              value={card.title}
              onChange={(e) => onChangeContent(e.target.value, "title")}
              className="mb-2 w-full"
            />

            <h4 className="text-md font-medium mb-2">Description</h4>
            <Textarea
              value={card.description}
              className="w-full min-h-24 flex-1 px-2 py-1 text-xs border border-gray-300 rounded-md focus:border-gray-400"
              onChange={(e) => onChangeContent(e.target.value, "description")}
            />
          </div>
        </CardContent>
        <hr/>
        <CardFooter className="flex flex-col bg-transparent">
          {actions.length > 0 && (
            <div className="w-full px-0">
              {actions.map((action) => (
                <div key={action.id} className="relative p-4 border-b">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Megaphone className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium text-sm">Action</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 p-0 text-muted-foreground">
                      <span className="text-lg">⋯</span>
                    </Button>
                  </div>
                  <div>
                    {/* Action label */}
                    <Select
                      value={action.label}
                      onValueChange={(value: string) => {
                        const updatedActions = actions.map((a) =>
                          a.id === action.id ? { ...a, label: value } : a
                        );
                        setActions(updatedActions);
                        cardData.buttons = updatedActions;
                        autoSave();
                      }}
                    >
                      <SelectTrigger className="w-full px-2 py-1 border !border-gray-300 rounded-md mb-2 flex justify-between items-center">
                        <span className="text-sm font-normal">{action.label || "Select action"}</span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chip" className="text-xs py-2">Chip</SelectItem>
                        <SelectItem value="Browse" className="text-xs py-2">Browse</SelectItem>
                        <SelectItem value="Chip2" className="text-xs py-2">Chip2</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* Editable title */}
                    <p className="text-sm font-medium mb-1">Title</p>
                    {editingActionId === action.id ? (
                      <div className="flex w-full mb-2">
                        <Input
                          type="text"
                          value={actionTitle}
                          onChange={(e) => setActionTitle(e.target.value)}
                          onBlur={() => saveTitle(action.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveTitle(action.id);
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        className="mb-2 px-2 py-1 font-normal text-xs border border-gray-300 rounded-md cursor-pointer hover:text-blue-500"
                        onClick={() => startEditingTitle(action.id, action.title || "")}
                      >
                        {action.title || "Add Title (Click to Edit)"}
                      </div>
                    )}
                  </div>
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
          )}

          <Button
                      variant="ghost"
                      onClick={() => addAction("action")}
                      className="w-full justify-center rounded-b-lg border-t bg-muted text-muted-foreground text-sm font-normal gap-2 h-12"
                    >
                      <Plus className="h-5 w-5" />
                      Add action
                    </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RichCard;
