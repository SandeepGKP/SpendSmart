const express = require('express');
const path = require('path');
require('dotenv').config();
const cors = require('cors');

const { connectToDB } = require('./util/database');
const { isAuth } = require('./middlewares/auth');

const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { vaultRouter } = require('./routes/vault');
const { friendsRouter } = require('./routes/friends');
const { splitsRouter } = require('./routes/splits');
const { trackRouter } = require('./routes/track');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

/* ---------- DB LAZY CONNECTION (RENDER OPTIMIZATION) ---------- */
let isDBConnected = false;

const connectOnce = async () => {
    if (!isDBConnected) {
        await connectToDB();
        isDBConnected = true;
        console.log("Connection Established");
    }
};
/* ------------------------------------------------------------ */

app.use(cors({
    origin: [
        'https://spendsmart-obnt.onrender.com',
        'http://localhost:5173',
        'https://spend-smart-tan.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

/* ---------- HEALTH CHECK (NO DB) ---------- */
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

/* ---------- AUTH ROUTES (NO DB YET) ---------- */
app.use('/auth', authRouter);

/* ---------- CONNECT DB ONLY WHEN NEEDED ---------- */
app.use(async (req, res, next) => {
    await connectOnce();
    next();
});

/* ---------- PROTECTED ROUTES ---------- */
app.use(isAuth);

app.use('/profile', profileRouter);
app.use('/vault', vaultRouter);
app.use('/friends', friendsRouter);
app.use('/split', splitsRouter);
app.use('/track', trackRouter);

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'ExpenseEase Backend API is running',
        version: '1.0.0'
    });
});

/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
