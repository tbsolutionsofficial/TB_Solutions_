import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";

interface AdminAuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

// Any account that can sign in IS the allowlist — only accounts you create by hand in
// the Firebase Console (Authentication > Users) exist, and there's no public sign-up route.
export function useAdminAuth() {
  const [state, setState] = useState<AdminAuthState>({ user: null, isAdmin: false, loading: true });

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setState({ user, isAdmin: !!user, loading: false });
    });
  }, []);

  const signIn = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);
  const signOut = () => firebaseSignOut(auth);
  const updateAvatar = async (photoURL: string) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, { photoURL });
    setState((s) => ({ ...s }));
  };

  return { ...state, signIn, signOut, updateAvatar };
}
