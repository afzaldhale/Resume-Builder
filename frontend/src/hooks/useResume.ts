import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useResumeStore } from '@/store/resumeStore';
import { resumeService, Resume } from '@/services/resumeService';
import { toast } from 'sonner';

/**
 * Hook for resume management
 * - Handle resume CRUD operations
 * - Sync with Firestore
 * - Manage loading and error states
 */
export const useResume = () => {
  const { user } = useAuthStore();
  const {
    resumes,
    currentResume,
    loading,
    error,
    saveStatus,
    setResumes,
    setCurrentResume,
    addResume,
    updateResume: updateResumeInStore,
    deleteResume: deleteResumeInStore,
    setLoading,
    setError,
    setSaveStatus,
  } = useResumeStore();

  /**
   * Fetch all resumes for current user
   */
  const fetchResumes = useCallback(async () => {
    if (!user) {
      setResumes([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await resumeService.getMyResumes(user.uid);
      setResumes(data);
    } catch (err) {
      console.error('Fetch resumes error:', err);
      setError('Failed to load resumes');
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  }, [user, setLoading, setError, setResumes]);

  /**
   * Create new resume
   */
  const createResume = useCallback(
    async (resumeData: any, templateId: number, title: string = 'My Resume') => {
      if (!user) {
        toast.error('You must be logged in');
        return null;
      }

      try {
        setSaveStatus('saving');
        const { id } = await resumeService.createResume(user.uid, resumeData, templateId, title);
        const newResume = await resumeService.getResumeById(user.uid, id);

        if (newResume) {
          addResume(newResume);
          setCurrentResume(newResume);
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
          toast.success('Resume created successfully');
          return newResume;
        }
      } catch (err) {
        console.error('Create resume error:', err);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 2000);
        toast.error('Failed to create resume');
      }

      return null;
    },
    [user, addResume, setCurrentResume, setSaveStatus]
  );

  /**
   * Update existing resume
   */
  const updateResume = useCallback(
    async (resumeId: string, updates: Partial<Resume>) => {
      if (!user) {
        toast.error('You must be logged in');
        return false;
      }

      try {
        setSaveStatus('saving');
        await resumeService.updateResume(user.uid, resumeId, updates);
        const updated = await resumeService.getResumeById(user.uid, resumeId);

        if (updated) {
          updateResumeInStore(resumeId, updated);
          setCurrentResume(updated);
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
          return true;
        }
      } catch (err) {
        console.error('Update resume error:', err);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 2000);
        toast.error('Failed to update resume');
      }

      return false;
    },
    [user, updateResumeInStore, setCurrentResume, setSaveStatus]
  );

  /**
   * Auto-save resume (debounced)
   */
  const autoSave = useCallback(
    async (resumeId: string, resumeData: any) => {
      if (!user) return;

      try {
        setSaveStatus('saving');
        await resumeService.autoSaveResume(user.uid, resumeId, resumeData);
        setSaveStatus('saved');

        // Reset to idle after 1.5 seconds
        const timeout = setTimeout(() => setSaveStatus('idle'), 1500);
        return () => clearTimeout(timeout);
      } catch (err) {
        console.error('Auto-save error:', err);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 1000);
      }
    },
    [user, setSaveStatus]
  );

  /**
   * Delete resume
   */
  const deleteResume = useCallback(
    async (resumeId: string) => {
      if (!user) {
        toast.error('You must be logged in');
        return false;
      }

      try {
        await resumeService.deleteResume(user.uid, resumeId);
        deleteResumeInStore(resumeId);
        toast.success('Resume deleted');
        return true;
      } catch (err) {
        console.error('Delete resume error:', err);
        toast.error('Failed to delete resume');
      }

      return false;
    },
    [user, deleteResumeInStore]
  );

  /**
   * Duplicate resume
   */
  const duplicateResume = useCallback(
    async (resumeId: string) => {
      if (!user) {
        toast.error('You must be logged in');
        return null;
      }

      try {
        setSaveStatus('saving');
        const { id } = await resumeService.duplicateResume(user.uid, resumeId);
        const duplicated = await resumeService.getResumeById(user.uid, id);

        if (duplicated) {
          addResume(duplicated);
          setSaveStatus('saved');
          toast.success('Resume duplicated');
          return duplicated;
        }
      } catch (err) {
        console.error('Duplicate resume error:', err);
        setSaveStatus('error');
        toast.error('Failed to duplicate resume');
      }

      return null;
    },
    [user, addResume, setSaveStatus]
  );

  /**
   * Delete multiple resumes
   */
  const deleteMultiple = useCallback(
    async (resumeIds: string[]) => {
      if (!user) {
        toast.error('You must be logged in');
        return false;
      }

      try {
        await resumeService.deleteMultipleResumes(user.uid, resumeIds);
        resumeIds.forEach((id) => deleteResumeInStore(id));
        toast.success(`${resumeIds.length} resume${resumeIds.length > 1 ? 's' : ''} deleted`);
        return true;
      } catch (err) {
        console.error('Delete multiple error:', err);
        toast.error('Failed to delete resumes');
      }

      return false;
    },
    [user, deleteResumeInStore]
  );

  /**
   * Search resumes by title
   */
  const searchResumes = useCallback(
    async (searchTerm: string) => {
      if (!user) return [];

      try {
        return await resumeService.searchResumes(user.uid, searchTerm);
      } catch (err) {
        console.error('Search error:', err);
        toast.error('Failed to search resumes');
        return [];
      }
    },
    [user]
  );

  // Auto-fetch resumes when user logs in
  useEffect(() => {
    if (user) {
      fetchResumes();
    } else {
      setResumes([]);
    }
  }, [user, fetchResumes, setResumes]);

  return {
    resumes,
    currentResume,
    loading,
    error,
    saveStatus,
    fetchResumes,
    createResume,
    updateResume,
    autoSave,
    deleteResume,
    duplicateResume,
    deleteMultiple,
    searchResumes,
  };
};
