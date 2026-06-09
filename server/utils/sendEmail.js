const transporter = require('../config/mailer')

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html
  }

  await transporter.sendMail(mailOptions)
}

module.exports = sendEmail
