const nodemailer = require('nodemailer');

const createMailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT), // ensure number
    secure: false, // true only for 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000, // prevent hanging
    greetingTimeout: 10000,
    socketTimeout: 10000
  });
};

module.exports = createMailTransporter;
