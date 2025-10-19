"use client"

import { useEffect, useState } from "react"
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command"
import {Button} from "@/components/ui/button";
import { TrendingUp} from "lucide-react";
import Link from "next/link";
import {searchStocks} from "@/lib/actions/finnhub.actions";
import {useDebounce} from "@/hooks/useDebounce";
import WatchlistButton from "@/components/WatchlistButton";
import Loader from "@/components/ui/loader-11";

export default function SearchCommand({ renderAs = 'button', label = 'Add stock', initialStocks, userEmail }: SearchCommandProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen(v => !v)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const handleSearch = async () => {
    if(!isSearchMode) return setStocks(initialStocks);

    setLoading(true)
    try {
        const results = await searchStocks(searchTerm.trim());
        // Add watchlist status to search results
        const stocksWithWatchlistStatus = results.map(stock => ({
          ...stock,
          isInWatchlist: initialStocks.some(initialStock => 
            initialStock.symbol === stock.symbol && initialStock.isInWatchlist
          )
        }));
        setStocks(stocksWithWatchlistStatus);
    } catch {
      setStocks([])
    } finally {
      setLoading(false)
    }
  }

  const debouncedSearch = useDebounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm]);

  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm("");
    setStocks(initialStocks);
  }

  return (
    <>
      {renderAs === 'text' ? (
          <span onClick={() => setOpen(true)} className="search-text">
            {label}
          </span>
      ): (
          <Button onClick={() => setOpen(true)} className="search-btn">
            {label}
          </Button>
      )}
      <CommandDialog open={open} onOpenChange={setOpen} className="search-dialog">
         <div className="search-field">
           <CommandInput value={searchTerm} onValueChange={setSearchTerm} placeholder="Search stocks..." className="search-input" />
           {loading && (
             <div className="flex items-center justify-center p-4">
               <div className="text-center">
                 <Loader />
                 <p className="text-muted-foreground text-sm mt-2">Searching stocks...</p>
               </div>
             </div>
           )}
         </div>
        <CommandList className="search-list">
          {loading ? (
              <CommandEmpty className="search-list-empty">Loading stocks...</CommandEmpty>
          ) : displayStocks?.length === 0 ? (
              <div className="search-list-indicator">
                {isSearchMode ? 'No results found' : 'No stocks available'}
              </div>
            ) : (
            <ul>
              <div className="search-count">
                {isSearchMode ? 'Search results' : 'Popular stocks'}
                {` `}({displayStocks?.length || 0})
              </div>
              {displayStocks?.map((stock, i) => (
                  <li key={`${stock.symbol}-${stock.exchange}-${i}`} className="search-item">
                    <div className="flex items-center gap-3 w-full">
                      <Link
                          href={`/stocks/${stock.symbol}`}
                          onClick={handleSelectStock}
                          className="search-item-link flex-1"
                      >
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="search-item-name">
                            {stock.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {stock.symbol} | {stock.exchange } | {stock.type}
                          </div>
                        </div>
                      </Link>
                      <div onClick={(e) => e.stopPropagation()}>
                        <WatchlistButton
                          symbol={stock.symbol}
                          company={stock.name}
                          isInWatchlist={stock.isInWatchlist || false}
                          type="icon"
                          userEmail={userEmail}
                        />
                      </div>
                    </div>
                  </li>
              ))}
            </ul>
          )
          }
        </CommandList>
      </CommandDialog>
    </>
  )
}
