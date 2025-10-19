export function CardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="card-header">
        <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-muted rounded w-1/2"></div>
      </div>
      <div className="card-content">
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
          <div className="h-4 bg-muted rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
}

export function WidgetSkeleton({ height = 400 }: { height?: number }) {
  return (
    <div className="card animate-pulse">
      <div className="card-header">
        <div className="h-6 bg-muted rounded w-1/3"></div>
      </div>
      <div className="card-content p-0">
        <div className="bg-muted rounded" style={{ height: `${height}px` }}></div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="dashboard-content">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="animate-pulse">
          <div className="h-10 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>

        {/* Stats Row Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>

        {/* Movers Skeleton */}
        <CardSkeleton />

        {/* Main Grid Skeleton */}
        <div className="dashboard-grid">
          <div className="md:col-span-2 lg:col-span-2">
            <WidgetSkeleton height={400} />
          </div>
          <div className="md:col-span-1 lg:col-span-1">
            <WidgetSkeleton height={400} />
          </div>
        </div>

        {/* Secondary Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          <WidgetSkeleton height={500} />
          <WidgetSkeleton height={500} />
        </div>
      </div>
    </div>
  );
}

