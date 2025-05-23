"use client";
import { usePathname } from "next/navigation";
import ProtectedLayout from "./ProtectedLayout";

export default function AppLayoutSelector({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Eğer auth route'undaysa sadece children'ı döndür
  if (pathname.startsWith("/auth")) {
    return <>{children}</>;
  }
  // Diğer tüm sayfalarda ProtectedLayout'u kullan
  return <ProtectedLayout>{children}</ProtectedLayout>;
} 