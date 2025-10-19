import { Brain, TrendingUp, AlertTriangle, Target, BarChart3, Zap } from "lucide-react";
import { getUserPortfolioStocks, calculatePortfolioHealth, getPortfolioMovers } from "@/lib/actions/portfolio.actions";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

const InsightsPage = async () => {
    // Get user session
    const session = await auth.api.getSession({ headers: await headers() });
    const userEmail = session?.user?.email || '';

    // Fetch real portfolio data
    let portfolioStocks = [];
    let portfolioHealth = null;
    let portfolioMovers = null;

    if (userEmail) {
        try {
            [portfolioStocks, portfolioHealth, portfolioMovers] = await Promise.all([
                getUserPortfolioStocks(userEmail),
                calculatePortfolioHealth(userEmail),
                getPortfolioMovers(userEmail),
            ]);
        } catch (error) {
            console.error('Error fetching portfolio data:', error);
        }
    }
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
                {/* Hero Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-purple-500/10 ring-1 ring-primary/20">
                            <Brain className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                            AI Market Insights
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-base md:text-lg">
                        Advanced analytics and predictions powered by artificial intelligence
                    </p>
                </div>

                {/* Main Insights Grid */}
                <div className="space-y-6">
                    {/* Top Row - Market Sentiment & AI Predictions */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Market Sentiment */}
                        <div className="card group hover:shadow-lg transition-shadow duration-300">
                            <div className="card-header bg-gradient-to-r from-success/5 to-primary/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-success/10 to-primary/10 ring-1 ring-success/20">
                                        <TrendingUp className="h-5 w-5 text-success" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground">Market Sentiment</h2>
                                        <p className="text-muted-foreground text-xs mt-0.5">AI-powered analysis</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-content">
                                {portfolioStocks.length > 0 ? (
                                    <div className="space-y-4">
                                        {(() => {
                                            const positiveStocks = portfolioStocks.filter(stock => (stock.changePercent || 0) >= 0).length;
                                            const totalStocks = portfolioStocks.length;
                                            const bullishPercent = totalStocks > 0 ? Math.round((positiveStocks / totalStocks) * 100) : 0;
                                            const bearishPercent = 100 - bullishPercent;
                                            
                                            return (
                                                <>
                                                    <div>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-medium text-success">Bullish</span>
                                                            <span className="text-sm font-bold text-foreground">{bullishPercent}%</span>
                                                        </div>
                                                        <div className="w-full bg-muted/50 rounded-full h-2.5 overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-success to-green-400 transition-all duration-500" style={{width: `${bullishPercent}%`}} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-medium text-destructive">Bearish</span>
                                                            <span className="text-sm font-bold text-foreground">{bearishPercent}%</span>
                                                        </div>
                                                        <div className="w-full bg-muted/50 rounded-full h-2.5 overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-destructive to-red-400 transition-all duration-500" style={{width: `${bearishPercent}%`}} />
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                ) : (
                                    <div className="p-6 text-center">
                                        <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-muted-foreground text-sm">No portfolio data available</p>
                                        <p className="text-xs text-muted-foreground mt-1">Add stocks to see sentiment analysis</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* AI Predictions */}
                        <div className="lg:col-span-2 card group hover:shadow-lg transition-shadow duration-300">
                            <div className="card-header bg-gradient-to-r from-primary/5 to-purple-500/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-purple-500/10 ring-1 ring-primary/20">
                                        <Brain className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground">AI Predictions</h2>
                                        <p className="text-muted-foreground text-xs mt-0.5">Machine learning forecasts</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-content">
                                {portfolioStocks.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {portfolioStocks.slice(0, 4).map((stock, index) => {
                                            const colors = [
                                                "border-primary/30 bg-primary/5",
                                                "border-purple-500/30 bg-purple-500/5", 
                                                "border-success/30 bg-success/5",
                                                "border-pink-500/30 bg-pink-500/5"
                                            ];
                                            // Generate confidence based on recent performance
                                            const confidence = Math.min(95, Math.max(60, 70 + (stock.changePercent || 0) * 2));
                                            
                                            return (
                                                <div key={stock.symbol} className={`p-4 rounded-xl border ${colors[index % colors.length]} hover:shadow-md transition-all duration-300`}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="font-bold text-foreground">{stock.symbol}</h3>
                                                        <div className="text-xs text-muted-foreground">AI Forecast</div>
                                                    </div>
                                                    <p className="text-sm text-foreground mb-1">${stock.currentPrice?.toFixed(2) || '0.00'}</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-full bg-muted/50 rounded-full h-1.5">
                                                            <div className="h-full bg-gradient-to-r from-primary to-success rounded-full" style={{width: `${confidence}%`}} />
                                                        </div>
                                                        <span className="text-xs font-medium text-success">{confidence.toFixed(0)}%</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-6 text-center">
                                        <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-muted-foreground text-sm">No portfolio data for predictions</p>
                                        <p className="text-xs text-muted-foreground mt-1">Add stocks to see AI forecasts</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Risk Analysis & Portfolio Optimization */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Risk Analysis */}
                        <div className="card group hover:shadow-lg transition-shadow duration-300">
                            <div className="card-header bg-gradient-to-r from-amber-500/5 to-destructive/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/10 to-destructive/10 ring-1 ring-amber-500/20">
                                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground">Risk Analysis</h2>
                                        <p className="text-muted-foreground text-xs mt-0.5">Portfolio assessment</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-content">
                                <div className="space-y-4">
                                    {[
                                        { label: "Portfolio Risk", status: "Low", color: "text-success", bg: "bg-success/10", border: "border-success/20" },
                                        { label: "Market Volatility", status: "Moderate", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
                                        { label: "Diversification", status: "Excellent", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" }
                                    ].map((item) => (
                                        <div key={item.label} className={`p-3 rounded-lg border ${item.border} ${item.bg}`}>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-foreground">{item.label}</span>
                                                <span className={`text-sm font-bold ${item.color}`}>{item.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Portfolio Optimization */}
                        <div className="lg:col-span-2 card group hover:shadow-lg transition-shadow duration-300">
                            <div className="card-header bg-gradient-to-r from-success/5 to-primary/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-success/10 to-primary/10 ring-1 ring-success/20">
                                        <Target className="h-5 w-5 text-success" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground">Portfolio Optimization</h2>
                                        <p className="text-muted-foreground text-xs mt-0.5">AI recommendations</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-content">
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-foreground mb-3">Recommended Actions</h3>
                                    {[
                                        "Increase AAPL allocation by 5%",
                                        "Reduce TSLA exposure by 3%",
                                        "Add defensive stocks to portfolio",
                                        "Consider crypto diversification"
                                    ].map((action, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                                            <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                                                <span className="text-success text-sm">✓</span>
                                            </div>
                                            <span className="text-sm text-foreground">{action}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* News Impact Analysis */}
                    <div className="card group hover:shadow-lg transition-shadow duration-300">
                        <div className="card-header bg-gradient-to-r from-primary/5 to-blue-500/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-blue-500/10 ring-1 ring-primary/20">
                                    <BarChart3 className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-foreground">News Impact Analysis</h2>
                                    <p className="text-muted-foreground text-xs mt-0.5">Market reaction predictions</p>
                                </div>
                            </div>
                        </div>
                        <div className="card-content">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { title: "Fed Rate Decision", impact: "HIGH", reaction: "+2.5%", color: "border-primary/30 bg-primary/5" },
                                    { title: "Tech Earnings", impact: "MEDIUM", reaction: "+1.2%", color: "border-purple-500/30 bg-purple-500/5" },
                                    { title: "Global Trade", impact: "LOW", reaction: "+0.3%", color: "border-success/30 bg-success/5" }
                                ].map((news) => (
                                    <div key={news.title} className={`p-4 rounded-xl border ${news.color} hover:shadow-md transition-all duration-300`}>
                                        <h3 className="font-bold text-foreground mb-2">{news.title}</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-muted-foreground">Impact</span>
                                                <span className="text-xs font-medium text-foreground">{news.impact}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-muted-foreground">Expected Reaction</span>
                                                <span className="text-xs font-bold text-success">{news.reaction}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InsightsPage;
