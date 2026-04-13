import { create } from 'zustand';
import { Timestamp } from 'firebase/firestore';

export interface Resume {
  id: string;
  title: string;
  templateId: number;
  resumeData: any;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  isPublished: boolean;
}

interface ResumeStore {
  // State
  resumes: Resume[];
  currentResume: Resume | null;
  loading: boolean;
  error: string | null;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  selectedTemplateId: number;

  // Actions
  setResumes: (resumes: Resume[]) => void;
  setCurrentResume: (resume: Resume | null) => void;
  addResume: (resume: Resume) => void;
  updateResume: (resumeId: string, updates: Partial<Resume>) => void;
  deleteResume: (resumeId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSaveStatus: (status: 'idle' | 'saving' | 'saved' | 'error') => void;
  setSelectedTemplate: (templateId: number) => void;
  clearError: () => void;
}

export const useResumeStore = create<ResumeStore>((set) => ({
  resumes: [],
  currentResume: null,
  loading: false,
  error: null,
  saveStatus: 'idle',
  selectedTemplateId: 1,

  setResumes: (resumes) => set({ resumes }),

  setCurrentResume: (resume) => set({ currentResume: resume }),

  addResume: (resume) =>
    set((state) => ({
      resumes: [resume, ...state.resumes],
    })),

  updateResume: (resumeId, updates) =>
    set((state) => ({
      resumes: state.resumes.map((r) =>
        r.id === resumeId ? { ...r, ...updates } : r
      ),
      currentResume:
        state.currentResume?.id === resumeId
          ? { ...state.currentResume, ...updates }
          : state.currentResume,
    })),

  deleteResume: (resumeId) =>
    set((state) => ({
      resumes: state.resumes.filter((r) => r.id !== resumeId),
      currentResume:
        state.currentResume?.id === resumeId ? null : state.currentResume,
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setSaveStatus: (status) => set({ saveStatus: status }),

  setSelectedTemplate: (templateId) => set({ selectedTemplateId: templateId }),

  clearError: () => set({ error: null }),
}));
