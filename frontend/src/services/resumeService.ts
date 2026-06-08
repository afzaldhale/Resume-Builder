import api from '@/api/axios';
import { ResumeData } from '@/components/resume-templates/types';

export interface Resume {
  id: string;
  title: string;
  templateId: number;
  resumeData: ResumeData;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  status?: string;
}

class ResumeService {
  async createResume(
    userId: string,
    resumeData: ResumeData,
    templateId: number,
    title: string = 'My Resume'
  ): Promise<{ id: string }> {
    try {
      const response = await api.post('/api/resumes', {
        resumeData,
        templateId,
        title,
      });

      return { id: response.data.resumeId };
    } catch (error) {
      console.error('Create resume error:', error);
      throw error;
    }
  }

  async getMyResumes(userId: string, limitCount: number = 50): Promise<Resume[]> {
    try {
      const response = await api.get('/api/resumes/mine');
      const resumes = response.data.resumes || [];

      return resumes.slice(0, limitCount).map((resume: Record<string, unknown>) => ({
        id: String(resume.id),
        title: (resume.title as string) || '',
        templateId: ((resume.template_id as number) ?? (resume.templateId as number)) || 1,
        resumeData:
          (resume.resume_data as ResumeData) || (resume.resumeData as ResumeData) || {},
        status: (resume.status as string) || 'draft',
        isPublished: (resume.status as string) === 'approved',
        createdAt: (resume.created_at as string) ? new Date(resume.created_at as string) : new Date(),
        updatedAt: (resume.updated_at as string)
          ? new Date(resume.updated_at as string)
          : new Date((resume.created_at as string) || Date.now()),
      }));
    } catch (error) {
      console.error('Get my resumes error:', error);
      throw error;
    }
  }

  async getResumeById(userId: string, resumeId: string): Promise<Resume | null> {
    try {
      const response = await api.get(`/api/resumes/${resumeId}`);
      const resume = response.data.resume;

      if (!resume) {
        return null;
      }

      return {
        id: String(resume.id),
        title: resume.title,
        templateId: resume.template_id ?? resume.templateId,
        resumeData: resume.resume_data || resume.resumeData || {},
        isPublished: resume.status === 'approved',
        status: resume.status,
        createdAt: resume.created_at ? new Date(resume.created_at) : new Date(),
        updatedAt: resume.updated_at
          ? new Date(resume.updated_at)
          : new Date(resume.created_at || Date.now()),
      };
    } catch (error) {
      console.error('Get resume by ID error:', error);
      throw error;
    }
  }

  async updateResume(
    userId: string,
    resumeId: string,
    updates: Partial<Resume>
  ): Promise<void> {
    try {
      await api.put(`/api/resumes/${resumeId}`, {
        title: updates.title,
        templateId: updates.templateId,
        resumeData: updates.resumeData,
      });
    } catch (error) {
      console.error('Update resume error:', error);
      throw error;
    }
  }

  async deleteResume(userId: string, resumeId: string): Promise<void> {
    try {
      await api.delete(`/api/resumes/${resumeId}`);
    } catch (error) {
      console.error('Delete resume error:', error);
      throw error;
    }
  }

  async autoSaveResume(userId: string, resumeId: string, resumeData: ResumeData): Promise<void> {
    try {
      await api.put(`/api/resumes/${resumeId}`, {
        resumeData,
      });
    } catch (error) {
      console.error('Auto-save error:', error);
      // Don't throw - auto-save should fail silently
    }
  }

  async duplicateResume(userId: string, resumeId: string): Promise<{ id: string }> {
    try {
      const response = await api.post(`/api/resumes/${resumeId}/duplicate`);
      return { id: response.data.resumeId };
    } catch (error) {
      console.error('Duplicate resume error:', error);
      throw error;
    }
  }

  async requestDownload(userId: string, resumeId: string): Promise<void> {
    try {
      await api.post(`/api/resumes/${resumeId}/request`);
    } catch (error) {
      console.error('Request download error:', error);
      throw error;
    }
  }

  async deleteMultipleResumes(userId: string, resumeIds: string[]): Promise<void> {
    try {
      await Promise.all(
        resumeIds.map((resumeId) => api.delete(`/api/resumes/${resumeId}`))
      );
    } catch (error) {
      console.error('Batch delete error:', error);
      throw error;
    }
  }

  async searchResumes(userId: string, searchTerm: string): Promise<Resume[]> {
    try {
      const allResumes = await this.getMyResumes(userId, 100);
      return allResumes.filter((resume) =>
        resume.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Search resumes error:', error);
      throw error;
    }
  }
}

export const resumeService = new ResumeService();
