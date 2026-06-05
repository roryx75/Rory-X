import { createClient } from '@vercel/kv';

export default async function handler(req, res) {
    try {
        const kv = createClient({
            url: process.env.KV_REST_API_URL || process.env.STORAGE_REST_API_URL,
            token: process.env.KV_REST_API_TOKEN || process.env.STORAGE_REST_API_TOKEN,
        });

        // Seed the initial factory database layout map
        const initialStock = {
            "Dehydrated Water": 15, "Air (Small)": 10, "Air (Medium)": 10, "Air (Large)": 5,
            "Unlit Fire": 8, "Boxes": 20, "Rory X Hat": 12, "Rory X T-Shirt": 15,
            "Rory X Phone Case": 20, "Rory X Pin Badge": 40, "Air Freshener": 30, "Face Mask": 25,
            "Rory X Unisex Joggers (Black)": 12, "Rory X Unisex Joggers (White)": 12,
            "Rory X Socks (Black)": 50, "Rory X Socks (White)": 50, "Rory X Sticker": 100,
            "Rory X Hockey Puck": 15, "Rory X Shower Curtain": 5, "Rory X 10oz glass": 30,
            "Rory X Mug (3 Designs)": 24, "Rory X Hoodie": 25, "Rory X Jewelry Box": 15
        };

        await kv.set('roryx_master_stock', initialStock);
        return res.status(200).json({ success: true, message: "Upstash database initialized successfully!" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
