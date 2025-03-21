import { Node, Edge } from '@xyflow/react';
import { RichCardData, CarouselCardData } from './CardTypes';

export enum NodeTypes {
  RICH_CARD = 'richCard',
  CAROUSEL_CARD = 'carouselCard',
}

export interface CustomNode extends Node {
  type: NodeTypes;
  data: RichCardData | CarouselCardData;
}

export interface FlowState {
  nodes: CustomNode[];
  edges: Edge[];
}