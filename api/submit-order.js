import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const orderPayload = req.body;
        
        // Fetch the current orders array from Vercel KV
        let existingOrders = await kv.get('roryx_orders');
        if (!existingOrders || !Array.isArray(existingOrders)) {
            existingOrders = [];
        }

        // Add the incoming order to the top of the list
        existingOrders.unshift(orderPayload);
        await kv.set('roryx_orders', existingOrders);

        // Deduct inventory item count automatically
        const currentStock = await kv.get('roryx_stock');
        if (currentStock && currentStock[orderPayload.item] !== undefined) {
            const currentQuantity = parseInt(currentStock[orderPayload.item]) || 0;
            if (currentQuantity > 0) {
                currentStock[orderPayload.item] = currentQuantity - 1;
                await kv.set('roryx_stock', currentStock);
            }
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
