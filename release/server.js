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

// ========== API ROUTES ==========
const DB_PATH = path.join(__dirname, 'database.json');

app.get('/api/ping', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/database', (req, res) => {
    console.log('[API] GET /api/database');
    try {
        if (!fs.existsSync(DB_PATH)) {
            return res.json({ patients: [], inventory: [], invoices: [], settings: null });
        }
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/database', (req, res) => {
    console.log('[API] POST /api/database from', req.ip);
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(req.body, null, 2), 'utf-8');
        console.log('[API] Saved database.json');
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========== BACKUP ROUTES ==========
// Save backup to specified path
app.post('/api/backup', (req, res) => {
    try {
        const { data, filename, backupPath } = req.body;

        // Ensure directory exists
        if (!fs.existsSync(backupPath)) {
            fs.mkdirSync(backupPath, { recursive: true });
        }

        const filePath = path.join(backupPath, filename);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

        // Get file size
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(1);

        res.json({
            success: true,
            message: `Đã lưu backup vào ${filePath}`,
            filePath,
            size: `${sizeKB} KB`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Lỗi: ${error.message}`
        });
    }
});

// List backups in directory
app.get('/api/backups', (req, res) => {
    try {
        const backupPath = req.query.path || 'C:\\EyeClinicBackup';

        if (!fs.existsSync(backupPath)) {
            return res.json({ success: true, files: [] });
        }

        const files = fs.readdirSync(backupPath)
            .filter(f => f.endsWith('.json') && f.startsWith('backup_clinic'))
            .map(filename => {
                const filePath = path.join(backupPath, filename);
                const stats = fs.statSync(filePath);
                return {
                    filename,
                    path: filePath,
                    date: stats.mtime.getTime(),
                    size: `${(stats.size / 1024).toFixed(1)} KB`
                };
            })
            .sort((a, b) => b.date - a.date);

        res.json({ success: true, files });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message, files: [] });
    }
});

// Delete a backup file
app.delete('/api/backup', (req, res) => {
    try {
        const { filePath } = req.body;

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({ success: true, message: 'Đã xóa file backup' });
        } else {
            res.status(404).json({ success: false, message: 'File không tồn tại' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Restore from backup file
app.get('/api/backup/restore', (req, res) => {
    try {
        const filePath = req.query.path;

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: 'File không tồn tại' });
        }

        const data = fs.readFileSync(filePath, 'utf-8');
        res.json({ success: true, data: JSON.parse(data) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ========== STATIC FILES ==========
const publicPath = path.join(__dirname, 'public');

// Helper to determine content type
function getContentType(filePath) {
    if (filePath.endsWith('.html')) return 'text/html';
    if (filePath.endsWith('.css')) return 'text/css';
    if (filePath.endsWith('.js')) return 'application/javascript';
    if (filePath.endsWith('.json')) return 'application/json';
    return null;
}

app.use(express.static(publicPath, {
    setHeaders: (res, filePath) => {
        const type = getContentType(filePath);
        if (type) {
            res.setHeader('Content-Type', `${type}; charset=UTF-8`);
        }
        // Disable caching to force browser to reload fresh content
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
}));

// Fallback to index.html for SPA
app.get('*', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.sendFile(path.join(publicPath, 'index.html'));
});

// ========== START ==========
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
    console.log('========================================');
    console.log('  EYE CLINIC SERVER - UTF8 PATCHED');
    console.log('========================================');
    console.log('  Local:   http://localhost:' + PORT);
    console.log('  Network: http://' + ip + ':' + PORT);
    console.log('========================================');
});
