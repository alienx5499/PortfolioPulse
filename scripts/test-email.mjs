import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testEmailSetup() {
    console.log('🧪 Testing PortfolioPulse Email Setup...\n');

    // Check environment variables
    const email = process.env.NODEMAILER_EMAIL;
    const password = process.env.NODEMAILER_PASSWORD;

    if (!email || !password) {
        console.error('❌ Missing email configuration!');
        console.log('Please add these to your .env.local file:');
        console.log('NODEMAILER_EMAIL=your-email@gmail.com');
        console.log('NODEMAILER_PASSWORD=your-app-password');
        process.exit(1);
    }

    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password.substring(0, 4)}****`);

    // Create transporter
    const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: email,
            pass: password,
        }
    });

    try {
        // Test connection
        console.log('\n🔌 Testing connection...');
        await transporter.verify();
        console.log('✅ Connection successful!');

        // Send test email
        console.log('\n📤 Sending test email...');
        const testEmail = {
            from: `"PortfolioPulse Test" <${email}>`,
            to: email, // Send to yourself
            subject: '🧪 PortfolioPulse Email Test',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #11224E;">PortfolioPulse Email Test</h2>
                    <p>This is a test email to verify your email configuration is working correctly.</p>
                    <div style="background: #F87B1B; color: white; padding: 16px; border-radius: 8px; margin: 20px 0;">
                        <strong>✅ Email setup is working!</strong>
                    </div>
                    <p>You can now use password reset and other email features.</p>
                </div>
            `
        };

        await transporter.sendMail(testEmail);
        console.log('✅ Test email sent successfully!');
        console.log(`📬 Check your inbox: ${email}`);

    } catch (error) {
        console.error('❌ Email test failed:', error.message);
        
        if (error.message.includes('Invalid login')) {
            console.log('\n💡 Troubleshooting:');
            console.log('1. Make sure you\'re using an App Password, not your regular Gmail password');
            console.log('2. Enable 2-Factor Authentication on your Google account');
            console.log('3. Generate a new App Password from Google Account settings');
        }
        
        process.exit(1);
    }
}

testEmailSetup();
