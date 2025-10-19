'use client';

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Coins, TrendingUp, BarChart3, Newspaper } from "lucide-react";
import Loader from "@/components/ui/loader-11";

// Lazy load TradingView widgets
const TradingViewWidget = dynamic(() => import("@/components/TradingViewWidget"), {
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded">
            <div className="flex flex-col items-center gap-4">
                <Loader />
                <p className="text-muted-foreground text-sm">Loading crypto data...</p>
            </div>
        </div>
    ),
    ssr: false
});

const CryptoPage = () => {
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
                {/* Hero Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 ring-1 ring-yellow-500/20">
                            <Coins className="h-6 w-6 text-yellow-500" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                            Crypto Analytics
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-base md:text-lg">
                        Real-time cryptocurrency data, market analysis, and trading insights
                    </p>
                </div>

                {/* Main Crypto Grid */}
                <div className="space-y-6">
                    {/* Top Row - Market Overview & Heatmap */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Market Overview */}
                        <div className="lg:col-span-2 card group hover:shadow-lg transition-shadow duration-300">
                            <div className="card-header bg-gradient-to-r from-yellow-500/5 to-orange-500/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 ring-1 ring-yellow-500/20">
                                        <TrendingUp className="h-5 w-5 text-yellow-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground">Crypto Market Overview</h2>
                                        <p className="text-muted-foreground text-xs mt-0.5">Major cryptocurrencies & DeFi tokens</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-content p-0">
                                <Suspense fallback={
                                    <div className="h-[500px] flex items-center justify-center bg-muted/50 rounded">
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader />
                                            <p className="text-muted-foreground text-sm">Loading chart...</p>
                                        </div>
                                    </div>
                                }>
                                    <TradingViewWidget
                                        scriptUrl={`${scriptUrl}market-overview.js`}
                                        config={{
                                            colorTheme: 'dark',
                                            dateRange: '12M',
                                            locale: 'en',
                                            isTransparent: true,
                                            showFloatingTooltip: true,
                                            plotLineColorGrowing: '#10B981',
                                            plotLineColorFalling: '#EF4444',
                                            gridLineColor: 'rgba(59, 130, 246, 0.1)',
                                            scaleFontColor: '#3B82F6',
                                            belowLineFillColorGrowing: 'rgba(16, 185, 129, 0.12)',
                                            belowLineFillColorFalling: 'rgba(239, 68, 68, 0.12)',
                                            symbolActiveColor: 'rgba(59, 130, 246, 0.05)',
                                            tabs: [
                                                {
                                                    title: 'Major Cryptos',
                                                    symbols: [
                                                        { s: 'BINANCE:BTCUSDT', d: 'Bitcoin' },
                                                        { s: 'BINANCE:ETHUSDT', d: 'Ethereum' },
                                                        { s: 'BINANCE:ADAUSDT', d: 'Cardano' },
                                                        { s: 'BINANCE:SOLUSDT', d: 'Solana' },
                                                        { s: 'BINANCE:DOTUSDT', d: 'Polkadot' },
                                                    ],
                                                },
                                                {
                                                    title: 'DeFi Tokens',
                                                    symbols: [
                                                        { s: 'BINANCE:UNIUSDT', d: 'Uniswap' },
                                                        { s: 'BINANCE:LINKUSDT', d: 'Chainlink' },
                                                        { s: 'BINANCE:AVAXUSDT', d: 'Avalanche' },
                                                        { s: 'BINANCE:MATICUSDT', d: 'Polygon' },
                                                        { s: 'BINANCE:ATOMUSDT', d: 'Cosmos' },
                                                    ],
                                                },
                                            ],
                                            support_host: 'https://www.tradingview.com',
                                            backgroundColor: '#0F172A',
                                            width: '100%',
                                            height: 500,
                                            showSymbolLogo: true,
                                            showChart: true,
                                        }}
                                        height={500}
                                    />
                                </Suspense>
                            </div>
                        </div>

                        {/* Crypto Heatmap */}
                        <div className="lg:col-span-1 card group hover:shadow-lg transition-shadow duration-300">
                            <div className="card-header bg-gradient-to-r from-purple-500/5 to-pink-500/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 ring-1 ring-purple-500/20">
                                        <BarChart3 className="h-5 w-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground">Crypto Heatmap</h2>
                                        <p className="text-muted-foreground text-xs mt-0.5">Market cap visualization</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-content p-0">
                                <Suspense fallback={
                                    <div className="h-[500px] flex items-center justify-center bg-muted/50 rounded">
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader />
                                            <p className="text-muted-foreground text-sm">Loading chart...</p>
                                        </div>
                                    </div>
                                }>
                                    <TradingViewWidget
                                        scriptUrl={`${scriptUrl}stock-heatmap.js`}
                                        config={{
                                            dataSource: 'CRYPTO',
                                            blockSize: 'market_cap_basic',
                                            blockColor: 'change',
                                            grouping: 'sector',
                                            isTransparent: true,
                                            locale: 'en',
                                            symbolUrl: '',
                                            colorTheme: 'dark',
                                            exchanges: [],
                                            hasTopBar: false,
                                            isDataSetEnabled: false,
                                            isZoomEnabled: true,
                                            hasSymbolTooltip: true,
                                            isMonoSize: false,
                                            width: '100%',
                                            height: '500',
                                        }}
                                        height={500}
                                    />
                                </Suspense>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row - News & Live Data */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Crypto News */}
                        <div className="lg:col-span-1 card group hover:shadow-lg transition-shadow duration-300">
                            <div className="card-header bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 ring-1 ring-blue-500/20">
                                        <Newspaper className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground">Crypto News</h2>
                                        <p className="text-muted-foreground text-xs mt-0.5">Latest updates</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-content p-0">
                                <Suspense fallback={
                                    <div className="h-[500px] flex items-center justify-center bg-muted/50 rounded">
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader />
                                            <p className="text-muted-foreground text-sm">Loading chart...</p>
                                        </div>
                                    </div>
                                }>
                                    <TradingViewWidget
                                        scriptUrl={`${scriptUrl}timeline.js`}
                                        config={{
                                            displayMode: 'regular',
                                            feedMode: 'market',
                                            colorTheme: 'dark',
                                            isTransparent: true,
                                            locale: 'en',
                                            market: 'crypto',
                                            width: '100%',
                                            height: '500',
                                        }}
                                        height={500}
                                    />
                                </Suspense>
                            </div>
                        </div>

                        {/* Live Crypto Data */}
                        <div className="lg:col-span-2 card group hover:shadow-lg transition-shadow duration-300">
                            <div className="card-header bg-gradient-to-r from-green-500/5 to-emerald-500/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 ring-1 ring-green-500/20">
                                        <Coins className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground">Live Crypto Data</h2>
                                        <p className="text-muted-foreground text-xs mt-0.5">Real-time prices & changes</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-content p-0">
                                <Suspense fallback={
                                    <div className="h-[500px] flex items-center justify-center bg-muted/50 rounded">
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader />
                                            <p className="text-muted-foreground text-sm">Loading chart...</p>
                                        </div>
                                    </div>
                                }>
                                    <TradingViewWidget
                                        scriptUrl={`${scriptUrl}market-quotes.js`}
                                        config={{
                                            title: 'Cryptocurrencies',
                                            width: '100%',
                                            height: 500,
                                            locale: 'en',
                                            showSymbolLogo: true,
                                            colorTheme: 'dark',
                                            isTransparent: false,
                                            backgroundColor: '#0F172A',
                                            symbolsGroups: [
                                                {
                                                    name: 'Major Cryptos',
                                                    symbols: [
                                                        { name: 'BINANCE:BTCUSDT', displayName: 'Bitcoin' },
                                                        { name: 'BINANCE:ETHUSDT', displayName: 'Ethereum' },
                                                        { name: 'BINANCE:ADAUSDT', displayName: 'Cardano' },
                                                        { name: 'BINANCE:SOLUSDT', displayName: 'Solana' },
                                                        { name: 'BINANCE:DOTUSDT', displayName: 'Polkadot' },
                                                    ],
                                                },
                                                {
                                                    name: 'DeFi Tokens',
                                                    symbols: [
                                                        { name: 'BINANCE:UNIUSDT', displayName: 'Uniswap' },
                                                        { name: 'BINANCE:LINKUSDT', displayName: 'Chainlink' },
                                                        { name: 'BINANCE:AVAXUSDT', displayName: 'Avalanche' },
                                                        { name: 'BINANCE:MATICUSDT', displayName: 'Polygon' },
                                                        { name: 'BINANCE:ATOMUSDT', displayName: 'Cosmos' },
                                                    ],
                                                },
                                            ],
                                        }}
                                        height={500}
                                    />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CryptoPage;
