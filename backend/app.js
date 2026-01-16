const http = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const mongoose = require('mongoose');
const { connectToDB } = require('./util/database');
require('dotenv').config();
const cors = require('cors')

const { isAuth } = require('./middlewares/auth')

const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { vaultRouter } = require('./routes/vault')
const { friendsRouter } = require('./routes/friends')
const { splitsRouter } = require('./routes/splits')
const { trackRouter } = require('./routes/track')


const app = express();
const server = http.createServer(app)
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(cors({
    origin: ['https://spendsmart-obnt.onrender.com','http://localhost:5173','https://spend-smart-tan.vercel.app/'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


/* ---------- ROBUST DB CONNECTION (RENDER SPIN-DOWN FIX) ---------- */
let isDBConnected = false;
let connectionAttempts = 0;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second base delay

const connectWithRetry = async () => {
    if (isDBConnected) {
        // Verify connection is still alive
        try {
            await mongoose.connection.db.admin().ping();
            return true;
        } catch (err) {
            console.log("Connection lost, attempting reconnect...");
            isDBConnected = false;
        }
    }

    for (let attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
        try {
            console.log(`Database connection attempt ${attempt}/${MAX_RETRY_ATTEMPTS}`);
            await connectToDB();
            isDBConnected = true;
            console.log("Database connection established successfully");
            connectionAttempts = 0; // Reset on success
            return true;
        } catch (error) {
            console.error(`Database connection attempt ${attempt} failed:`, error.message);
            if (attempt < MAX_RETRY_ATTEMPTS) {
                const delay = RETRY_DELAY * Math.pow(2, attempt - 1); // Exponential backoff
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    console.error("Failed to connect to database after all retry attempts");
    return false;
};

/* ---------- DB CONNECTION MIDDLEWARE ---------- */
const ensureDBConnection = async (req, res, next) => {
    try {
        const connected = await connectWithRetry();
        if (!connected) {
            return res.status(503).json({ error: 'Database connection failed' });
        }
        next();
    } catch (error) {
        console.error('Database connection middleware error:', error);
        return res.status(503).json({ error: 'Database service unavailable' });
    }
};
/* ------------------------------------------------------------ */

app.use(cookieParser())

app.use('/auth', authRouter)

// Apply database connection check to all protected routes
app.use(ensureDBConnection);

app.use(isAuth);

app.use('/profile', profileRouter)

app.use('/vault', vaultRouter)

app.use('/friends', friendsRouter)

app.use('/split', splitsRouter)

app.use('/track', trackRouter)

app.get('/health', (req, res) => {
    res.status(200).json({ message: 'ExpenseEase Backend API is running', version: '1.0.0' });
})

const main = async () => {
    try {
        // Try initial connection, but don't fail if it doesn't work
        const connected = await connectWithRetry();
        if (connected) {
            console.log("Initial database connection established");
        } else {
            console.warn("Initial database connection failed - will retry on first request");
        }

        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}
main();
