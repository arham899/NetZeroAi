const nodemailer = require('nodemailer');

// Create transporter lazily to ensure env vars are loaded
let transporter = null;

const getTransporter = () => {
    if (!transporter) {
        console.log('[Email] Creating transporter with user:', process.env.EMAIL_USER);
        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // Use TLS
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }
    return transporter;
};

/**
 * Send password reset verification code
 * @param {string} email - Recipient email
 * @param {string} code - 6-digit verification code
 * @returns {Promise<boolean>} - Success status
 */
const sendResetCode = async (email, code) => {
    // Check if email configuration is set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Email credentials not configured. Email will not be sent.');
        console.log(`[DEV MODE] Reset code for ${email}: ${code}`);
        // In development, we can still proceed without sending email
        // In production, you might want to throw an error instead
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Email service not configured');
        }
        return true; // Return success for development
    }

    const mailOptions = {
        from: {
            name: 'Carbon Calculator',
            address: process.env.EMAIL_USER
        },
        to: email,
        subject: 'Password Reset Code - Carbon Calculator',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
                <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <div style="background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🌍 Carbon Calculator</h1>
                    </div>
                    <div style="background: white; border-radius: 0 0 16px 16px; padding: 40px 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 24px;">Password Reset Request</h2>
                        <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                            We received a request to reset your password. Use the verification code below to proceed:
                        </p>
                        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #f0fdfa 100%); border: 2px solid #10b981; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                            <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #059669;">${code}</span>
                        </div>
                        <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 8px 0;">
                            ⏱️ This code will expire in <strong>10 minutes</strong>.
                        </p>
                        <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0;">
                            If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                        </p>
                    </div>
                    <div style="text-align: center; padding: 24px; color: #94a3b8; font-size: 12px;">
                        <p style="margin: 0;">© 2026 Carbon Calculator. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `Carbon Calculator - Password Reset\n\nYour verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`
    };

    try {
        const transport = getTransporter();
        console.log('[Email] Attempting to send email to:', email);
        const info = await transport.sendMail(mailOptions);
        console.log(`[Email] Reset code sent to ${email}, messageId: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('[Email] Send error details:');
        console.error('  - Error code:', error.code);
        console.error('  - Error message:', error.message);
        console.error('  - Response:', error.response);
        console.error('  - Full error:', error);
        throw new Error(`Failed to send verification email: ${error.message}`);
    }
};

/**
 * Generate a 6-digit verification code
 * @returns {string} - 6-digit code
 */
const generateResetCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
    sendResetCode,
    generateResetCode
};
