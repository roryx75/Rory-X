import { createClient } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const kv = createClient({
            url: process.env.KV_REST_API_URL || process.env.STORAGE_REST_API_URL,
            token: process.env.KV_REST_API_TOKEN || process.env.STORAGE_REST_API_TOKEN,
        });

        const updatedItems = req.body; // Expects an object map like: {"Rory X Hat": 12, ...}

        if (!updatedItems || typeof updatedItems !== 'object') {
            return res.status(400).json({ error: 'Invalid payload structure' });
        }

        // Save the map object into your hash entry store
        await kv.hset('roryx_master_stock', updatedItems);
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Database write failure' });
    }
}
