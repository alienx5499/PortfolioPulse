import Loader from "@/components/ui/loader-11";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <Loader />
        <p className="text-muted-foreground text-sm">Loading app...</p>
      </div>
    </div>
  );
}

