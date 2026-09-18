import express from 'express';
import cors from 'cors';
import { client } from '@gradio/client';

const app = express();
app.use(cors()); 
app.use(express.json({ limit: '50mb' })); 

let hfApp = null;

async function initClient() {
    // This looks for the HF_TOKEN environment variable you set in the Render/Railway dashboard
    hfApp = await client("hindsightform/syncaviarutaite", { 
        hf_token: process.env.HF_TOKEN 
    });
    console.log("Connected to Hugging Face Space");
}
initClient();

app.post('/api/inferpls', async (req, res) => {
    try {
        const { base64SnOps, singerName } = req.body;
        
        if (!hfApp) {
            return res.status(503).json({ error: "Gradio client not ready yet." });
        }

        const result = await hfApp.predict("/inferpls", [base64SnOps, singerName]);
        res.json({ data: result.data }); 
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Render provides a dynamic PORT environment variable. If missing, it defaults to 3000.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy listening on port ${PORT}`));
