import { TrendingUp, PieChart, Activity, DollarSign, TrendingDown, AlertCircle, Plus } from "lucide-react";
import WatchlistButton from "@/components/WatchlistButton";
import PerformanceChart from "@/components/PerformanceChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PORTFOLIO_TABLE_HEADER } from "@/lib/constants";
import { getUserPortfolioStocks, calculatePortfolioHealth } from "@/lib/actions/portfolio.actions";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

const PortfolioPage = async () => {
    // Get user session
    const session = await auth.api.getSession({ headers: await headers() });
    const userEmail = session?.user?.email || '';

    // Fetch REAL portfolio data
    let portfolioStocks: any[] = [];
    let portfolioHealth: any = null;

    if (userEmail) {
        try {
            [portfolioStocks, portfolioHealth] = await Promise.all([
                getUserPortfolioStocks(userEmail),
                calculatePortfolioHealth(userEmail),
            ]);
        } catch (error) {
            console.error('Error fetching portfolio data:', error);
        }
    }

    // Use real portfolio data only
    const portfolioData = portfolioStocks.map(stock => ({
        company: stock.company,
        symbol: stock.symbol,
        price: `$${stock.currentPrice?.toFixed(2) || '0.00'}`,
        change: stock.changePercent >= 0 ? `+${stock.changePercent?.toFixed(2) || '0.00'}%` : `${stock.changePercent?.toFixed(2) || '0.00'}%`,
        marketCap: 'N/A', // Would need additional API call
        peRatio: 'N/A', // Would need additional API call
        alertStatus: 'ACTIVE',
        isInWatchlist: true
    }));

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
                {/* Hero Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-success/10 ring-1 ring-primary/20">
                            <TrendingUp className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                            Portfolio Tracker
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-base md:text-lg">
                        Monitor your investment portfolio with real-time data and analytics
                    </p>
                    
                    {/* How to Add Stocks Section */}
                    {portfolioStocks.length === 0 && (
                        <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-primary/5 to-blue-500/5 border border-primary/20">
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Plus className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-foreground mb-2">Start Building Your Portfolio</h3>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        Add stocks to your watchlist to track them in your portfolio. Use the search function to find and add stocks.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                                            <span>Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Cmd/Ctrl + K</kbd> to search stocks</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                                            <span>Click the search icon in the navigation</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Portfolio Grid */}
                <div className="space-y-6">
                    {/* Top Row - Portfolio Summary & Performance */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Portfolio Summary */}
                        <div className="card group hover:shadow-lg transition-shadow duration-300">
                            <div className="card-header bg-gradient-to-r from-success/5 to-primary/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-success/10 to-primary/10 ring-1 ring-success/20">
                                        <DollarSign className="h-5 w-5 text-success" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground">Portfolio Summary</h2>
                                        <p className="text-muted-foreground text-xs mt-0.5">Current holdings overview</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-content">
                                <div className="space-y-4">
                                    {portfolioStocks.length > 0 ? (
                                        <>
                                            <div className="p-4 rounded-lg bg-gradient-to-br from-success/5 to-transparent border border-success/20">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-muted-foreground">Total Value</span>
                                                    <TrendingUp className="h-4 w-4 text-success" />
                                                </div>
                                                <p className="text-2xl font-bold text-success">
                                                    ${portfolioStocks.reduce((sum, stock) => sum + (stock.currentPrice || 0), 0).toFixed(2)}
                                                </p>
                                            </div>
                                            
                                            <div className="p-4 rounded-lg bg-gradient-to-br from-success/5 to-transparent border border-success/20">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-muted-foreground">24h Change</span>
                                                    <TrendingUp className="h-4 w-4 text-success" />
                                                </div>
                                                <p className="text-xl font-bold text-success">
                                                    ${portfolioStocks.reduce((sum, stock) => sum + (stock.change || 0), 0).toFixed(2)}
                                                </p>
                                            </div>
                                            
                                            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border border-primary/20">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-muted-foreground">Total Return</span>
                                                    <TrendingUp className="h-4 w-4 text-primary" />
                                                </div>
                                                <p className="text-xl font-bold text-primary">
                                                    {portfolioStocks.length > 0 ? 
                                                        `${portfolioStocks.reduce((sum, stock) => sum + (stock.changePercent || 0), 0).toFixed(2)}%` 
                                                        : '0.00%'
                                                    }
                                                </p>
                                            </div>
                                            
                                            <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/20">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-muted-foreground">Risk Level</span>
                                                    <AlertCircle className="h-4 w-4 text-amber-500" />
                                                </div>
                                                <p className="text-lg font-bold text-amber-500">
                                                    {portfolioHealth?.overallScore > 70 ? 'Low' : portfolioHealth?.overallScore > 50 ? 'Moderate' : 'High'}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="p-8 text-center">
                                            <div className="mb-4">
                                                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                                <h3 className="text-lg font-semibold text-foreground mb-2">No stocks in your portfolio</h3>
                                                <p className="text-muted-foreground text-sm">
                                                    Add stocks to your watchlist to see them here
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Performance Chart */}
                        <div className="lg:col-span-2">
                            <PerformanceChart height={350} />
                        </div>
                    </div>

                    {/* Portfolio Holdings Table */}
                    <div className="card group hover:shadow-lg transition-shadow duration-300">
                        <div className="card-header bg-gradient-to-r from-primary/5 to-purple-500/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-purple-500/10 ring-1 ring-primary/20">
                                    <Activity className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-foreground">Portfolio Holdings</h2>
                                    <p className="text-muted-foreground text-xs mt-0.5">Your current stock positions</p>
                                </div>
                            </div>
                        </div>
                        <CardContent className="p-0">
                            {portfolioData.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                {PORTFOLIO_TABLE_HEADER.map((header, index) => (
                                                    <TableHead key={index} className="text-left">
                                                        {header}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {portfolioData.map((stock, index) => (
                                                <TableRow key={index} className="hover:bg-muted/20">
                                                    <TableCell className="font-semibold">{stock.company}</TableCell>
                                                    <TableCell className="text-muted-foreground font-medium">{stock.symbol}</TableCell>
                                                    <TableCell className="font-bold">{stock.price}</TableCell>
                                                    <TableCell className={`font-bold ${stock.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                                                        {stock.change}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">{stock.marketCap}</TableCell>
                                                    <TableCell className="text-muted-foreground">{stock.peRatio}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={stock.alertStatus === 'ACTIVE' ? 'default' : 'secondary'}>
                                                            {stock.alertStatus}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <WatchlistButton
                                                            symbol={stock.symbol}
                                                            company={stock.company}
                                                            isInWatchlist={stock.isInWatchlist}
                                                            showTrashIcon={stock.isInWatchlist}
                                                            userEmail={userEmail}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <div className="mb-4">
                                        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                        <h3 className="text-lg font-semibold text-foreground mb-2">No stocks in your portfolio</h3>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            Add stocks to your watchlist to see them here
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Use the search function (Cmd/Ctrl + K) to find and add stocks
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </div>

                    {/* Bottom Row - Asset Allocation & Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Asset Allocation */}
                        <div className="card group hover:shadow-lg transition-shadow duration-300">
                            <div className="card-header bg-gradient-to-r from-purple-500/5 to-pink-500/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 ring-1 ring-purple-500/20">
                                        <PieChart className="h-5 w-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground">Asset Allocation</h2>
                                        <p className="text-muted-foreground text-xs mt-0.5">Portfolio diversification</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-content">
                                {portfolioStocks.length > 0 ? (
                                    <div className="space-y-4">
                                        {portfolioStocks.slice(0, 4).map((stock, index) => {
                                            const percentage = portfolioStocks.length > 0 ? (100 / portfolioStocks.length) : 0;
                                            const colors = [
                                                'from-primary to-blue-500',
                                                'from-success to-green-500', 
                                                'from-purple-500 to-pink-500',
                                                'from-amber-500 to-orange-500'
                                            ];
                                            return (
                                                <div key={index} className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium text-foreground">{stock.symbol}</span>
                                                        <span className="text-sm font-bold text-foreground">{percentage.toFixed(1)}%</span>
                                    </div>
                                                    <div className="w-full bg-muted/50 rounded-full h-2.5 overflow-hidden">
                                                        <div 
                                                            className={`h-full bg-gradient-to-r ${colors[index % colors.length]} transition-all duration-500`}
                                                            style={{width: `${percentage}%`}}
                                                        />
                                    </div>
                                                    <div className="text-xs text-muted-foreground">${stock.currentPrice?.toFixed(2) || '0.00'}</div>
                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-6 text-center">
                                        <PieChart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-muted-foreground text-sm">No assets to display</p>
                                        <p className="text-xs text-muted-foreground mt-1">Add stocks to see allocation</p>
                                    </div>
                                )}
                                    </div>
                                </div>

                        {/* Recent Activity */}
                        <div className="lg:col-span-2 card group hover:shadow-lg transition-shadow duration-300">
                            <div className="card-header bg-gradient-to-r from-success/5 to-primary/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-success/10 to-primary/10 ring-1 ring-success/20">
                                        <Activity className="h-5 w-5 text-success" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
                                        <p className="text-muted-foreground text-xs mt-0.5">Latest transactions</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-content">
                                {portfolioStocks.length > 0 ? (
                                    <div className="space-y-3">
                                        {portfolioStocks.slice(0, 5).map((stock, index) => {
                                            const colors = [
                                                'border-success/30 bg-success/5',
                                                'border-primary/30 bg-primary/5',
                                                'border-purple-500/30 bg-purple-500/5',
                                                'border-amber-500/30 bg-amber-500/5',
                                                'border-pink-500/30 bg-pink-500/5'
                                            ];
                                            return (
                                                <div key={index} className={`p-4 rounded-lg border ${colors[index % colors.length]} hover:shadow-md transition-all duration-300`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                                            <p className="font-bold text-foreground">Added {stock.symbol}</p>
                                                            <p className="text-sm text-muted-foreground">Added to portfolio • Recently</p>
                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-success font-bold">${stock.currentPrice?.toFixed(2) || '0.00'}</span>
                                                            <p className={`text-xs font-semibold ${(stock.changePercent || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
                                                                {(stock.changePercent || 0) >= 0 ? '+' : ''}{stock.changePercent?.toFixed(2) || '0.00'}%
                                                            </p>
                                    </div>
                                </div>
                                        </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-6 text-center">
                                        <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-muted-foreground text-sm">No recent activity</p>
                                        <p className="text-xs text-muted-foreground mt-1">Add stocks to see activity here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioPage;
