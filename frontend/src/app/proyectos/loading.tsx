export default function ProjectsCatalogLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col animate-pulse">
      {/* Navbar Placeholder */}
      <div className="h-20 w-full bg-slate-900/40 border-b border-white/5" />

      {/* Hero Header Skeleton */}
      <div className="pt-40 pb-24 px-6 min-h-[45vh] bg-slate-900/60 flex flex-col items-center justify-center">
        <div className="h-6 w-36 rounded-full bg-white/10 mb-6" />
        <div className="h-16 w-80 rounded-2xl bg-white/10 mb-4" />
        <div className="h-5 w-96 rounded-full bg-white/10" />
      </div>

      {/* Cards Grid Skeleton */}
      <div className="container mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-3xl overflow-hidden bg-white/80 border border-slate-100 shadow-sm flex flex-col">
            <div className="h-64 bg-slate-200 w-full" />
            <div className="p-6 space-y-4">
              <div className="h-6 w-3/4 bg-slate-200 rounded" />
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-10 w-full bg-slate-200 rounded-xl mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
