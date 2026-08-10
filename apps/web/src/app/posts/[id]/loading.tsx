import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <section className="lg:col-span-8 space-y-6">
        {/* Back link skeleton */}
        <Skeleton className="h-4 w-28" />

        {/* Article detail skeleton */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm space-y-6">
          {/* Author info */}
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3.5 w-28" />
            </div>
          </div>

          {/* Title */}
          <Skeleton className="h-9 w-4/5" />

          {/* Content lines */}
          <div className="space-y-3 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </section>

      {/* Sidebar skeleton */}
      <aside className="lg:col-span-4">
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </aside>
    </div>
  );
}
