const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../db/models/User');
const auth = require('../middleware/auth');
const {
    signupValidation,
    loginValidation,
    forgotPasswordValidation,
    verifyCodeValidation,
    resetPasswordValidation
} = require('../middleware/validate');
const { sendResetCode, generateResetCode } = require('../services/emailService');

// @route   POST /api/auth/signup
// @desc    Register user
router.post('/signup', signupValidation, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check for existing user
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create salt & hash
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password: passwordHash
        });

        await newUser.save();

        const payload = {
            user: {
                id: newUser._id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'carbon_secret_key',
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: newUser._id,
                        name: newUser.name,
                        email: newUser.email
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', loginValidation, async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('[Auth] Login attempt for:', email);

        // Check for existing user - must explicitly select password field
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            console.log('[Auth] User not found:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('[Auth] User found:', user.email, 'Has password:', !!user.password);

        // Validate password
        if (!user.password) {
            console.log('[Auth] Password field is empty for user:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('[Auth] Password match result:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user._id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'carbon_secret_key',
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                console.log('[Auth] Login successful for:', email);
                res.json({
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }
                });
            }
        );
    } catch (err) {
        console.error('[Auth] Login error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/auth/user
// @desc    Get user data
router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset code to email
router.post('/forgot-password', forgotPasswordValidation, async (req, res) => {
    try {
        const { email } = req.body;
        console.log('[Auth] Forgot password request for:', email);

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log('[Auth] No user found for forgot password:', email);
            return res.status(404).json({ message: 'No account found with this email address' });
        }

        // Generate 6-digit code
        const resetCode = generateResetCode();
        console.log('[Auth] Generated reset code for:', email, 'Code:', resetCode);

        // Set expiry to 10 minutes from now
        const resetCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

        // Save code and expiry to user
        user.resetCode = resetCode;
        user.resetCodeExpiry = resetCodeExpiry;
        await user.save();
        console.log('[Auth] Reset code saved for user:', email);

        // Send email with code
        try {
            await sendResetCode(email, resetCode);
            console.log('[Auth] Reset code email sent successfully to:', email);
            res.json({ message: 'Verification code sent to your email' });
        } catch (emailError) {
            console.error('[Auth] Email send error:', emailError);
            // Still save the code even if email fails (for testing purposes)
            // In production, you might want to handle this differently
            res.status(500).json({
                message: 'Failed to send email. Please check your email configuration or try again later.'
            });
        }
    } catch (err) {
        console.error('[Auth] Forgot password error:', err.message);
        res.status(500).json({ message: err.message || 'Failed to send verification code' });
    }
});

// @route   POST /api/auth/verify-reset-code
// @desc    Verify the reset code
router.post('/verify-reset-code', verifyCodeValidation, async (req, res) => {
    try {
        const { email, code } = req.body;

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: 'No account found with this email address' });
        }

        // Check if code exists
        if (!user.resetCode) {
            return res.status(400).json({ message: 'No reset code found. Please request a new one.' });
        }

        // Check if code has expired
        if (new Date() > user.resetCodeExpiry) {
            // Clear expired code
            user.resetCode = null;
            user.resetCodeExpiry = null;
            await user.save();
            return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
        }

        // Verify code matches (ensure both are strings for comparison)
        if (String(user.resetCode).trim() !== String(code).trim()) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        res.json({ message: 'Code verified successfully', valid: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with verified code
router.post('/reset-password', resetPasswordValidation, async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        console.log('[Auth] Reset password request for:', email);

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            console.log('[Auth] No user found for reset password:', email);
            return res.status(404).json({ message: 'No account found with this email address' });
        }

        // Check if code exists
        if (!user.resetCode) {
            console.log('[Auth] No reset code found for user:', email);
            return res.status(400).json({ message: 'No reset code found. Please request a new one.' });
        }

        // Check if code has expired
        if (new Date() > user.resetCodeExpiry) {
            console.log('[Auth] Reset code expired for user:', email);
            user.resetCode = null;
            user.resetCodeExpiry = null;
            await user.save();
            return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
        }

        // Verify code matches (ensure both are strings for comparison)
        if (String(user.resetCode).trim() !== String(code).trim()) {
            console.log('[Auth] Invalid code provided for user:', email, 'Expected:', user.resetCode, 'Got:', code);
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);
        console.log('[Auth] New password hashed for user:', email);

        // Update password and clear reset code
        user.password = passwordHash;
        user.resetCode = null;
        user.resetCodeExpiry = null;
        await user.save();
        console.log('[Auth] Password reset successful for user:', email);

        res.json({ message: 'Password reset successfully. You can now login with your new password.' });
    } catch (err) {
        console.error('[Auth] Reset password error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
