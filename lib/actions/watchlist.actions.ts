'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    if (!mongoose) {
      console.warn('Database not connected, returning empty array');
      return [];
    }
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Better Auth stores users in the "user" collection
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

export async function addToWatchlist(email: string, symbol: string, company: string) {
  if (!email || !symbol || !company) {
    return { success: false, error: 'Missing required fields' };
  }

  try {
    const mongoose = await connectToDatabase();
    if (!mongoose) {
      return { success: false, error: 'Database not connected' };
    }

    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Get user ID from email
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) {
      return { success: false, error: 'Invalid user ID' };
    }

    // Check if already in watchlist
    const existing = await Watchlist.findOne({ userId, symbol: symbol.toUpperCase() });
    if (existing) {
      return { success: false, error: 'Stock already in watchlist' };
    }

    // Add to watchlist
    await Watchlist.create({
      userId,
      symbol: symbol.toUpperCase(),
      company: company.trim(),
      addedAt: new Date()
    });

    return { success: true };
  } catch (err) {
    console.error('addToWatchlist error:', err);
    return { success: false, error: 'Failed to add to watchlist' };
  }
}

export async function removeFromWatchlist(email: string, symbol: string) {
  if (!email || !symbol) {
    return { success: false, error: 'Missing required fields' };
  }

  try {
    const mongoose = await connectToDatabase();
    if (!mongoose) {
      return { success: false, error: 'Database not connected' };
    }

    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Get user ID from email
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) {
      return { success: false, error: 'Invalid user ID' };
    }

    // Remove from watchlist
    const result = await Watchlist.deleteOne({ userId, symbol: symbol.toUpperCase() });
    
    if (result.deletedCount === 0) {
      return { success: false, error: 'Stock not found in watchlist' };
    }

    return { success: true };
  } catch (err) {
    console.error('removeFromWatchlist error:', err);
    return { success: false, error: 'Failed to remove from watchlist' };
  }
}

export async function getWatchlistItems(email: string) {
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

    // Get all watchlist items
    const items = await Watchlist.find({ userId }).sort({ addedAt: -1 }).lean();
    return items;
  } catch (err) {
    console.error('getWatchlistItems error:', err);
    return [];
  }
}