const express = require('express')
const app=express()
const path = require('path');

const port = process.env.PORT||3000;
//const bodyParser = require('body-parser');
const moment = require('moment')
const mongoose = require('mongoose');
const User = require('./model/user');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars')

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'testcodefor@gmail.com',
    pass: 'ltunmoeiusbhbbzo'
  }
});
const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve('./views'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./views'),
    extName: ".handlebars",
  }
  transporter.use('compile', hbs(handlebarOptions));

transporter.verify().then(console.log).catch(console.error);

app.locals.moment = moment;

// template engine  
app.use(express.static('public'))
app.set('view engine','ejs')

app.use(express.urlencoded({ extended: true }));
app.use('/',require('./routes/news'))
app.set('views',path.join(__dirname,'views'));

mongoose.connect('mongodb://127.0.0.1:27017/NewsData')
  .then(() => {
    console.log('MongoDB connected!!')
  })
  .catch(err => {
    console.log('Failed to connect to MongoDB', err)
  })


app.get('/home',(req,res)=>{
    res.render('home');
})
app.post('/join', async(req,res)=>{
    const {email} = req.body;
    let mailOptions = {
        from: 'testcodefor@gmail.com',
        to: email,
        subject: 'Welcome To News Buddy',
  template: 'index',
  context: {
    title: 'Title Here',
    text: "Lorem ipsum dolor sit amet, consectetur..."
  }
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      
    console.log(email);
    res.redirect('/');
})









app.set('views','./views')

app.listen(port,()=> console.log("started"))