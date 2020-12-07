const express = require('express');
const app = express();
require('dotenv').config();
const nodemailer = require('nodemailer');

// Middlewares
app.use(express.urlencoded({ extended: false }));

// Routes
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreplydevapp@gmail.com',
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

app.post('/portfolio/contact', (req, res) => {
  // Adding return value
  let newMessageArr = JSON.stringify(req.body.message)
    .replace(/\\r\\n/gi, '<br />')
    .trim()
    .split('');
  newMessageArr.pop();
  newMessageArr.shift();
  let newMessage = newMessageArr.join('');
  // Mail Options
  const mailOptions = {
    from: 'Contact Form',
    to: 'dylan.caldwell35@gmail.com',
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
});

app.listen(process.env.PORT || 3000);
