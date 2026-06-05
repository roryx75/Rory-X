import { kv } from '@vercel/kv';

export default async function handler(request, response) {
    if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
    try {
        await kv.set('rory_x_stock', request.body);
        return response.status(200).json({ success: true });
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
}
