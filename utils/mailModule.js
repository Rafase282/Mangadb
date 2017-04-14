const nodemailer = require('nodemailer');
const mailConfig = require('./mailConfig');

const transporter = nodemailer.createTransport({
  service : 'gmail',
  auth : mailConfig.oauth
});

const sendEmail = exports.sendEmail = (mailOptions, callback) => {
  if(!mailOptions.to || !mailOptions.text)
    return callback('Error on options.', new Error('Error: No text or sender email has been added to options sent.'));
  if(!mailOptions.from)
    mailOptions.from = `${mailConfig.config.mainUser} <${mailConfig.config.mainEmail}>`; // change this to default email
  if(!mailOptions.subject)
    mailOptions.subject = 'Do not reply -'; // change this to default subject

  transporter.verify((err,success) => {
    if(err) return callback('Error verifying connection to SMTP server', err);

    transporter.sendMail(mailOptions, (err, res) => {
      if(err) return callback('Error', err);  //
      return callback(null, res);
    });
  });
};

const sendMailNewUser = exports.sendMailNewUser = (user, email, callback) => {
  const mailOptions = {
    to : email,
    subject : 'Welcome to MangaDB!',
    from : `${mailConfig.config.mainUser} <${mailConfig.config.mainEmail}>`,
    text : `Welcome to MangaDB, ${user}. Welcome!\nYour user is already, successfully registered!!` // change this part with HTML
  };
  sendEmail(mailOptions, callback);
}


// sendMailNewUser('jenky', 'jenky_nolasco@1mail.com', console.log)
