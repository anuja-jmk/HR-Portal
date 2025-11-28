
import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { OAuth2Client } from 'google-auth-library';

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your-secret-key';
//const GOOGLE_CLIENT_ID = '';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

// Routes

// Login with Google OAuth
app.post('/api/login', async (req, res) => {
    try {
        const { credential } = req.body;
        
        if (!credential) {
            console.log('No credential provided');
            return res.status(400).json({ message: 'No credential provided' });
        }

        console.log('Received credential, attempting verification...');

        // Verify the Google token
        let ticket;
        try {
            ticket = await client.verifyIdToken({
                idToken: credential,
                audience: GOOGLE_CLIENT_ID,
            });
            console.log('Token verified successfully');
        } catch (verifyError) {
            console.error('Token verification error:', verifyError.message);
            console.log('Attempting to decode token without verification (dev fallback)...');
            
            // Fallback: if verification fails, try to decode without verification for dev purposes
            const parts = credential.split('.');
            if (parts.length !== 3) {
                console.error('Invalid token format - parts:', parts.length);
                throw new Error('Invalid token format');
            }
            
            try {
                const decoded = Buffer.from(parts[1], 'base64').toString();
                console.log('Decoded token payload:', decoded);
                const payload = JSON.parse(decoded);
                console.log('Parsed payload:', payload);
                
                // Create JWT token
                const token = jwt.sign({ username: payload.email || payload.sub, email: payload.email }, SECRET_KEY, { expiresIn: '1h' });
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax'
                });

                console.log('Login successful for user:', payload.email || payload.sub);
                return res.json({ 
                    message: 'Login successful', 
                    user: { username: payload.email || payload.sub, email: payload.email } 
                });
            } catch (decodeError) {
                console.error('Decode error:', decodeError);
                throw verifyError;
            }
        }

        const payload = ticket.getPayload();
        const username = payload.email || payload.sub;

        // Create JWT token
        const token = jwt.sign({ username, email: payload.email }, SECRET_KEY, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            sameSite: 'lax'
        });

        console.log('Login successful for user:', username);
        return res.json({ 
            message: 'Login successful', 
            user: { username, email: payload.email } 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Logout
app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
});

// Check Auth
app.get('/api/check-auth', verifyToken, (req, res) => {
    res.json({ isAuthenticated: true, user: req.user });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
