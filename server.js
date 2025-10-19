/**
 * Express Server for Red Angel Portfolio
 * Serves the static files and provides API endpoints
 */

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint for testing
app.get('/api/status', (req, res) => {
    res.json({
        status: 'Red Angel server is running',
        port: PORT,
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🔥 Red Angel server running on http://localhost:${PORT}`);
    console.log(`😈 Portfolio available at: http://localhost:${PORT}`);
    console.log(`📱 API status: http://localhost:${PORT}/api/status`);
});

module.exports = app;
