import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-md mx-auto py-12">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm space-y-6">
        {/* Icon + heading */}
        <div className="flex flex-col items-center space-y-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-56" />
        </div>

        {/* Form fields */}
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>

        {/* Footer link */}
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>
    </div>
  );
}
