// Utility functions for Firestore operations and data management

/**
 * Debounce function for auto-save
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * Format Firestore timestamp to readable date
 */
export const formatFirestoreDate = (timestamp: any): string => {
  if (!timestamp) return 'N/A';

  let date: Date;
  if (timestamp instanceof Date) {
    date = timestamp;
  } else if (timestamp.toDate instanceof Function) {
    // Firestore Timestamp
    date = timestamp.toDate();
  } else {
    date = new Date(timestamp);
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (timestamp: any): string => {
  if (!timestamp) return 'N/A';

  let date: Date;
  if (timestamp instanceof Date) {
    date = timestamp;
  } else if (timestamp.toDate instanceof Function) {
    date = timestamp.toDate();
  } else {
    date = new Date(timestamp);
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return formatFirestoreDate(timestamp);
};

/**
 * Validate resume data structure
 */
export const validateResumeData = (data: any, candidateType: 'fresher' | 'experienced'): string[] => {
  const errors: string[] = [];

  // Required fields for all
  if (!data.fullName?.trim()) errors.push('Full name is required');
  if (!data.email?.trim()) errors.push('Email is required');
  if (!data.phone?.trim()) errors.push('Phone number is required');
  if (!data.role?.trim()) errors.push('Job role/title is required');

  // Candidate type-specific validation
  if (candidateType === 'experienced') {
    if (!data.professionalSummary?.trim()) {
      errors.push('Professional summary is required for experienced candidates');
    }
  } else {
    if (!data.careerObjective?.trim()) {
      errors.push('Career objective is required for fresher candidates');
    }
  }

  // Skills validation
  if (!Array.isArray(data.skills) || data.skills.length === 0) {
    errors.push('At least one skill is required');
  }

  // Education validation
  if (!Array.isArray(data.education) || data.education.length === 0) {
    errors.push('At least one education entry is required');
  }

  return errors;
};

/**
 * Sanitize resume data for storage
 */
export const sanitizeResumeData = (data: any): any => {
  return {
    ...data,
    fullName: data.fullName?.trim() || '',
    email: data.email?.trim().toLowerCase() || '',
    phone: data.phone?.trim() || '',
    role: data.role?.trim() || '',
    address: data.address?.trim() || '',
    professionalSummary: data.professionalSummary?.trim() || '',
    careerObjective: data.careerObjective?.trim() || '',
    additionalInfo: data.additionalInfo?.trim() || '',
    skills: Array.isArray(data.skills) ? data.skills.filter((s: any) => s.name?.trim()) : [],
    education: Array.isArray(data.education)
      ? data.education.filter((e: any) => e.institution?.trim() && e.degree?.trim())
      : [],
    experience: Array.isArray(data.workExperience)
      ? data.workExperience.filter((e: any) => e.company?.trim() && e.position?.trim())
      : [],
    internships: Array.isArray(data.internships)
      ? data.internships.filter((i: any) => i.company?.trim() && i.position?.trim())
      : [],
    projects: Array.isArray(data.projects)
      ? data.projects.filter((p: any) => p.name?.trim())
      : [],
    certifications: Array.isArray(data.certifications)
      ? data.certifications.filter((c: any) => c.name?.trim())
      : [],
    languages: Array.isArray(data.languages)
      ? data.languages.filter((l: any) => l.language?.trim())
      : [],
    socialLinks: Array.isArray(data.socialLinks)
      ? data.socialLinks.filter((s: any) => s.platform?.trim() && s.url?.trim())
      : [],
  };
};

/**
 * Create empty resume template based on candidate type
 */
export const createEmptyResume = (candidateType: 'fresher' | 'experienced') => {
  const baseTemplate = {
    fullName: '',
    email: '',
    phone: '',
    role: '',
    address: '',
    skills: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [{ language: '', level: 'Intermediate' }],
    socialLinks: [{ platform: 'LinkedIn', url: '' }],
    additionalInfo: '',
  };

  if (candidateType === 'experienced') {
    return {
      ...baseTemplate,
      professionalSummary: '',
      workExperience: [],
    };
  }

  return {
    ...baseTemplate,
    careerObjective: '',
    strengths: [],
    hobbies: [],
    internships: [],
  };
};

/**
 * Calculate resume completeness percentage
 */
export const calculateResumeCompleteness = (data: any, candidateType: 'fresher' | 'experienced'): number => {
  let filledFields = 0;
  let totalFields = 10; // Base fields

  // Check base fields
  if (data.fullName?.trim()) filledFields++;
  if (data.email?.trim()) filledFields++;
  if (data.phone?.trim()) filledFields++;
  if (data.role?.trim()) filledFields++;
  if (data.address?.trim()) filledFields++;

  // Check candidate type-specific fields
  if (candidateType === 'experienced') {
    totalFields += 2;
    if (data.professionalSummary?.trim()) filledFields++;
    if (Array.isArray(data.workExperience) && data.workExperience.length > 0) filledFields++;
  } else {
    totalFields += 2;
    if (data.careerObjective?.trim()) filledFields++;
    if (Array.isArray(data.strengths) && data.strengths.length > 0) filledFields++;
  }

  // Check common sections
  if (Array.isArray(data.education) && data.education.length > 0) filledFields++;
  if (Array.isArray(data.skills) && data.skills.length > 0) filledFields++;
  if (Array.isArray(data.projects) && data.projects.length > 0) filledFields++;

  return Math.round((filledFields / totalFields) * 100);
};
