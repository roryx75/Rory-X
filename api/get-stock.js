import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // 1. Force the server to drop cache states immediately
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // 2. Read the random dynamic timestamp sent from the client phone
    const { t } = req.query; 

    try {
        // Fetch fresh information straight from your Upstash instance
        const liveStock = await kv.get('roryx_stock');
        
        // 3. Return the fresh dataset
        return res.status(200).json(liveStock || {});
    } catch (error) {
        console.error("Database lookup failed:", error);
        return res.status(500).json({ error: "Failed to read fresh database entry" });
    }
}
