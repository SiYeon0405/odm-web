import { useEffect, useState } from "react";
import { getCurrentUser, type MockUser } from "@/features/auth/api/authApi";

export function useAuth() {
  const [user, setUser] = useState<MockUser | null>(() => getCurrentUser());

  useEffect(() => {
    const updateUser = () => setUser(getCurrentUser());

    window.addEventListener("storage", updateUser);
    window.addEventListener("odm-auth-change", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
      window.removeEventListener("odm-auth-change", updateUser);
    };
  }, []);

  return {
    user,
    isLoggedIn: user !== null,
  };
}

