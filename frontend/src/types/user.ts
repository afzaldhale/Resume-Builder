/**
 * User and Authentication Types
 */

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  candidateType: 'fresher' | 'experienced';
  profileImageURL?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  candidateType: 'fresher' | 'experienced';
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthError {
  code:
    | 'auth/email-already-in-use'
    | 'auth/invalid-email'
    | 'auth/operation-not-allowed'
    | 'auth/weak-password'
    | 'auth/user-disabled'
    | 'auth/user-not-found'
    | 'auth/wrong-password'
    | 'auth/invalid-credential'
    | string;
  message: string;
}
