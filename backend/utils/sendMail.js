


import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'PRODUCTION') {
  dotenv.config({ path: 'backend/config/config.env' });
}

export const sendMail = async (options) => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;

  console.log('!!!!!smtp Conifg Check$$$$$$$$');
  console.log(`SMTP USER: ${smtpUser ? smtpUser : '***Missing***'}`);
  console.log(`SMTP PASSWORD: ${smtpPassword ? '****Hidden****' : '****Missing****'}`);
  console.log('**************************************************');

  if (!smtpPassword || !smtpUser) {
    throw new Error('SMTP Password or User are Missing in Environment Variables');
  }

  // Création du transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // SSL
    auth: {
      user: smtpUser,
      pass: smtpPassword 
    },
    tls: {
      rejectUnauthorized: false 
    }
  });

  try {
    await transporter.verify();
    console.log('smtp server is ready to send messages');
  } catch (error) {
    console.error('Error verifing SMTP Connection:', error);
    throw new Error('Smtp Connection Failed: ' + error.message);
  }

  // Préparation des options du mail
  const mailOptions = {
    from: smtpUser,
    to: options.email,
    subject: options.subject,
    text: options.resetPasswordMsg || options.orderSuccessMessage
  };

  // Envoi du mail
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('infor are:', info);
    console.log(`email sent successfully: ${info.response}`);
    console.log('email sent successfully to:', mailOptions.to);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email: ' + error.message);
  }
};
