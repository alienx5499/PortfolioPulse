import { Suspense } from "react";
import MarketInsights from "@/components/MarketInsights";
import TodaysMovers from "@/components/TodaysMovers";
import PortfolioHealth from "@/components/PortfolioHealth";
import MarketWidgets from "@/components/MarketWidgets";
import Loader from "@/components/ui/loader-11";
import { calculatePortfolioHealth, getPortfolioMovers } from "@/lib/actions/portfolio.actions";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

const Home = async () => {
    // Get user session
    const session = await auth.api.getSession({ headers: await headers() });
    const userEmail = session?.user?.email || '';

    // Fetch REAL portfolio data
    let portfolioHealth = null;
    let portfolioMovers = null;

    if (userEmail) {
        try {
            [portfolioHealth, portfolioMovers] = await Promise.all([
                calculatePortfolioHealth(userEmail),
                getPortfolioMovers(userEmail),
            ]);
        } catch (error) {
            console.error('Error fetching portfolio data:', error);
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-6 py-8 max-w-7xl">
                {/* Hero Section */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-foreground mb-3">
                        Market Dashboard
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        {session?.user?.name 
                            ? `Welcome back, ${session.user.name}! Here's your portfolio overview.` 
                            : 'Professional analytics and real-time market intelligence'}
                    </p>
                </div>
                
                {/* Main Dashboard Grid */}
                <div className="space-y-8">
                    {/* Top Stats Row - 2 Column Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <MarketInsights />
                        <PortfolioHealth 
                            metrics={portfolioHealth?.metrics}
                            overallScore={portfolioHealth?.overallScore}
                        />
                    </div>
                    
                    {/* Movers Section - Full Width */}
                    <div className="w-full">
                        <TodaysMovers 
                            gainers={portfolioMovers?.gainers}
                            losers={portfolioMovers?.losers}
                        />
                    </div>
                    
                    {/* Market Widgets Section */}
                    <Suspense fallback={
                        <div className="space-y-6">
                            <div className="flex items-center justify-center py-12">
                                <div className="flex flex-col items-center gap-4">
                                    <Loader />
                                    <p className="text-muted-foreground text-sm">Loading market data...</p>
                                </div>
                            </div>
                        </div>
                    }>
                        <MarketWidgets />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default Home;
