'use client';

import { memo, useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Loader from "@/components/ui/loader-11";

interface PerformanceData {
    date: string;
    value: number;
    change: number;
}

interface PerformanceChartProps {
    data?: PerformanceData[];
    height?: number;
}

// Generate mock performance data based on portfolio stocks
const generatePerformanceData = (stockCount: number): PerformanceData[] => {
    const data: PerformanceData[] = [];
    const today = new Date();
    let currentValue = 10000; // Starting value
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Simulate realistic portfolio performance
        const dailyChange = (Math.random() - 0.5) * 0.05; // ±2.5% daily change
        const volatility = stockCount > 0 ? 0.8 + (stockCount * 0.1) : 0.5; // More stocks = more volatility
        
        currentValue *= (1 + dailyChange * volatility);
        const change = currentValue - 10000;
        
        data.push({
            date: date.toISOString().split('T')[0],
            value: Math.max(currentValue, 5000), // Minimum value
            change: change
        });
    }
    
    return data;
};

function PerformanceChart({ data, height = 300 }: PerformanceChartProps) {
    const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading and generate data
        const timer = setTimeout(() => {
            const generatedData = data || generatePerformanceData(3);
            setPerformanceData(generatedData);
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [data]);

    if (isLoading) {
        return (
            <Card>
                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                    <CardTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-blue-500/10 ring-1 ring-primary/20">
                            <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Performance Chart</h2>
                            <p className="text-muted-foreground text-xs mt-0.5">Portfolio value over time</p>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                        <div className="text-center">
                            <Loader />
                            <p className="text-muted-foreground text-sm mt-4">Loading performance data...</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const latestValue = performanceData[performanceData.length - 1]?.value || 0;
    const firstValue = performanceData[0]?.value || 0;
    const totalChange = latestValue - firstValue;
    const totalChangePercent = firstValue > 0 ? (totalChange / firstValue) * 100 : 0;
    const isPositive = totalChange >= 0;

    // Simple SVG chart
    const maxValue = Math.max(...performanceData.map(d => d.value));
    const minValue = Math.min(...performanceData.map(d => d.value));
    const range = maxValue - minValue;
    const padding = 40;
    const chartWidth = 400;
    const chartHeight = height - 100;

    const points = performanceData.map((point, index) => {
        const x = (index / (performanceData.length - 1)) * (chartWidth - 2 * padding) + padding;
        const y = chartHeight - ((point.value - minValue) / range) * (chartHeight - 2 * padding) - padding;
        return `${x},${y}`;
    }).join(' ');

    return (
        <Card className="group hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-blue-500/10 ring-1 ring-primary/20">
                            <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Performance Chart</h2>
                            <p className="text-muted-foreground text-xs mt-0.5">Portfolio value over time</p>
                        </div>
                    </CardTitle>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">
                            ${latestValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className={`text-sm font-semibold flex items-center gap-1 ${
                            isPositive ? 'text-success' : 'text-destructive'
                        }`}>
                            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            {isPositive ? '+' : ''}{totalChangePercent.toFixed(2)}%
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <svg width="100%" height={height} viewBox={`0 0 ${chartWidth} ${height}`} className="overflow-visible">
                        {/* Grid lines */}
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
                            </pattern>
                            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity="0.3"/>
                                <stop offset="100%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity="0.05"/>
                            </linearGradient>
                        </defs>
                        
                        {/* Grid */}
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        
                        {/* Area under curve */}
                        <polygon
                            points={`${padding},${height - padding} ${points} ${chartWidth - padding},${height - padding}`}
                            fill="url(#chartGradient)"
                        />
                        
                        {/* Line */}
                        <polyline
                            points={points}
                            fill="none"
                            stroke={isPositive ? "#10B981" : "#EF4444"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        
                        {/* Data points */}
                        {performanceData.map((point, index) => {
                            const x = (index / (performanceData.length - 1)) * (chartWidth - 2 * padding) + padding;
                            const y = height - ((point.value - minValue) / range) * (chartHeight - 2 * padding) - padding;
                            return (
                                <circle
                                    key={index}
                                    cx={x}
                                    cy={y}
                                    r="3"
                                    fill={isPositive ? "#10B981" : "#EF4444"}
                                    className="hover:r-4 transition-all duration-200"
                                />
                            );
                        })}
                    </svg>
                    
                    {/* Time labels */}
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>30 days ago</span>
                        <span>15 days ago</span>
                        <span>Today</span>
                    </div>
                </div>
                
                {/* Performance summary */}
                <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted/20">
                        <div className="text-sm text-muted-foreground">Total Return</div>
                        <div className={`font-bold ${isPositive ? 'text-success' : 'text-destructive'}`}>
                            {isPositive ? '+' : ''}${totalChange.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/20">
                        <div className="text-sm text-muted-foreground">Best Day</div>
                        <div className="font-bold text-success">
                            +{Math.max(...performanceData.map(d => d.change)).toFixed(2)}%
                        </div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/20">
                        <div className="text-sm text-muted-foreground">Worst Day</div>
                        <div className="font-bold text-destructive">
                            {Math.min(...performanceData.map(d => d.change)).toFixed(2)}%
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default memo(PerformanceChart);
