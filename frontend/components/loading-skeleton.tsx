export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-muted rounded w-3/4"></div>
      <div className="h-4 bg-muted rounded w-1/2"></div>
      <div className="h-4 bg-muted rounded w-5/6"></div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          {/* Header skeleton */}
          <div className="flex justify-between items-center">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="h-10 bg-muted rounded w-32"></div>
          </div>

          {/* Budget skeleton */}
          <div className="bg-card rounded-xl p-6 border">
            <div className="h-6 bg-muted rounded w-32 mb-4"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>

          {/* Content grid skeleton */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-xl p-6 border">
                  <div className="h-6 bg-muted rounded w-24 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-4 bg-muted rounded w-4/6"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-card rounded-xl p-6 border">
              <div className="h-6 bg-muted rounded w-32 mb-4"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
