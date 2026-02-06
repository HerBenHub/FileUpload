import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Csak kep fajl engedelyezett'));
        }
        cb(null, true);
    }
});

app.use(cors());
app.use('/uploads', express.static(uploadsDir));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'upload.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nincs file feltöltve' });
    }
    res.json({
        message: 'File sikeresen feltöltve',
        file: req.file,
        uploadedAt: new Date().toISOString()
    });
});

app.get('/uploads/:filename', (req, res) => {
    const filePath = path.join(uploadsDir, req.params.filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: 'File nem található' });
    }
});

app.get('/files', async (req, res) => {
    try {
        const files = await fs.promises.readdir(uploadsDir);
        const fileInfos = await Promise.all(
            files.map(async (file) => {
                const stats = await fs.promises.stat(path.join(uploadsDir, file));
                return {
                    name: file,
                    url: `http://localhost:${PORT}/uploads/${file}`,
                    uploadedAt: stats.mtime.toISOString()
                };
            })
        );
        res.json({ files: fileInfos });
    } catch (err) {
        res.status(500).json({ error: 'Nem lehet elérni a fileokat :(((' });
    }
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'A file mérete túl nagy!!!' });
        }
        return res.status(400).json({ error: 'Hibas feltoltes' });
    }
    if (err?.message === 'Csak kep fajl engedelyezett') {
        return res.status(400).json({ error: err.message });
    }
    next(err);
});

app.delete('/files/:filename', (req, res) => {
    const filePath = path.join(uploadsDir, req.params.filename);
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Nem lehet törölni a file-t :(((' });
            }
            res.json({ message: 'File sikeresen törölve' });
        });
    } else {
        res.status(404).json({ error: 'File nem található' });
    }
});

app.listen(PORT, () => {
    console.log(`Szerver fut a http://localhost:${PORT} címen`);
});