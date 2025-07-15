import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendVerificationEmail = async (to, token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${token}`;

  await transporter.sendMail({
    from: `"Soporte" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Confirma tu cuenta',
    html: `
      <h3>Bienvenido 👋</h3>
      <p>Hacé clic en el siguiente enlace para verificar tu cuenta:</p>
      <a href="${verificationLink}">${verificationLink}</a>
      <p>Si no te registraste, ignorá este mensaje.</p>
    `
  });
};

export const sendResetPasswordEmail = async (to, token) => {
  const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Soporte" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Restablecer contraseña',
    html: `
      <h3>¿Olvidaste tu contraseña?</h3>
      <p>Hacé clic en el enlace para restablecerla:</p>
      <a href="${link}">${link}</a>
      <p>Este enlace vence en 1 hora.</p>
    `
  });
};

