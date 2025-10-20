import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
}

let cached = global.mongooseCache;

if(!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async (): Promise<typeof mongoose | null> => {
    if(!MONGODB_URI) {
        throw new Error('MONGODB_URI must be set in environment variables');
    }

    if(cached.conn) return cached.conn;

    if(!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, { 
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log(`Connected to database ${process.env.NODE_ENV}`);
    } catch (err) {
        cached.promise = null;
        throw new Error(`Database connection failed: ${err}`);
    }

    return cached.conn;
}
