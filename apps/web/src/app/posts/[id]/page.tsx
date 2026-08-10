"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Post } from "@blog/types";
import { api, getMediaUrl } from "@/lib/api";
import { formatDate, getErrorMessage } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { EditPostModal } from "@/components/EditPostModal";
import { DeletePostModal } from "@/components/DeletePostModal";
import { Sidebar } from "@/components/Sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit3, Trash2, ArrowLeft } from "lucide-react";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id;
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (!postId) return;
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await api.get<Post>(`/api/posts/${postId}`);
        setPost(response.data);
      } catch (err: any) {
        setError(getErrorMessage(err?.response?.data || err));
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const isAuthor = user && post && user.id === post.author.id;
  const avatarUrl = post ? getMediaUrl(post.author.image_path) : "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <section className="lg:col-span-8 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </Link>

        {loading ? (
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-3.5 w-28" />
              </div>
            </div>
            <Skeleton className="h-9 w-4/5" />
            <div className="space-y-3 pt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        ) : error || !post ? (
          <div className="p-6 border border-destructive/20 bg-destructive/10 text-destructive rounded-2xl text-center">
            <h2 className="text-xl font-bold mb-2">Post Not Found</h2>
            <p className="text-sm">{error || "The requested post does not exist."}</p>
          </div>
        ) : (
          <article className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <Link href={`/users/${post.author.id}/posts`}>
                <Image
                  src={avatarUrl || "/profile_pics/default.jpg"}
                  alt={post.author.username}
                  width={64}
                  height={64}
                  unoptimized
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20 hover:ring-primary/50 transition-all"
                />
              </Link>
              <div>
                <Link
                  href={`/users/${post.author.id}/posts`}
                  className="font-bold text-lg text-foreground hover:text-primary transition-colors"
                >
                  {post.author.username}
                </Link>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Published on {formatDate(post.date_posted)}
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-black text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="prose dark:prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-line text-base mb-8">
              {post.content}
            </div>

            {isAuthor && (
              <div className="flex items-center gap-3 pt-6 border-t border-border">
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-primary" /> Edit Post
                </button>
                <button
                  onClick={() => setIsDeleteOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete Post
                </button>
              </div>
            )}
          </article>
        )}
      </section>

      <aside className="lg:col-span-4">
        <Sidebar />
      </aside>

      {/* Edit & Delete Modals */}
      <EditPostModal
        isOpen={isEditOpen}
        post={post}
        onClose={() => setIsEditOpen(false)}
        onPostUpdated={(updated) => setPost(updated)}
      />

      <DeletePostModal
        isOpen={isDeleteOpen}
        postId={post?.id || null}
        onClose={() => setIsDeleteOpen(false)}
        onPostDeleted={() => router.push("/")}
      />
    </div>
  );
}
