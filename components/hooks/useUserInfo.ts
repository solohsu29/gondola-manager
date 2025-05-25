"use client";
import { useEffect, useState } from "react";

import { useLocalStore } from "./useLocalStore";
import { User } from "@/lib/generated/prisma";


export const useUserInfo = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const { getItem, setItem, removeItem } = useLocalStore();

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
    // Still use localStorage for non-auth flows (email/code/role)
    const storedEmail = getItem("email");
    const storedCode = getItem("code");
    const storedRole = getItem("role");
    if (storedEmail) setEmail(storedEmail);
    if (storedCode) setCode(storedCode);
    if (storedRole) setRole(storedRole);
  }, []);

  const storeEmail = (email: string) => {
    setItem("email", email);
    setEmail(email);
  };
  const storeCode = (code: string) => {
    setItem("code", code);
    setCode(code);
  };
  const storeRole = (role: string) => {
    setItem("role", role);
    setRole(role);
  };

  const removeForgotPassData = () => {
    removeItem("email");
    setEmail(null);
    removeItem("code");
    setCode(null);
  };

  const removeAllData = () => {
    removeItem("email");
    removeItem("code");
    removeItem("role");
    setEmail(null);
    setCode(null);
    setRole(null);
    setUser(null);
  };

  return {
    user,
    loading,
    removeAllData,
    storeEmail,
    email,
    storeCode,
    code,
    removeForgotPassData,
    role,
    storeRole,
  };
};
