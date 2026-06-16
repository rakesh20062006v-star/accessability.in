const express = require('express');
const router = express.Router();
const User = require('../mongodb/mongoschema');
const Admin = require('../mongodb/adminschema');
const { sendRegistrationMail, sendForgotPasswordMail } = require('../emailsupport/mails');

// In-memory OTP store: { email -> { otp, expiresAt } }
const otpStore = new Map();

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const adminUser = await Admin.findOne({ username, password });
        if (adminUser) {
            return res.status(200).json({
                role: 'admin',
                message: 'Admin Login Successful',
                admin: adminUser
            });
        }

        const user = await User.findOne({ username, password });
        console.log(user);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({ role: 'user', message: 'Login successful', user });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, accountType, disabilityTypes } = req.body;

        // Username validation
        if (!username || username.trim().length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters' });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Password validation
        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Account type validation
        if (!accountType) {
            return res.status(400).json({ error: 'Please select an account type' });
        }

        // Check existing username or email
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({ error: 'Username already exists' });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ error: 'Email already registered' });
            }
        }

        // Create user
        const user = new User({ username, email, password, accountType, disabilityTypes });
        await user.save();

        // Send registration success email (non-blocking)
        sendRegistrationMail(email, username).catch(err =>
            console.error('Registration mail error:', err)
        );

        res.status(201).json({ message: 'User registered successfully', user });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────
// FORGOT PASSWORD — Step 1: Send OTP
// ─────────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'No account found with this email' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

        otpStore.set(email, { otp, expiresAt });

        await sendForgotPasswordMail(email, otp);

        res.json({ message: 'OTP sent successfully to your email' });

    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
    }
});

// ─────────────────────────────────────────────
// VERIFY OTP — Step 2: Validate OTP
// ─────────────────────────────────────────────
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        const record = otpStore.get(email);

        if (!record) {
            return res.status(400).json({ error: 'OTP not found. Please request a new one.' });
        }

        if (Date.now() > record.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
        }

        if (record.otp !== otp.toString()) {
            return res.status(400).json({ error: 'Incorrect OTP. Please try again.' });
        }

        res.json({ message: 'OTP verified successfully' });

    } catch (err) {
        console.error('Verify OTP error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────
// RESET PASSWORD — Step 3: Set New Password
// ─────────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ error: 'Email and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Ensure OTP was verified (record still present)
        const record = otpStore.get(email);
        if (!record) {
            return res.status(400).json({ error: 'OTP verification required before resetting password' });
        }

        const user = await User.findOneAndUpdate(
            { email },
            { password: newPassword },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Clear OTP after successful reset
        otpStore.delete(email);

        res.json({ message: 'Password reset successfully. You can now login.' });

    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─────────────────────────────────────────────
// ADMIN REGISTER
// ─────────────────────────────────────────────
router.post('/admin-register', async (req, res) => {
    try {
        const { username, email, password, secretKey } = req.body;

        // Validate secret key
        if (!secretKey || secretKey !== process.env.ADMIN_SECRET_KEY) {
            return res.status(403).json({ error: 'Invalid admin secret key' });
        }

        // Username validation
        if (!username || username.trim().length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters' });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Password validation
        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check duplicate
        const existingAdmin = await Admin.findOne({
            $or: [{ username }, { email }]
        });

        if (existingAdmin) {
            if (existingAdmin.username === username)
                return res.status(400).json({ error: 'Admin username already exists' });
            if (existingAdmin.email === email)
                return res.status(400).json({ error: 'Admin email already registered' });
        }

        // Create admin
        const admin = new Admin({ username, email, password });
        await admin.save();

        res.status(201).json({ message: 'Admin registered successfully' });

    } catch (err) {
        console.error('Admin register error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;