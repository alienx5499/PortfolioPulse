'use client';

import React, { memo, useState, useEffect } from 'react';
import useTradingViewWidget from "@/hooks/useTradingViewWidget";
import {cn} from "@/lib/utils";
import Loader from "@/components/ui/loader-11";

interface TradingViewWidgetProps {
    title?: string;
    scriptUrl: string;
    config: Record<string, unknown>;
    height?: number;
    className?: string;
}

const TradingViewWidget = ({ title, scriptUrl, config, height = 600, className }: TradingViewWidgetProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useTradingViewWidget(scriptUrl, config, height);

    useEffect(() => {
        // Set loading to false after a brief delay to show content
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full relative">
            {isLoading && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded z-10 flex items-center justify-center" style={{ height }}>
                    <div className="text-center">
                        <Loader />
                        <p className="text-muted-foreground text-sm mt-4">Loading trading chart...</p>
                    </div>
                </div>
            )}
            {title && <h3 className="font-semibold text-2xl text-foreground mb-5">{title}</h3>}
            <div className={cn('tradingview-widget-container', className)} ref={containerRef}>
                <div className="tradingview-widget-container__widget" style={{ height, width: "100%" }} />
            </div>
        </div>
    );
}

export default memo(TradingViewWidget);
