const nodemailer = require('nodemailer');
require('dotenv').config({silent: true});
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    type: 'OAuth2',
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    refreshToken: process.env.REFRESH,
    user: process.env.mainEmail
  }
});

const sendEmail = exports.sendEmail = (mailOptions, callback) => {
  if (!mailOptions.to || !mailOptions.text)
    return callback('Error on options.', new Error('Error: No text or sender email has been added to options sent.'));

  if (!mailOptions.from)
    mailOptions.from = `${process.env.mainUser} <${process.env.mainEmail}>`; // change this to default email

  if (!mailOptions.subject)
    mailOptions.subject = 'Do not reply - MangaDB'; // change this to default subject

  const verifyMail = (err, success) => {
    if (err)
      return callback('Error verifying connection to SMTP server', err);

    const send = (err, res) => {
      if (err)
        return callback('Error', err);

      return callback(null, res); // if it gets here, it means it sent the email successfully
    };

    transporter.sendMail(mailOptions, send);
  };

  transporter.verify(verifyMail);
};

const sendMailNewUser = exports.sendMailNewUser = (user, email, callback) => {
  const mailOptions = {
    to: email,
    subject: 'Welcome to MangaDB!',
    from: `${process.env.mainUser} <${process.env.mainEmail}>`,
    text: `Welcome to MangaDB, ${user}.\nYour user is already, successfully registered!!`
  };
  sendEmail(mailOptions, callback);
}
