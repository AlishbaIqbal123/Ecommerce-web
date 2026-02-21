// ============================================
// FIREBASE AUTHENTICATION SERVICE
// ============================================

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  linkWithPopup,
  unlink,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { sanitizeData } from './firestore';
import type { User, UserRole } from '@/types';

// ============================================
// AUTH STATE OBSERVER
// ============================================

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      let user = await getUserData(firebaseUser.uid);

      if (!user) {
        // Doc missing - likely a demo/dev sync issue. attempt recovery.
        const email = firebaseUser.email || '';
        let role: UserRole = 'user';
        if (email.toLowerCase().includes('admin')) role = 'admin';
        else if (email.toLowerCase().includes('vendor')) role = 'vendor';

        user = await createUserDocument(firebaseUser, role);
      }

      callback(user);
    } else {
      callback(null);
    }
  });
};

// ============================================
// USER DATA MANAGEMENT
// ============================================

export const getUserData = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return { id: uid, ...userDoc.data() } as User;
    }
    return null;
  } catch (error: any) {
    if (error.code === 'unavailable') {
      console.error('Firestore is unavailable (offline). Check your internet connection or if Firebase is blocked.');
    } else {
      console.error('Error fetching user data:', error);
    }
    return null;
  }
};

export const createUserDocument = async (
  firebaseUser: FirebaseUser,
  role: UserRole = 'user'
): Promise<User> => {
  const userData: Omit<User, 'id'> = {
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || '',
    photoURL: firebaseUser.photoURL || null,
    role,
    phoneNumber: firebaseUser.phoneNumber || null,
    createdAt: new Date(),
    updatedAt: new Date(),
    isEmailVerified: firebaseUser.emailVerified,
    favorites: [],
  };

  const sanitizedData = sanitizeData(userData);

  await setDoc(doc(db, 'users', firebaseUser.uid), {
    ...sanitizedData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { id: firebaseUser.uid, ...userData };
};

export const updateUserDocument = async (
  uid: string,
  data: Partial<User>
): Promise<void> => {
  const sanitizedData = sanitizeData(data);

  await updateDoc(doc(db, 'users', uid), {
    ...sanitizedData,
    updatedAt: serverTimestamp(),
  });
};

// ============================================
// EMAIL/PASSWORD AUTH
// ============================================

export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string,
  role: UserRole = 'user'
): Promise<User> => {
  const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);

  // Update profile
  await updateProfile(firebaseUser, { displayName });

  // Create user document
  const user = await createUserDocument(firebaseUser, role);

  // Send email verification
  await sendEmailVerification(firebaseUser);

  return user;
};

export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);

  let user = await getUserData(firebaseUser.uid);

  if (!user) {
    // If user document is missing, recreate it
    // For demo/dev purposes, infer role from email if it's a demo account
    let role: UserRole = 'user';
    if (email.toLowerCase().includes('admin')) role = 'admin';
    else if (email.toLowerCase().includes('vendor')) role = 'vendor';

    user = await createUserDocument(firebaseUser, role);
  }

  return user;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const resendVerificationEmail = async (): Promise<void> => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    await sendEmailVerification(currentUser);
  }
};

// ============================================
// OAUTH PROVIDERS
// ============================================

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export const signInWithGoogle = async (): Promise<User> => {
  const { user: firebaseUser } = await signInWithPopup(auth, googleProvider);

  // Check if user document exists
  let user = await getUserData(firebaseUser.uid);

  if (!user) {
    // Create new user document
    user = await createUserDocument(firebaseUser, 'user');
  }

  return user;
};

export const signInWithFacebook = async (): Promise<User> => {
  const { user: firebaseUser } = await signInWithPopup(auth, facebookProvider);

  let user = await getUserData(firebaseUser.uid);

  if (!user) {
    user = await createUserDocument(firebaseUser, 'user');
  }

  return user;
};

export const linkGoogleAccount = async (): Promise<void> => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    await linkWithPopup(currentUser, googleProvider);
  }
};

export const unlinkProvider = async (providerId: string): Promise<void> => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    await unlink(currentUser, providerId);
  }
};

// ============================================
// TWO-FACTOR AUTHENTICATION (2FA)
// ============================================

export const enroll2FA = async (_phoneNumber: string): Promise<string> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('No authenticated user');
  }

  // In a real implementation, you would use reCAPTCHA verifier
  // const multiFactorUser = multiFactor(currentUser);
  // const phoneAuthProvider = new PhoneAuthProvider(auth);
  // const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneNumber, recaptchaVerifier);

  // For demo purposes, return a mock verification ID
  return 'mock-verification-id';
};

export const verify2FAEnrollment = async (
  verificationId: string,
  verificationCode: string
): Promise<void> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('No authenticated user');
  }

  const multiFactorUser = multiFactor(currentUser);
  const phoneAuthCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
  const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneAuthCredential);

  await multiFactorUser.enroll(multiFactorAssertion, 'Phone Number');
};

export const unenroll2FA = async (): Promise<void> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('No authenticated user');
  }

  const multiFactorUser = multiFactor(currentUser);
  const enrolledFactors = multiFactorUser.enrolledFactors;

  if (enrolledFactors.length > 0) {
    await multiFactorUser.unenroll(enrolledFactors[0]);
  }
};

// ============================================
// ROLE MANAGEMENT
// ============================================

export const updateUserRole = async (uid: string, role: UserRole): Promise<void> => {
  await updateUserDocument(uid, { role });
};

export const checkUserRole = async (uid: string, requiredRole: UserRole): Promise<boolean> => {
  const user = await getUserData(uid);
  if (!user) return false;

  // Admin can access everything
  if (user.role === 'admin') return true;

  // Check specific role
  return user.role === requiredRole;
};

// ============================================
// AUTH UTILITIES
// ============================================

export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

export const isAuthenticated = (): boolean => {
  return auth.currentUser !== null;
};

export const getAuthToken = async (): Promise<string | null> => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    return await currentUser.getIdToken();
  }
  return null;
};
