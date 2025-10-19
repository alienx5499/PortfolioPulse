'use client';

import dynamic from "next/dynamic";
import {
    HEATMAP_WIDGET_CONFIG,
    MARKET_DATA_WIDGET_CONFIG,
    MARKET_OVERVIEW_WIDGET_CONFIG,
    TOP_STORIES_WIDGET_CONFIG
} from "@/lib/constants";
import Loader from "@/components/ui/loader-11";

// Lazy load TradingView widgets
const TradingViewWidget = dynamic(() => import("@/components/TradingViewWidget"), {
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded">
            <div className="flex flex-col items-center gap-4">
                <Loader />
                <p className="text-muted-foreground text-sm">Loading market widget...</p>
            </div>
        </div>
    ),
    ssr: false
});

export default function MarketWidgets(): JSX.Element {
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    return (
        <div className="space-y-6">
            {/* Market Overview & News Grid - 2/3 + 1/3 Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="card h-full">
                        <div className="card-header bg-gradient-to-r from-primary/5 to-transparent">
                            <h2 className="text-lg font-bold text-foreground">Market Indices</h2>
                            <p className="text-muted-foreground text-xs mt-1">Live performance tracking</p>
                        </div>
                        <div className="card-content p-0">
                            <TradingViewWidget
                                scriptUrl={`${scriptUrl}market-overview.js`}
                                config={MARKET_OVERVIEW_WIDGET_CONFIG}
                                height={400}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="lg:col-span-1">
                    <div className="card h-full">
                        <div className="card-header bg-gradient-to-r from-primary/5 to-transparent">
                            <h2 className="text-lg font-bold text-foreground">Market News</h2>
                            <p className="text-muted-foreground text-xs mt-1">Latest updates</p>
                        </div>
                        <div className="card-content p-0">
                            <TradingViewWidget
                                scriptUrl={`${scriptUrl}timeline.js`}
                                config={TOP_STORIES_WIDGET_CONFIG}
                                height={400}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Heatmap & Market Data Grid - 50/50 Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <div className="card-header bg-gradient-to-r from-primary/5 to-transparent">
                        <h2 className="text-lg font-bold text-foreground">Stock Heatmap</h2>
                        <p className="text-muted-foreground text-xs mt-1">Sector performance visualization</p>
                    </div>
                    <div className="card-content p-0">
                        <TradingViewWidget
                            scriptUrl={`${scriptUrl}stock-heatmap.js`}
                            config={HEATMAP_WIDGET_CONFIG}
                            height={500}
                        />
                    </div>
                </div>

                <div className="card">
                    <div className="card-header bg-gradient-to-r from-primary/5 to-transparent">
                        <h2 className="text-lg font-bold text-foreground">Live Market Data</h2>
                        <p className="text-muted-foreground text-xs mt-1">Real-time quotes</p>
                    </div>
                    <div className="card-content p-0">
                        <TradingViewWidget
                            scriptUrl={`${scriptUrl}market-quotes.js`}
                            config={MARKET_DATA_WIDGET_CONFIG}
                            height={500}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

