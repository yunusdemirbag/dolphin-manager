"use client";

import Link from "next/link";
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, ChevronLeft, ChevronRight, LogOut, LayoutDashboard, ShoppingBag, List, Bot, Settings } from "lucide-react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const year = new Date().getFullYear();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!loading && !user && !pathname.startsWith('/auth')) {
      router.replace('/auth/login');
    }
  }, [user, loading, pathname, router]);

  if (!user && !pathname.startsWith('/auth')) {
    return null;
  }

  const menu = [
    { href: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { href: "/products", icon: <ShoppingBag size={20} />, label: "Ürünler" },
    { href: "/orders", icon: <List size={20} />, label: "Siparişler" },
    { href: "/assistant", icon: <Bot size={20} />, label: "Dolphin Asistan" },
    { href: "/settings", icon: <Settings size={20} />, label: "Ayarlar" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-blue-700 text-white flex flex-col py-8 px-2 min-h-screen shadow-lg transition-all duration-300 ${hovered ? 'w-64' : 'w-20'}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: "pointer" }}
      >
        {/* Logo */}
        <div className="mb-10 text-center">
          {hovered ? (
            <h1 className="font-bold tracking-tight text-xl whitespace-nowrap">Dolphin Manager</h1>
          ) : (
            <h1 className="font-bold tracking-wide text-2xl">DM</h1>
          )}
        </div>
        {/* Menu */}
        <nav className="flex-1 space-y-2">
          {menu.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 py-2 px-3 rounded hover:bg-blue-600 transition ${hovered ? '' : 'justify-center'}`}
            >
              {item.icon}
              {hovered && <span className="text-base whitespace-nowrap">{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="mt-10 text-xs text-blue-200 text-center">
          &copy; {year} Dolphin Manager
        </div>
        {/* Logout Button */}
        <button
          onClick={async (e) => {
            e.stopPropagation();
            await signOut();
            router.push('/auth/login');
          }}
          className={`mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold transition flex items-center justify-center gap-2 ${hovered ? 'px-4' : 'px-0'}`}
        >
          <LogOut size={18} />
          {hovered && <span className="text-base">Çıkış Yap</span>}
        </button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
} 