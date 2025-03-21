// src/hooks/useAutoSave.ts
import { useEffect, useRef } from 'react';
import { saveFlowState } from '../lib/localStorage';
import { FlowState } from '@/types/FlowTypes';

interface UseAutoSaveOptions {
  /** Debounce time in milliseconds */
  debounceTime?: number;
  /** Enable/disable autosave */
  enabled?: boolean;
}

/**
 * Hook for automatically saving flow state to localStorage
 */
export const useAutoSave = (
  flowState: FlowState,
  options: UseAutoSaveOptions = {}
): void => {
  const { debounceTime = 1000, enabled = true } = options;
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Clear previous timeout if it exists
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced save
    timeoutRef.current = window.setTimeout(() => {
      saveFlowState(flowState);
    }, debounceTime);

    // Clean up timeout on unmount
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [flowState, debounceTime, enabled]);
};