'use client';

import { memo } from 'react';
import { Activity, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

interface HealthMetric {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'danger';
  description: string;
}

interface PortfolioHealthProps {
  metrics?: HealthMetric[];
  overallScore?: number;
}

const defaultMetrics: HealthMetric[] = [
  { label: "Diversification", value: "Good", status: 'good', description: "Well balanced across sectors" },
  { label: "Risk Level", value: "Moderate", status: 'warning', description: "Consider hedging positions" },
  { label: "P/L Ratio", value: "Positive", status: 'good', description: "+12.4% this month" },
  { label: "Volatility", value: "High", status: 'danger', description: "Above average fluctuation" },
];

function PortfolioHealth({ metrics = defaultMetrics, overallScore = 72 }: PortfolioHealthProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-success border-success/20 bg-success/5';
      case 'warning': return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
      case 'danger': return 'text-destructive border-destructive/20 bg-destructive/5';
      default: return 'text-muted-foreground border-border bg-muted/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      case 'danger': return <AlertCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Portfolio Health</h3>
              <p className="text-sm text-muted-foreground">Risk & performance metrics</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {overallScore}
            </div>
            <div className="text-xs text-muted-foreground">/ 100</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${overallScore}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="card-content">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${getStatusColor(metric.status)} transition-all duration-200`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">{metric.label}</span>
                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-muted/50">
                  {getStatusIcon(metric.status)}
                </div>
              </div>
              <div className="font-bold text-lg mb-1">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(PortfolioHealth);

