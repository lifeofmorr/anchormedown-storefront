/**
 * Loading skeletons in the storefront's material language — coal blocks
 * with a brass-tinted pulse, shaped like the surfaces they stand in for.
 */
export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse bg-coal ${className}`} />;
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4" role="status" aria-label="Loading products">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <SkeletonBlock className="aspect-[4/5] w-full" />
          <SkeletonBlock className="h-3 w-2/3" />
          <SkeletonBlock className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}

export function ArticleListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-6" role="status" aria-label="Loading articles">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-5">
          <SkeletonBlock className="aspect-[4/3] w-40 shrink-0" />
          <div className="flex-1 space-y-3 py-1">
            <SkeletonBlock className="h-3 w-1/4" />
            <SkeletonBlock className="h-5 w-3/4" />
            <SkeletonBlock className="h-3 w-full" />
            <SkeletonBlock className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminSkeleton() {
  return (
    <div className="space-y-8" role="status" aria-label="Loading operator data">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-28 w-full" />
        ))}
      </div>
      <SkeletonBlock className="h-72 w-full" />
      <SkeletonBlock className="h-96 w-full" />
    </div>
  );
}
