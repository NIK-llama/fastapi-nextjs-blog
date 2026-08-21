"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { CreatePostModal } from "./CreatePostModal";
import {
  Sun,
  Moon,
  Monitor,
  PlusCircle,
  Menu,
  X,
  BookOpen,
} from "lucide-react";
import { getMediaUrl } from "@/lib/api";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const avatarUrl = getMediaUrl(user?.image_path);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border glass-nav">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Left: Brand */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-black text-xl tracking-tight text-foreground hover:opacity-90 transition-opacity"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-primary-foreground shadow-md shadow-primary/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <span>FastAPI Blog</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className="px-3.5 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/60 rounded-xl transition-colors"
              >
                Home
              </Link>
              <a
                href="https://fastapi-nextjs-blog.onrender.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/60 rounded-xl transition-colors flex items-center gap-1.5"
              >
                API Docs
              </a>
            </nav>
          </div>

          {/* Right: Auth & Settings */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={() => setIsPostModalOpen(true)}
                  className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl shadow-sm flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <PlusCircle className="w-4 h-4" />
                  New Post
                </button>

                <Link
                  href="/account"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted rounded-xl border border-border/60 transition-colors"
                >
                  <Image
                    src={avatarUrl || "/profile_pics/default.jpg"}
                    alt={user.username}
                    width={24}
                    height={24}
                    unoptimized
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span>{user.username}</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-xl border border-border transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl shadow-sm transition-all"
                >
                  Register
                </Link>
              </>
            )}

            {/* Theme Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="p-2 text-foreground hover:bg-muted rounded-xl border border-border transition-colors"
                title="Toggle Theme"
              >
                {resolvedTheme === "light" ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-blue-400" />
                )}
              </button>

              {isThemeMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-card border border-border rounded-xl shadow-lg p-1.5 space-y-1 z-50 animate-in fade-in duration-150">
                  <button
                    onClick={() => {
                      setTheme("light");
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      theme === "light" ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" /> Light
                  </button>
                  <button
                    onClick={() => {
                      setTheme("dark");
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      theme === "dark" ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" /> Dark
                  </button>
                  <button
                    onClick={() => {
                      setTheme("auto");
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      theme === "auto" ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" /> Auto
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-card p-4 space-y-3 animate-in slide-in-from-top duration-200">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted"
            >
              Home
            </Link>
            <a
              href="https://fastapi-nextjs-blog.onrender.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted"
            >
              API Docs (/docs)
            </a>

            <div className="border-t border-border pt-3 space-y-2">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsPostModalOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" /> New Post
                  </button>
                  <Link
                    href="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted"
                  >
                    Account ({user.username})
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* New Post Modal */}
      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />
    </>
  );
};
