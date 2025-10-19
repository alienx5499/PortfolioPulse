'use client';

import { memo } from 'react';
import { TrendingUp, TrendingDown } from "lucide-react";

interface Mover {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface TodaysMoversProps {
  gainers?: Mover[];
  losers?: Mover[];
}

const defaultGainers: Mover[] = [
  { symbol: "NVDA", name: "NVIDIA Corp", price: 495.22, change: 12.45, changePercent: 2.58 },
  { symbol: "AMD", name: "Advanced Micro Devices", price: 152.80, change: 4.20, changePercent: 2.83 },
  { symbol: "TSLA", name: "Tesla Inc", price: 242.84, change: 6.15, changePercent: 2.60 },
];

const defaultLosers: Mover[] = [
  { symbol: "META", name: "Meta Platforms", price: 338.15, change: -8.24, changePercent: -2.38 },
  { symbol: "AAPL", name: "Apple Inc", price: 178.65, change: -3.42, changePercent: -1.88 },
  { symbol: "NFLX", name: "Netflix Inc", price: 445.80, change: -9.15, changePercent: -2.01 },
];

function TodaysMovers({ gainers = defaultGainers, losers = defaultLosers }: TodaysMoversProps) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Today's Movers</h3>
            <p className="text-sm text-muted-foreground">Market's biggest changes</p>
          </div>
        </div>
      </div>
      
      <div className="card-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gainers */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-success/20">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-success">Top Gainers</h4>
                <p className="text-sm text-muted-foreground">Highest performers</p>
              </div>
            </div>
            <div className="space-y-2">
              {gainers.map((stock, index) => (
                <div 
                  key={stock.symbol} 
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border hover:border-success/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/20 text-success font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{stock.symbol}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[180px]">{stock.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">${stock.price.toFixed(2)}</div>
                    <div className="text-sm font-semibold text-success flex items-center gap-1 justify-end">
                      <TrendingUp className="h-3 w-3" />
                      +{stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Losers */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-destructive/20">
                <TrendingDown className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-destructive">Top Losers</h4>
                <p className="text-sm text-muted-foreground">Biggest declines</p>
              </div>
            </div>
            <div className="space-y-2">
              {losers.map((stock, index) => (
                <div 
                  key={stock.symbol} 
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border hover:border-destructive/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-destructive/20 text-destructive font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{stock.symbol}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[180px]">{stock.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">${stock.price.toFixed(2)}</div>
                    <div className="text-sm font-semibold text-destructive flex items-center gap-1 justify-end">
                      <TrendingDown className="h-3 w-3" />
                      {stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(TodaysMovers);

