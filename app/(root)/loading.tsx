import Loader from "@/components/ui/loader-11";

export default function Loading() {
  return (
    <div className="container py-6 flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader />
        <p className="text-muted-foreground text-sm">Loading dashboard...</p>
      </div>
    </div>
  );
}

