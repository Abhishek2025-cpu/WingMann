const nodemailer = require('nodemailer')


const createMailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS // Gmail App Password
    }
  })
}

module.exports = createMailTransporter
