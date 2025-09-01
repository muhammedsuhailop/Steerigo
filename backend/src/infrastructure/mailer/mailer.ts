import nodemailer from 'nodemailer';
import pino from 'pino';


const logger = pino();


export async function sendMail(to: string, subject: string, html: string) {
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});



try {
const info = await transporter.sendMail({
from: process.env.MAIL_USER,
to,
subject,
html
});
logger.info({ to, subject, messageId: info.messageId }, 'Sent OTP email');
} catch (err) {
logger.error({ err }, 'Failed to send mail');
throw err;
}
}