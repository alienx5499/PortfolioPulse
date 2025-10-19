'use client';

import { memo } from 'react';
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface MarketStat {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
}

interface MarketInsightsProps {
  stats?: MarketStat[];
}

const defaultStats: MarketStat[] = [
  { label: "S&P 500", value: "4,783.45", change: 1.24, trend: 'up' },
  { label: "NASDAQ", value: "14,843.77", change: 2.15, trend: 'up' },
  { label: "DOW", value: "37,545.33", change: -0.45, trend: 'down' },
  { label: "VIX", value: "13.42", change: -2.10, trend: 'down' },
];

function MarketInsights({ stats = defaultStats }: MarketInsightsProps) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Market Pulse</h3>
            <p className="text-sm text-muted-foreground">Real-time market indices</p>
          </div>
        </div>
      </div>
      <div className="card-content">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="p-4 rounded-lg border border-border bg-muted/30 hover:border-primary/50 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </div>
              <div className="text-xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className={`text-sm font-semibold ${
                stat.trend === 'up' ? 'text-success' : 'text-destructive'
              }`}>
                {stat.trend === 'up' ? '+' : ''}{stat.change}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(MarketInsights);

