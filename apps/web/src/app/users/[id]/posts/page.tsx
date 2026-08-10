"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Post, UserPublic, PaginatedPostsResponse } from "@blog/types";
import { api } from "@/lib/api";
import { PostCard } from "@/components/PostCard";
import { Sidebar } from "@/components/Sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, User } from "lucide-react";

export default function UserPostsPage() {
  const params = useParams();
  const userId = params.id;

  const [userPublic, setUserPublic] = useState<UserPublic | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limit = 10;

  useEffect(() => {
    if (!userId) return;

    const fetchUserInfo = async () => {
      try {
        const res = await api.get<UserPublic>(`/api/users/${userId}`);
        setUserPublic(res.data);
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };

    fetchUserInfo();
    fetchUserPosts(0);
  }, [userId]);

  const fetchUserPosts = async (skipCount: number, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const res = await api.get<PaginatedPostsResponse>(
        `/api/users/${userId}/posts?skip=${skipCount}&limit=${limit}`
      );

      if (append) {
        setPosts((prev) => [...prev, ...res.data.posts]);
      } else {
        setPosts(res.data.posts);
      }

      setOffset(skipCount + res.data.posts.length);
      setHasMore(res.data.has_more);
      setError(null);
    } catch (err: any) {
      console.error("Error loading user posts:", err);
      setError("Failed to load posts for this user.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <section className="lg:col-span-8 space-y-6">
        <div className="border-b border-border pb-4 mb-6">
          <h1 className="text-3xl font-black text-foreground flex items-center gap-3">
            <User className="w-8 h-8 text-primary" />
            <span>Posts by {userPublic?.username || `User #${userId}`}</span>
          </h1>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm flex gap-4 items-start">
                <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-xl bg-card">
            <p className="text-muted-foreground text-base">No posts found by this user.</p>
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {hasMore && (
              <div className="text-center mt-8 mb-6">
                <button
                  onClick={() => fetchUserPosts(offset, true)}
                  disabled={loadingMore}
                  className="px-6 py-2.5 text-sm font-semibold text-primary border border-primary/40 hover:bg-primary/10 rounded-xl transition-all shadow-sm flex items-center gap-2 mx-auto disabled:opacity-50"
                >
                  {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loadingMore ? "Loading..." : "Load More Posts"}
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      <aside className="lg:col-span-4">
        <Sidebar />
      </aside>
    </div>
  );
}
