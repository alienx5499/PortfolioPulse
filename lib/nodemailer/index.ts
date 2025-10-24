import nodemailer from 'nodemailer';
import {WELCOME_EMAIL_TEMPLATE, NEWS_SUMMARY_EMAIL_TEMPLATE, PASSWORD_RESET_EMAIL_TEMPLATE, OTP_EMAIL_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE} from "@/lib/nodemailer/templates";

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL!,
        pass: process.env.NODEMAILER_PASSWORD!,
    }
})

export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}', name)
        .replace('{{intro}}', intro);

    const mailOptions = {
        from: `"PortfolioPulse" <noreply@portfoliopulse.app>`,
        to: email,
        subject: `Welcome to PortfolioPulse - your advanced market analytics platform is ready!`,
        text: 'Thanks for joining PortfolioPulse',
        html: htmlTemplate,
    }

    await transporter.sendMail(mailOptions);
}

export const sendNewsSummaryEmail = async (
    { email, date, newsContent }: { email: string; date: string; newsContent: string }
): Promise<void> => {
    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
        .replace('{{date}}', date)
        .replace('{{newsContent}}', newsContent);

    const mailOptions = {
        from: `"PortfolioPulse News" <news@portfoliopulse.app>`,
        to: email,
        subject: `📈 Market News Summary Today - ${date}`,
        text: `Today's market news summary from PortfolioPulse`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async ({ email, name, resetUrl }: { email: string; name: string; resetUrl: string }) => {
    const htmlTemplate = PASSWORD_RESET_EMAIL_TEMPLATE
        .replace(/{{userName}}/g, name)
        .replace(/{{resetUrl}}/g, resetUrl);

    const mailOptions = {
        from: `"PortfolioPulse Security" <security@portfoliopulse.app>`,
        to: email,
        subject: `🔐 Reset Your PortfolioPulse Password`,
        text: `Hello ${name}, please click the following link to reset your password: ${resetUrl}`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};

export const sendOTPEmail = async ({ email, otp }: { email: string; otp: string }) => {
    const htmlTemplate = OTP_EMAIL_TEMPLATE
        .replace(/{{otp}}/g, otp);

    const mailOptions = {
        from: `"PortfolioPulse Security" <security@portfoliopulse.app>`,
        to: email,
        subject: `🔐 Your PortfolioPulse OTP Code`,
        text: `Your OTP code is: ${otp}. This code will expire in 10 minutes.`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};

export const sendVerificationEmail = async ({ email, name, verificationUrl }: { email: string; name: string; verificationUrl: string }) => {
    const htmlTemplate = VERIFICATION_EMAIL_TEMPLATE
        .replace(/{{verificationUrl}}/g, verificationUrl);

    const mailOptions = {
        from: `"PortfolioPulse" <noreply@portfoliopulse.app>`,
        to: email,
        subject: `✅ Verify Your PortfolioPulse Account`,
        text: `Please verify your email address by clicking this link: ${verificationUrl}`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};
