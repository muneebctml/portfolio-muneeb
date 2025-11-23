import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'visitors.json');

app.use(cors());
app.use(bodyParser.json());

// Initialize data file if not exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// API to track visitor
app.post('/api/visit', (req, res) => {
    const { ip, userAgent, timestamp } = req.body;

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read data' });

        const visitors = JSON.parse(data);
        visitors.push({ ip, userAgent, timestamp });

        fs.writeFile(DATA_FILE, JSON.stringify(visitors, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Failed to save data' });
            res.json({ success: true });
        });
    });
});

// API to get visitor stats
app.get('/api/visitors', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read data' });
        res.json(JSON.parse(data));
    });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
