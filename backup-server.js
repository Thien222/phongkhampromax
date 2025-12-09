import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const PORT = 3001;

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

app.listen(PORT, () => {
    console.log(`🗄️  Backup Server running at http://localhost:${PORT}`);
});
