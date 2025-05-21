"use client";
import { useEffect, useState } from "react";

import { useLocalStore } from "./useLocalStore";
import { User } from "@/lib/generated/prisma";


export const useUserInfo = () => {
  const userInitial: User = {
id:0,
    email: "",
    name: "",
   
   
  };

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const { getItem, setItem, removeItem } = useLocalStore();

  useEffect(() => {
    const storedUser = getItem("user");
    const storedToken = getItem("token");
    const storedEmail = getItem("email");
    const storedCode = getItem("code");
    const storedRole = getItem("role");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedCode) {
      setCode(storedCode);
    }
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const storeUserInfo = (data: any) => {
    setItem("user", JSON.stringify(data));
    setUser(data);
  };

  const storeToken = (token: string) => {
    setItem("token", token);
    setToken(token);
  };
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
    removeItem("user");
    removeItem("token");
    removeItem("email");
    removeItem("role");
    setUser(userInitial);
    setToken(null);
    setEmail(null);
    setRole(null);
  };

  return {
    user,
    storeUserInfo,
    token,
    storeToken,
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
