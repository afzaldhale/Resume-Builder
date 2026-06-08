import { useEffect, useRef } from 'react';
import { debounce } from '@/services/firestoreUtils';
import { ResumeData } from '@/components/resume-templates/types';
import { useResume } from './useResume';

/**
 * Hook for debounced auto-save functionality
 * - Prevents excessive Firestore writes
 * - Updates after specified delay
 * - Useful for real-time form editing
 */
export const useAutoSave = (
  resumeId: string | null | undefined,
  resumeData: ResumeData | null | undefined,
  delay: number = 2000
) => {
  const { autoSave } = useResume();
  const debouncedAutoSaveRef = useRef<((id: string, data: ResumeData) => void) | null>(null);

  useEffect(() => {
    if (!resumeId || !resumeData) return;

    // Create debounced auto-save on first mount
    if (!debouncedAutoSaveRef.current) {
      debouncedAutoSaveRef.current = debounce(
        async (id: string, data: ResumeData) => {
          await autoSave(id, data);
        },
        delay
      );
    }

    // Call debounced function
    debouncedAutoSaveRef.current(resumeId, resumeData);

    // Cleanup on unmount
    return () => {
      if (debouncedAutoSaveRef.current) {
        debouncedAutoSaveRef.current = null;
      }
    };
  }, [resumeId, resumeData, autoSave, delay]);
};

/**
 * Hook for listening to resume changes in real-time
 * Useful for collaborative editing or syncing across tabs
 */
export const useResumeListener = (resumeId: string | null | undefined, userId: string | null | undefined) => {
  // Placeholder: real-time listener not implemented yet.
  useEffect(() => {
    if (!resumeId || !userId) return;

    // TODO: Implement onSnapshot listener
    // This would require importing getDoc and onSnapshot from Firestore
    // and setting up a real-time listener
  }, [resumeId, userId]);
};
