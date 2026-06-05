import { createClient } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    try {
        const kv = createClient({
            url: process.env.KV_REST_API_URL || process.env.STORAGE_REST_API_URL,
            token: process.env.KV_REST_API_TOKEN || process.env.STORAGE_REST_API_TOKEN,
        });
        const orders = await kv.get('roryx_customer_orders') || [];
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ error: 'Database read failure' });
    }
}
