import { Inngest} from "inngest";

export const inngest = new Inngest({
    id: 'portfolio-pulse',
    ai: { gemini: { apiKey: process.env.GEMINI_API_KEY! }},
    // Development mode configuration
    ...(process.env.NODE_ENV === 'development' && {
        syncUrl: process.env.INNGEST_SYNC_URL || 'http://localhost:8288'
    })
})
