"use client";
import React, { useMemo, useState } from "react";
import { addToWatchlist, removeFromWatchlist } from "@/lib/actions/watchlist.actions";
import { toast } from "sonner";
import { Star, Trash2 } from "lucide-react";

interface WatchlistButtonProps {
  symbol: string;
  company: string;
  isInWatchlist: boolean;
  showTrashIcon?: boolean;
  type?: "button" | "icon";
  onWatchlistChange?: (symbol: string, added: boolean) => void;
  userEmail?: string;
}

const WatchlistButton = ({
  symbol,
  company,
  isInWatchlist,
  showTrashIcon = false,
  type = "button",
  onWatchlistChange,
  userEmail,
}: WatchlistButtonProps) => {
  const [added, setAdded] = useState<boolean>(!!isInWatchlist);
  const [loading, setLoading] = useState(false);

  const label = useMemo(() => {
    if (type === "icon") return added ? "" : "";
    return added ? "Remove from Watchlist" : "Add to Watchlist";
  }, [added, type]);

  const handleClick = async () => {
    if (!userEmail) {
      toast.error("Please sign in to manage your watchlist");
      return;
    }

    setLoading(true);
    try {
      const next = !added;
      
      if (next) {
        // Adding to watchlist
        const result = await addToWatchlist(userEmail, symbol, company);
        if (result.success) {
          setAdded(true);
          onWatchlistChange?.(symbol, true);
          toast.success(`${symbol} added to watchlist`);
        } else {
          toast.error(result.error || "Failed to add to watchlist");
        }
      } else {
        // Removing from watchlist
        const result = await removeFromWatchlist(userEmail, symbol);
        if (result.success) {
          setAdded(false);
          onWatchlistChange?.(symbol, false);
          toast.success(`${symbol} removed from watchlist`);
        } else {
          toast.error(result.error || "Failed to remove from watchlist");
        }
      }
    } catch (error) {
      console.error("Watchlist action error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (type === "icon") {
    return (
      <button
        title={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        aria-label={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
          added 
            ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20" 
            : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={handleClick}
        disabled={loading}
      >
        <Star 
          className={`h-4 w-4 ${added ? "fill-current" : ""}`} 
        />
      </button>
    );
  }

  return (
    <button 
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        added 
          ? "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20" 
          : "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={handleClick}
      disabled={loading}
    >
      {showTrashIcon && added ? (
        <Trash2 className="h-4 w-4" />
      ) : (
        <Star className={`h-4 w-4 ${added ? "fill-current" : ""}`} />
      )}
      <span>{loading ? "..." : label}</span>
    </button>
  );
};

export default WatchlistButton;
