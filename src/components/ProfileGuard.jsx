import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import CompleteProfile from "../pages/CompleteProfile";
import AppLoader from "./ui/AppLoader";

const ProfileGuard = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    // ✅ Not logged in → allow app
    if (!user && !authLoading) {
      setProfileComplete(true);
      setCheckingProfile(false);
      return;
    }

    if (!user) return;

    setCheckingProfile(true);

    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists() && snap.data()?.college && snap.data()?.gender) {
        setProfileComplete(true);
      } else {
        setProfileComplete(false);
      }
      setCheckingProfile(false);
    });

    return () => unsub();
  }, [user, authLoading]);

  if (authLoading || checkingProfile) {
    return <AppLoader />;
  }

  if (!profileComplete) {
    return <CompleteProfile />;
  }

  return children;
};

export default ProfileGuard;
