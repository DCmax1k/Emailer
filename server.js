const express = require('express');
const app = express();
require('dotenv').config();
const nodemailer = require('nodemailer');

// GOOGLEAPIS
const { google } = require('googleapis');
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Middlewares
app.use(express.urlencoded({ extended: false }));

// Routes

app.post('/portfolio/contact', async (req, res) => {
  try {
// Adding return value
  let newMessageArr = JSON.stringify(req.body.message)
    .replace(/\\r\\n/gi, '<br />')
    .trim()
    .split('');
  newMessageArr.pop();
  newMessageArr.shift();
  let newMessage = newMessageArr.join('');
  // Mail Options
  const accessToken = await oAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'noreplydevapp@gmail.com',
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    }
  })

  const mailOptions = {
    from: 'Contact Form',
    to: process.env.PERSONAL_EMAIL,
    subject: 'Contact Form',
    html: `
        <hr />
        <b>Name:</b>
        <br />
        ${req.body.name}
        <hr />
        <br />
        <b>Email:</b>
        <br />
        ${req.body.email}
        <hr />
        <br />
        <b>Message:</b>
        <br />
        ${newMessage}
        <hr />
        `,
  };
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) return console.error(err);
  });
  res.redirect('https://www.dylancaldwell.tk/thanks');
  } catch(err) {
    console.error(err);
  }
  
});

app.listen(process.env.PORT || 3000);
