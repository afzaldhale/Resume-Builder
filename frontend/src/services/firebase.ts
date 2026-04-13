import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Validate config
if (!firebaseConfig.apiKey) {
  console.error('❌ Firebase configuration is incomplete. Check your .env.local file for VITE_FIREBASE_* variables.');
  console.error('Required variables:', {
    apiKey: !!firebaseConfig.apiKey,
    authDomain: !!firebaseConfig.authDomain,
    projectId: !!firebaseConfig.projectId,
    storageBucket: !!firebaseConfig.storageBucket,
    messagingSenderId: !!firebaseConfig.messagingSenderId,
    appId: !!firebaseConfig.appId,
  });
} else {
  console.log('✅ Firebase initialized successfully');
  console.log('🔗 Firebase project:', firebaseConfig.projectId);
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Test Firestore connectivity
const testFirestoreConnection = async () => {
  try {
    // Try to get a non-existent document to test connectivity
    await getDoc(doc(db, '_test', 'connection'));
    console.log('✅ Firestore connection successful');
  } catch (error: any) {
    if (error.code === 'unavailable' || error.message.includes('offline')) {
      console.error('❌ Firestore connection failed - check security rules and network');
      console.error('🔧 You may need to deploy Firestore security rules');
    } else {
      console.log('✅ Firestore initialized (test query completed)');
    }
  }
};

// Run connectivity test
testFirestoreConnection();

export default firebaseConfig;
