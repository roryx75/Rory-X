import { createClient } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    try {
        const kv = createClient({
            url: process.env.KV_REST_API_URL || process.env.STORAGE_REST_API_URL,
            token: process.env.KV_REST_API_TOKEN || process.env.STORAGE_REST_API_TOKEN,
        });

        const newOrder = req.body;
        let currentOrders = await kv.get('roryx_customer_orders') || [];
        
        if (!Array.isArray(currentOrders)) currentOrders = [];
        currentOrders.push(newOrder);

        await kv.set('roryx_customer_orders', currentOrders);
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: 'Database transaction failure' });
    }
}
