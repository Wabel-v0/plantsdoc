import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  Timestamp,
  DocumentData,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Authentication methods
export const googleProvider = new GoogleAuthProvider();

// Sign in with email and password
export const loginWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Sign up with email and password
export const registerWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Auth state observer
export const subscribeToAuthChanges = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore methods for diagnosis history
export const saveDiagnosisToHistory = async (
  userId: string,
  diagnosisData: any,
  imageUrl: string
) => {
  try {
    const historyRef = collection(db, "diagnosisHistory");

    // Add the diagnosis to Firestore with a timestamp
    const docRef = await addDoc(historyRef, {
      userId,
      diagnosis: diagnosisData,
      imageUrl, // Save the URL or base64 data of the image
      createdAt: serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error saving diagnosis:", error);
    return { success: false, error: error.message };
  }
};

export const getUserDiagnosisHistory = async (userId: string) => {
  try {
    // Query diagnosis history for the current user, ordered by timestamp
    const historyRef = collection(db, "diagnosisHistory");
    const q = query(
      historyRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    // Transform the data for easy consumption
    const history = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        date: (data.createdAt as Timestamp)?.toDate() || new Date(),
        ...data.diagnosis,
        imageUrl: data.imageUrl,
      };
    });

    return { history, error: null };
  } catch (error: any) {
    console.error("Error fetching diagnosis history:", error);
    return { history: [], error: error.message };
  }
};

export default app;
