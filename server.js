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
    user: 'notekeeperapi@gmail.com',
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

app.post('/portfolio/contact', (req, res) => {
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
        ${req.body.message}
        <hr />
        `,
  };
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) return console.error(err);
  });
  res.redirect('https://www.dylancaldwell.tk/thanks');
});

app.listen(process.env.PORT || 3000);
