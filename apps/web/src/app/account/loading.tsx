import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Profile header skeleton */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex items-center gap-6">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="space-y-2.5">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>

      {/* Profile form skeleton */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* Password form skeleton */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <Skeleton className="h-6 w-44" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
