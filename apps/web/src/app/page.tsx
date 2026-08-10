"use client";

import React, { useEffect, useState } from "react";
import { Post, PaginatedPostsResponse } from "@blog/types";
import { api } from "@/lib/api";
import { PostCard } from "@/components/PostCard";
import { Sidebar } from "@/components/Sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Activity, CheckCircle2, AlertCircle } from "lucide-react";

interface HealthStatus {
  status: string;
  service: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Health check status state
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);

  const limit = 10;

  useEffect(() => {
    // Call GET /health from FastAPI backend
    const checkHealth = async () => {
      try {
        setHealthLoading(true);
        const res = await api.get<HealthStatus>("/health");
        setHealth(res.data);
      } catch (err) {
        console.error("Health check failed:", err);
        setHealth(null);
      } finally {
        setHealthLoading(false);
      }
    };

    checkHealth();
    fetchPosts(0);
  }, []);

  const fetchPosts = async (skipCount: number, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const response = await api.get<PaginatedPostsResponse>(
        `/api/posts?skip=${skipCount}&limit=${limit}`
      );

      if (append) {
        setPosts((prev) => [...prev, ...response.data.posts]);
      } else {
        setPosts(response.data.posts);
      }

      setOffset(skipCount + response.data.posts.length);
      setHasMore(response.data.has_more);
      setError(null);
    } catch (err: unknown) {
      console.error("Failed to fetch posts:", err);
      setError("Failed to load posts. Please check if the FastAPI backend is running.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    fetchPosts(offset, true);
  };

  return (
    <div className="space-y-6">
      {/* Health Status Banner */}
      <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              FastAPI Backend Service
            </h2>
            <p className="text-xs text-muted-foreground">
              Calling <code className="text-primary font-mono bg-muted px-1.5 py-0.5 rounded">GET /health</code>
            </p>
          </div>
        </div>

        <div>
          {healthLoading ? (
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking...
            </span>
          ) : health && health.status === "healthy" ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
              <AlertCircle className="w-3.5 h-3.5" /> Offline
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Post Feed (8 Cols) */}
        <section className="lg:col-span-8">
          <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center justify-between">
            <span>Recent Posts</span>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
              Feed
            </span>
          </h1>

          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
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
              <p className="text-muted-foreground text-base">No blog posts found yet.</p>
              <p className="text-xs text-muted-foreground mt-1">
                Be the first to publish a post using the New Post button!
              </p>
            </div>
          ) : (
            <div>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}

              {hasMore && (
                <div className="text-center mt-8 mb-6">
                  <button
                    onClick={handleLoadMore}
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

        {/* Sidebar (4 Cols) */}
        <aside className="lg:col-span-4">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}
