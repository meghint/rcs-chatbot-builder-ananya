import { FlowState } from "@/types/FlowTypes";

const FLOW_STATE_KEY = 'chatbot-flow-state';

/**
 * Save flow state to localStorage
 */
export const saveFlowState = (flowState: FlowState): void => {
  try {
    const serializedState = JSON.stringify(flowState);
    localStorage.setItem(FLOW_STATE_KEY, serializedState);
  } catch (error) {
    console.error('Error saving flow state to localStorage:', error);
  }
};

/**
 * Load flow state from localStorage
 */
export const loadFlowState = (): FlowState | null => {
  try {
    const serializedState = localStorage.getItem(FLOW_STATE_KEY);
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState) as FlowState;
  } catch (error) {
    console.error('Error loading flow state from localStorage:', error);
    return null;
  }
};

/**
 * Clear flow state from localStorage
 */
export const clearFlowState = (): void => {
  try {
    localStorage.removeItem(FLOW_STATE_KEY);
  } catch (error) {
    console.error('Error clearing flow state from localStorage:', error);
  }
};