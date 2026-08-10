"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { api, getMediaUrl } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import {
  User,
  Mail,
  Lock,
  Upload,
  LogOut,
  Trash2,
  Loader2,
  AlertTriangle,
  Camera,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, logout, refetchUser } = useAuth();

  // Profile update form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Avatar upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarSuccess, setAvatarSuccess] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  // Delete account modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-4">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex items-center gap-6">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="space-y-2.5">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  const currentAvatarUrl = getMediaUrl(user.image_path);

  // Handle Profile Update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess(null);
    setProfileError(null);

    try {
      await api.patch(`/api/users/${user.id}`, { username, email });
      await refetchUser();
      setProfileSuccess("Profile updated successfully!");
    } catch (err: any) {
      setProfileError(getErrorMessage(err?.response?.data || err));
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Avatar Selection & Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAvatarSuccess(null);
      setAvatarError(null);
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) return;
    setAvatarLoading(true);
    setAvatarSuccess(null);
    setAvatarError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await api.patch(`/api/users/${user.id}/picture`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await refetchUser();
      setSelectedFile(null);
      setPreviewUrl(null);
      setAvatarSuccess("Profile picture updated successfully!");
    } catch (err: any) {
      setAvatarError(getErrorMessage(err?.response?.data || err));
    } finally {
      setAvatarLoading(false);
    }
  };

  // Handle Change Password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setPassError("New passwords do not match.");
      return;
    }

    setPassLoading(true);
    setPassSuccess(null);
    setPassError(null);

    try {
      await api.patch("/api/users/me/password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setPassSuccess("Password changed successfully!");
    } catch (err: any) {
      setPassError(getErrorMessage(err?.response?.data || err));
    } finally {
      setPassLoading(false);
    }
  };

  // Handle Delete Account
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await api.delete(`/api/users/${user.id}`);
      logout();
    } catch (err: any) {
      setDeleteError(getErrorMessage(err?.response?.data || err));
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-black text-foreground">Account Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your personal profile and account preferences</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex items-center gap-6">
        <div className="relative group">
          <Image
            src={previewUrl || currentAvatarUrl || "/profile_pics/default.jpg"}
            alt={user.username}
            width={96}
            height={96}
            unoptimized
            className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20 shadow-md"
          />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">{user.username}</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Mail className="w-4 h-4" /> {user.email}
          </p>
          <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full">
            Verified User
          </span>
        </div>
      </div>

      {/* Section 1: Profile Picture */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" /> Profile Picture
        </h3>
        <p className="text-xs text-muted-foreground">
          Upload a custom avatar (JPEG, PNG, GIF, WebP, max 5MB). Images are resized and stored securely on Cloudflare R2.
        </p>

        {avatarSuccess && (
          <div className="p-3 text-xs text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            {avatarSuccess}
          </div>
        )}
        {avatarError && (
          <div className="p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
            {avatarError}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-muted file:text-foreground hover:file:bg-muted/80 cursor-pointer"
          />
          {selectedFile && (
            <button
              onClick={handleAvatarUpload}
              disabled={avatarLoading}
              className="px-4 py-2 text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              {avatarLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              Upload Image
            </button>
          )}
        </div>
      </div>

      {/* Section 2: Update Details */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <User className="w-5 h-5 text-primary" /> Personal Information
        </h3>

        {profileSuccess && (
          <div className="p-3 text-xs text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            {profileSuccess}
          </div>
        )}
        {profileError && (
          <div className="p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
            {profileError}
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={profileLoading}
            className="px-5 py-2 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {profileLoading && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
          </button>
        </form>
      </div>

      {/* Section 3: Change Password */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" /> Security & Password
        </h3>

        {passSuccess && (
          <div className="p-3 text-xs text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            {passSuccess}
          </div>
        )}
        {passError && (
          <div className="p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
            {passError}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={passLoading}
            className="px-5 py-2 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {passLoading && <Loader2 className="w-4 h-4 animate-spin" />} Update Password
          </button>
        </form>
      </div>

      {/* Section 4: Logout & Danger Zone */}
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-destructive flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Danger Zone
        </h3>
        <p className="text-xs text-muted-foreground">
          Permanently delete your account and all associated posts. This action is immediate and cannot be undone.
        </p>

        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-foreground bg-card hover:bg-muted border border-border rounded-xl flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-4 py-2 text-sm font-semibold text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-xl flex items-center gap-2 shadow-sm transition-all"
          >
            <Trash2 className="w-4 h-4" /> Delete Account
          </button>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-xl p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-foreground">Delete Account Permanently?</h3>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete your account? All your posts, profile pictures, and data will be erased forever.
            </p>

            {deleteError && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl text-left">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleDeleteAccount}
                className="px-5 py-2 text-sm font-semibold text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-xl shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {deleteLoading && <Loader2 className="w-4 h-4 animate-spin" />} Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
