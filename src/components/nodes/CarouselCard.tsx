import React, { useState } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import {
  CarouselCardData,
  RichCardData,
  ButtonData,
} from "../../types/CardTypes";

// Import shadcn components
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { AppWindowMac, Plus, Upload, Megaphone } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { CustomNode } from "../../types/FlowTypes";
import { Select } from "@/components/ui/select";
import { SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

/**
 * CarouselCard is a React functional component that represents a carousel of cards.
 * Each card contains editable content such as a title, description, and actions (buttons).
 * The component supports adding new cards, editing card content, and managing actions within each card.
 * It also integrates with localStorage to persist changes to the flow state of a chatbot.

 * @component
 * @param {NodeProps} props - The properties passed to the component.
 * @param {CarouselCardData} props.data - The data object containing the initial state of the carousel and its cards.
 * @param {string} props.id - The unique identifier for the node.
 * @param {boolean} props.isConnectable - Determines whether the node is connectable in the flow editor.

 * @returns {JSX.Element} A carousel of cards with editable content and actions.

 * @function addCard
 * Adds a new card to the carousel. The new card is initialized with default values
 * and is added to the local state, the cardData object, and the localStorage flow state.

 * @function autoSave
 * Automatically saves the updated cards to the localStorage flow state. This function
 * ensures that changes to the cards are persisted.

 * @function onchangeContent
 * Updates the content of a specific card or action within a card. This function handles
 * changes to the title, description, and action titles, and triggers an autosave.

 * @function addAction
 * Adds a new action (button) to a specific card. The new action is initialized with default
 * values and is added to the local state, the cardData object, and the localStorage flow state.

 * @example
 * <CarouselCard
 *   data={carouselCardData}
 *   id="carousel-node-1"
 *   isConnectable={true}
 * />
 */
const CarouselCard: React.FC<NodeProps> = ({ data, id, isConnectable }) => {
  const cardData = data as CarouselCardData;
  const [cards, setCards] = useState<RichCardData[]>(cardData.cards || []);

  // Add new card to carousel
  const addCard = async () => {
    try {
      // Generate a new unique ID for the card
      const newCardId = `rich-card-${Date.now()}`;

      // Create a new card
      const newCard: RichCardData = {
        id: newCardId,
        title: "New Card",
        description: "Add description here...",
        imageUrl: "",
        buttons: [],
        speaker: 'bot',
      };

      // Update the cardData.cards array
      const updatedCardIds = [...cardData.cards, newCard];
      cardData.cards = updatedCardIds;

      // Update cards state
      setCards([...cards, newCard]);

      // Update localStorage
      const flowStateStr = localStorage.getItem("chatbot-flow-state");
      if (flowStateStr) {
        const flowState = JSON.parse(flowStateStr);

        // Update carousel node's cards
        const updatedNodes = flowState.nodes.map((node: CustomNode) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                cards: updatedCardIds,
              },
            };
          }
          return node;
        });

        flowState.nodes = updatedNodes;

        // Save the updated flow state
        localStorage.setItem("chatbot-flow-state", JSON.stringify(flowState));
      }
    } catch (error) {
      console.error("Error adding new card:", error);
    }
  };

  // Autosave function
  const autoSave = (updatedCards: RichCardData[] = cards) => {
    try {
      const flowStateStr = localStorage.getItem("chatbot-flow-state");
      if (flowStateStr) {
        const flowState = JSON.parse(flowStateStr);

        // Update the specific node
        const updatedNodes = flowState.nodes.map((node: CustomNode) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                cards: updatedCards,
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

  const onchangeContent = (
    event: any,
    card: RichCardData,
    type: string,
    actionID?: string
  ) => {
    if (type === "imageUrl") {
      handleImageUpload(event, card);
      return;
    }

    const updatedCards = cards.map((c) => {
      if (c.id === card.id && type === "title") {
        return { ...c, title: event.target.value };
      } else if (c.id === card.id && type === "description") {
        return { ...c, description: event.target.value };
      } else if (c.id === card.id && type === "actionTitle" && actionID) {
        return {
          ...c,
          buttons: c.buttons.map((button) =>
            button.id === actionID
              ? { ...button, title: event.target.value }
              : button
          ),
        };
      }
      return c;
    });

    cardData.cards = updatedCards;
    setCards(updatedCards);
    autoSave(updatedCards);
  };

  // Separate function to handle image upload
  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    card: RichCardData
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;

        // Create updated cards array with the new image URL
        const updatedCards = cards.map((c) => {
          if (c.id === card.id) {
            return { ...c, imageUrl: imageDataUrl };
          }
          return c;
        });

        // Update both state and cardData
        setCards(updatedCards);
        cardData.cards = updatedCards;

        // Save to localStorage
        autoSave(updatedCards);
      };

      reader.readAsDataURL(file);
    }
  };

  const addAction = (card: RichCardData) => {
    const newAction: ButtonData = {
      id: `action-${Date.now()}`,
      label: `Choose a type of CTA.... `,
      action: "DEFAULT_ACTION",
      type: "action",
      title: "Action Title",
    };

    // Update the specific card's buttons
    const updatedCards = cards.map((c) => {
      if (c.id === card.id) {
        return {
          ...c,
          buttons: [...(c.buttons || []), newAction],
        };
      }
      return c;
    });

    setCards(updatedCards as RichCardData[]);
    cardData.cards = updatedCards as RichCardData[];
    autoSave(updatedCards as RichCardData[]);
  };

  return (
    <div className="w-84">
      {/* Input handle at the top */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-4 h-4 bg-blue-500"
      />

      <Carousel className="w-full overflow-visible">
        <CarouselContent className="overflow-visible !transform-none">
          {cards.length > 0 &&
            cards.map((card, index) => (
              <CarouselItem key={card.id} className="!w-full">
                <Card className="border rounded-lg shadow-sm relative !w-full p-0">
                  {/* Target handle for each card */}
                  <Handle
                    id={`card-${card.id}-target`}
                    type="target"
                    position={Position.Top}
                    className="w-4 h-4 bg-blue-500 absolute top-1/2 -left-2 transform -translate-y-1/2"
                    isConnectable={isConnectable}
                  />

                  {/* Source handle for the last card */}
                  {index === cards.length - 1 && (
                    <Handle
                      id={`card-${card.id}-source`}
                      type="source"
                      position={Position.Right}
                      className="w-4 h-4 bg-blue-500 absolute top-1/2 -right-2 transform -translate-y-1/2"
                      isConnectable={isConnectable}
                    />
                  )}
                  <CardHeader className="relative">
                    <Button
                      size="sm"
                      className="!bg-white !text-black border-1 !border-black !p-2 absolute top-6 right-[-30px] -rotate-90"
                      onClick={addCard}
                    >
                      <Plus className="h-4 w-4" /> <span>card</span>
                    </Button>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <AppWindowMac />
                        <h3 className="text-lg ml-2 font-semibold">Bot says</h3>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-gray-500 p-0">
                          <span>⋯</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center bg-white p-1 px-2 rounded text-sm">
                      <span className="mr-1">{index + 1}</span>/
                      <span>{cards.length}</span>
                    </div>
                    <div className="relative h-40 bg-gray-100 flex items-center justify-center">
                      {card.imageUrl ? (
                        <img
                          src={card.imageUrl}
                          alt="Uploaded"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full relative h-40 bg-gray-100 flex items-center justify-center">
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">
                            Click to upload image
                          </span>
                          <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              onchangeContent(e, card, "imageUrl")
                            }
                          />
                        </label>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-1">Title</p>
                      <Input
                        placeholder="Title your card here..."
                        className="w-full"
                        value={card.title}
                        onChange={(e) => onchangeContent(e, card, "title")}
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Description</p>
                      <Textarea
                        placeholder="Describe your card here..."
                        className="w-full min-h-24 flex-1 px-2 py-1 text-xs border border-gray-300 rounded-md focus:border-gray-400"
                        value={card.description}
                        onChange={(e) =>
                          onchangeContent(e, card, "description")
                        }
                      />
                    </div>
                  </CardContent>
                  <hr/>
                  <CardFooter className="flex flex-col bg-transparent">
                    {card.buttons && card.buttons.length > 0 && (
                      <div className="w-full px-0">
                        {card.buttons.map((action) => (
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
                                  const updatedCards = cards.map((c) =>
                                    c.id === card.id
                                      ? {
                                          ...c,
                                          buttons: c.buttons.map((b) =>
                                            b.id === action.id ? { ...b, label: value } : b
                                          ),
                                        }
                                      : c
                                  );
                                  setCards(updatedCards);
                                  cardData.cards = updatedCards;
                                  autoSave(updatedCards);
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
                              <div className="flex w-full mb-2">
                                <Input
                                  type="text"
                                  value={action.title || ""}
                                  onChange={(e) =>
                                    onchangeContent(
                                      e,
                                      card,
                                      "actionTitle",
                                      action.id
                                    )
                                  }
                                />
                              </div>
                            </div>

                            {/* Handles for each action */}
                            <Handle
                              id={`action-${action.id}-target`}
                              type="target"
                              position={Position.Left}
                              className="w-4 h-4 bg-green-500 absolute top-1/2 -left-2 transform -translate-y-1/2"
                              isConnectable={isConnectable}
                            />
                            <Handle
                              id={`action-${action.id}`}
                              type="source"
                              position={Position.Right}
                              className="w-4 h-4 bg-green-500 absolute top-1/2 -right-2 transform -translate-y-1/2"
                              isConnectable={isConnectable}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => addAction(card)}
                      className="w-full justify-center rounded-b-lg border-t bg-muted text-muted-foreground text-sm font-normal gap-2 h-12"
                    >
                      <Plus className="h-5 w-5" />
                      Add action
                    </Button>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default CarouselCard;
