import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendVerificationEmail(to, token) {
  const verifyUrl = `${process.env.BASE_URL}/api/verify-email?token=${token}`;
  await transporter.sendMail({
    from: '"My Hosting Platform" <no-reply@myplatform.com>',
    to,
    subject: "Verify your account",
    html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`
  });
}
