import { create } from 'zustand';

interface UIStore {
  // Global UI state
  sidebarOpen: boolean;
  isPreviewMode: boolean;
  isEditMode: boolean;
  showTemplateSelector: boolean;
  showExportDialog: boolean;
  showConfirmDialog: boolean;
  confirmDialogData: {
    title: string;
    message: string;
    onConfirm: () => void;
  } | null;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  togglePreviewMode: () => void;
  setPreviewMode: (preview: boolean) => void;
  toggleEditMode: () => void;
  setEditMode: (edit: boolean) => void;
  toggleTemplateSelector: () => void;
  setTemplateSelector: (show: boolean) => void;
  toggleExportDialog: () => void;
  setExportDialog: (show: boolean) => void;
  showConfirmation: (data: UIStore['confirmDialogData']) => void;
  hideConfirmation: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  isPreviewMode: false,
  isEditMode: true,
  showTemplateSelector: false,
  showExportDialog: false,
  showConfirmDialog: false,
  confirmDialogData: null,

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  togglePreviewMode: () =>
    set((state) => ({ isPreviewMode: !state.isPreviewMode })),

  setPreviewMode: (preview) => set({ isPreviewMode: preview }),

  toggleEditMode: () =>
    set((state) => ({ isEditMode: !state.isEditMode })),

  setEditMode: (edit) => set({ isEditMode: edit }),

  toggleTemplateSelector: () =>
    set((state) => ({ showTemplateSelector: !state.showTemplateSelector })),

  setTemplateSelector: (show) => set({ showTemplateSelector: show }),

  toggleExportDialog: () =>
    set((state) => ({ showExportDialog: !state.showExportDialog })),

  setExportDialog: (show) => set({ showExportDialog: show }),

  showConfirmation: (data) =>
    set({ showConfirmDialog: true, confirmDialogData: data }),

  hideConfirmation: () =>
    set({ showConfirmDialog: false, confirmDialogData: null }),
}));
