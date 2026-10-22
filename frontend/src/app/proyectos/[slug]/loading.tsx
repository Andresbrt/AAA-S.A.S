export default function ProjectLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col animate-pulse">
      {/* Top Navbar Skeleton Placeholder */}
      <div className="h-20 w-full bg-slate-900/40 border-b border-white/5" />

      {/* Hero Banner Skeleton */}
      <div className="relative h-[70vh] lg:h-[80vh] w-full bg-slate-900/60 flex items-center justify-center">
        <div className="text-center px-4 max-w-3xl w-full flex flex-col items-center gap-4">
          <div className="h-6 w-32 rounded-full bg-white/10" />
          <div className="h-14 md:h-20 w-3/4 rounded-2xl bg-white/10" />
          <div className="h-6 w-48 rounded-full bg-white/10" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="py-16 px-6 relative z-20 -mt-20 max-w-6xl mx-auto w-full">
        <div className="bg-white/80 rounded-[2.5rem] p-8 md:p-14 shadow-lg border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="h-8 w-48 bg-slate-200 rounded-lg" />
            <div className="space-y-3">
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-5/6" />
              <div className="h-4 bg-slate-100 rounded w-4/6" />
            </div>
            {/* Gallery placeholder */}
            <div className="aspect-[16/9] w-full rounded-2xl bg-slate-100" />
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-10 w-44 bg-slate-200 rounded-lg" />
              <div className="h-12 w-full bg-[var(--color-caribbean-dark)]/20 rounded-xl" />
              <div className="h-12 w-full bg-slate-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
