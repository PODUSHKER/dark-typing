const nodemailer = require('nodemailer')
const path = require('path')
const fs = require('fs').promises;
const hbs = require('hbs');




async function verifyMailSender(destination, url) {
  const srcHtml = await fs.readFile(path.join(path.dirname(__dirname), 'templates', 'mail-template.hbs'), 'utf-8');
  const template = hbs.compile(srcHtml);

  const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    secure: true,
    port: 465,
    auth: {
      user: process.env.VERIFY_EMAIL_LOGIN,
      pass: process.env.VERIFY_EMAIL_PASSWORD
    }
  })

  const html = template({
    verificationLink: url,
    currentYear: new Date().getFullYear()
  })
  await transporter.sendMail({
    from: `DARK-TYPING <${process.env.VERIFY_EMAIL_LOGIN}>`,
    to: destination,
    subject: 'DARK-TYPING: Verify Your Email',
    html
  })
}


module.exports = verifyMailSender;