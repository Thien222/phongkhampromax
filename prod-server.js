import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ========== API ROUTES (MUST BE FIRST!) ==========
const DB_PATH = path.join(__dirname, 'database.json');

// Test endpoint
app.get('/api/ping', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Get database
app.get('/api/database', (req, res) => {
    console.log('[API] GET /api/database');
    try {
        if (!fs.existsSync(DB_PATH)) {
            return res.json({ patients: [], inventory: [], invoices: [], settings: null });
        }
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('[API] Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Save database
app.post('/api/database', (req, res) => {
    console.log('[API] POST /api/database from', req.ip);
    try {
        const data = req.body;
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
        console.log('[API] Saved database.json');
        res.json({ success: true });
    } catch (error) {
        console.error('[API] Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// ========== STATIC FILES (AFTER API!) ==========
const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));
    // Serve index.html for root
    app.get('/', (req, res) => {
        res.sendFile(path.join(publicPath, 'index.html'));
    });
    console.log('[STATIC] Serving from:', publicPath);
}

// ========== START SERVER ==========
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

app.listen(PORT, '0.0.0.0', () => {
    const ip = getLocalIP();
    console.log('');
    console.log('='.repeat(50));
    console.log('  EYE CLINIC SERVER - RUNNING!');
    console.log('='.repeat(50));
    console.log('');
    console.log('  Local:   http://localhost:' + PORT);
    console.log('  Network: http://' + ip + ':' + PORT);
    console.log('');
    console.log('  Test API: http://' + ip + ':' + PORT + '/api/ping');
    console.log('');
    console.log('='.repeat(50));
});
