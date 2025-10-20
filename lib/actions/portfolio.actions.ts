'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
import { getQuote } from './finnhub.actions';

/**
 * Get user's portfolio stocks from watchlist
 */
export async function getUserPortfolioStocks(email: string) {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    if (!mongoose) {
      console.warn('Database not connected');
      return [];
    }
    
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Get user ID from email
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });
    if (!user) return [];

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];

    // Get watchlist stocks
    const items = await Watchlist.find({ userId }).lean();
    
    // Fetch current prices for each stock
    const stocksWithPrices = await Promise.all(
      items.map(async (item) => {
        try {
          const quote = await getQuote(item.symbol);
          return {
            symbol: item.symbol,
            company: item.company,
            currentPrice: quote?.c || 0,
            change: quote?.d || 0,
            changePercent: quote?.dp || 0,
            addedAt: item.addedAt,
          };
        } catch (error) {
          console.error(`Error fetching quote for ${item.symbol}:`, error);
          return null;
        }
      })
    );

    return stocksWithPrices.filter(Boolean);
  } catch (err) {
    console.error('getUserPortfolioStocks error:', err);
    return [];
  }
}

/**
 * Calculate portfolio health metrics
 */
export async function calculatePortfolioHealth(email: string) {
  const stocks = await getUserPortfolioStocks(email);
  
  if (stocks.length === 0) {
    return {
      overallScore: 0,
      metrics: [
        { label: "Portfolio Size", value: "Empty", status: 'warning' as const, description: "Add stocks to your watchlist" },
        { label: "Diversification", value: "N/A", status: 'warning' as const, description: "Build your portfolio first" },
        { label: "P/L Ratio", value: "N/A", status: 'warning' as const, description: "No data available" },
        { label: "Performance", value: "N/A", status: 'warning' as const, description: "Start tracking stocks" },
      ],
    };
  }

  // Calculate metrics
  const positiveStocks = stocks.filter(s => s && s.changePercent > 0).length;
  const negativeStocks = stocks.filter(s => s && s.changePercent < 0).length;
  const totalStocks = stocks.length;
  
  const avgChange = stocks.reduce((sum, s) => sum + (s?.changePercent || 0), 0) / totalStocks;
  
  // Diversification score (basic: more stocks = better diversification)
  const diversificationScore = Math.min(totalStocks * 10, 100);
  
  // P/L Ratio
  const plRatio = positiveStocks / Math.max(totalStocks, 1);
  
  // Overall portfolio score
  const overallScore = Math.round(
    (diversificationScore * 0.3) + 
    (plRatio * 100 * 0.4) + 
    (Math.min(Math.abs(avgChange) * 10, 30))
  );

  return {
    overallScore: Math.min(overallScore, 100),
    metrics: [
      {
        label: "Portfolio Size",
        value: `${totalStocks} stocks`,
        status: totalStocks >= 5 ? 'good' as const : 'warning' as const,
        description: totalStocks >= 5 ? "Well diversified" : "Consider adding more stocks",
      },
      {
        label: "Diversification",
        value: diversificationScore >= 50 ? "Good" : "Moderate",
        status: diversificationScore >= 50 ? 'good' as const : 'warning' as const,
        description: `Tracking ${totalStocks} different stocks`,
      },
      {
        label: "P/L Ratio",
        value: avgChange >= 0 ? "Positive" : "Negative",
        status: avgChange >= 0 ? 'good' as const : 'danger' as const,
        description: `${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(2)}% average`,
      },
      {
        label: "Performance",
        value: `${positiveStocks}/${totalStocks} up`,
        status: plRatio >= 0.5 ? 'good' as const : 'danger' as const,
        description: `${positiveStocks} gaining, ${negativeStocks} losing`,
      },
    ],
  };
}

/**
 * Get today's top movers from user's watchlist
 */
export async function getPortfolioMovers(email: string) {
  const stocks = await getUserPortfolioStocks(email);
  
  if (stocks.length === 0) {
    return { gainers: [], losers: [] };
  }

  // Sort by change percentage
  const validStocks = stocks.filter(s => s !== null);
  const sorted = [...validStocks].sort((a, b) => (b?.changePercent || 0) - (a?.changePercent || 0));
  
  const gainers = sorted
    .filter(s => s && s.changePercent > 0)
    .slice(0, 3)
    .map(s => ({
      symbol: s!.symbol,
      name: s!.company,
      price: s!.currentPrice,
      change: s!.change,
      changePercent: s!.changePercent,
    }));
    
  const losers = sorted
    .filter(s => s && s.changePercent < 0)
    .reverse()
    .slice(0, 3)
    .map(s => ({
      symbol: s!.symbol,
      name: s!.company,
      price: s!.currentPrice,
      change: s!.change,
      changePercent: s!.changePercent,
    }));

  return { gainers, losers };
}

