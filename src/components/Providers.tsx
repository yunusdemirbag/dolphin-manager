"use client";

import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import AppLayoutSelector from './AppLayoutSelector';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppLayoutSelector>{children}</AppLayoutSelector>
      </AuthProvider>
    </ThemeProvider>
  );
} 