import { createClient } from '@vercel/kv';

export default async function handler(req, res) {
    // Connect to your Upstash KV Database using Vercel's environment variables
    const kv = createClient({
        url: process.env.KV_REST_API_URL || process.env.STORAGE_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN || process.env.STORAGE_REST_API_TOKEN,
    });

    // GET Request: Fetch stock counts to show on your dashboard
    if (req.method === 'GET') {
        try {
            // Read items from Redis. If they don't exist yet, default them to 0
            const mainShop = await kv.get('stock:main_shop') || 0;
            const clothing = await kv.get('stock:clothing') || 0;
            const accessories = await kv.get('stock:accessories') || 0;

            return res.status(200).json({
                mainShop: parseInt(mainShop),
                clothing: parseInt(clothing),
                accessories: parseInt(accessories)
            });
        } catch (error) {
            return res.status(500).json({ error: "Failed to read database stock counts." });
        }
    }

    // POST Request: Update stock numbers when you hit "Save Changes"
    if (req.method === 'POST') {
        try {
            const { mainShop, clothing, accessories } = req.body;

            if (mainShop !== undefined) await kv.set('stock:main_shop', parseInt(mainShop));
            if (clothing !== undefined) await kv.set('stock:clothing', parseInt(clothing));
            if (accessories !== undefined) await kv.set('stock:accessories', parseInt(accessories));

            return res.status(200).json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: "Failed to write updates to database." });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
