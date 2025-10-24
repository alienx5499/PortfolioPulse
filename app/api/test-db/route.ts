import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/database/mongoose';

export async function GET() {
  try {
    console.log('Testing database connection...');
    const mongoose = await connectToDatabase();
    
    if (!mongoose) {
      return NextResponse.json({
        status: 'Database Connection Failed',
        error: 'Mongoose connection is null',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Test a simple database operation
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    return NextResponse.json({
      status: 'Database Connection Successful',
      database: mongoose.connection.name,
      collections: collections.map(c => c.name),
      readyState: mongoose.connection.readyState,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      status: 'Database Connection Error',
      error: error instanceof Error ? error.message : 'Unknown database error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
