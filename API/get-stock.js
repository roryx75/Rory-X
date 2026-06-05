import { kv } from '@vercel/kv';

export default async function handler(request, response) {
    try {
        let stock = await kv.get('rory_x_stock');
        if (!stock) stock = {};
        return response.status(200).json(stock);
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
}
