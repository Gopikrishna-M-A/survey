const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();
var loggenIn = false

const app = express()
const PORT = process.env.PORT || 3000
const passKey = process.env.PASS_KEY;
const username = process.env.USER;



app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')  
app.use(bodyParser.urlencoded({extended:false}))



//nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'albinstanly2002@gmail.com',
      pass: 'ibejfznampjowtlw'
    }
  });
  

//Mongoose
const URL = "mongodb+srv://"+username+":"+passKey+"@survey.0ijfdji.mongodb.net/?retryWrites=true&w=majority"

mongoose.set("strictQuery", false);
mongoose.connect(URL, { useNewUrlParser: true });  




//data Collection

const dataSchema = mongoose.Schema(
    {
    name:String,
    email:String,
    phone:Number,
    age:Number,
    stack:String,
    role:String,
    comments:String
    }
)
dataSchema.set('timestamps', true);

const Data = new mongoose.model('Data',dataSchema)





  


app.get("/",(req,res)=>{
    res.render("index")
})



app.get("/form",(req,res)=>{
    res.render("form")
})


app.get("/blog",(req,res)=>{
    res.render("503")
})

app.get("/careers",(req,res)=>{
    res.render("career")
})



app.post("/contact",(req,res)=>{
    
    const { email, subject, message } = req.body

    const mailOptions = {
        from: email,
        to: 'albin@xynapsetechnologies.com',
        subject: subject+"  Email:"+email,
        text: message
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          res.redirect("/")
        }
      });
})


//login for data page

app.get("/xynaps-confidential-login",(req,res)=>{
    res.render("login")
})

app.get("/logout",(re1,res)=>{
    loggenIn = false
    res.redirect("/")
})



app.post("/login",(req,res)=>{

    const { email, password } = req.body
    if(email == "albinstanly2002@gmail.com" || email == "Albinstanly2002@gmail.com"){
        if(password == "123"){
            loggenIn = true
            res.redirect("/student-data")
        }else{
            res.redirect("/login")
        }
    }else{
        res.redirect("/login")
    }

})

//check
const requireRedirection = (req, res, next) => {
    // Check if the desired condition is met
    if (loggenIn) {
      // Condition is met, allow access to the next route
      next();
    } else {
      // Condition is not met, redirect to the desired route
      res.redirect('/');
    }
  };

// student-data


app.get("/student-data",requireRedirection,(req,res)=>{

        Data.aggregate([
            {
              $group: {
                _id: "$stack", // Group by the "stack" field
                elements: { $push: "$$ROOT" } // Push each document into the "elements" array
              }
            },
            {
              $project: {
                _id: 0, // Exclude the "_id" field
                stack: "$_id", // Rename "_id" field to "stack"
                elements: 1 // Include the "elements" field
              }
            }
          ])
            .then((result) => {
              console.log('Grouped data:', result);
              res.render("data",{data:result})
            })
            .catch((error) => {
              console.error('Error grouping data:', error);
            });
    
  

        
  
  

})



//form 

app.post("/form",(req,res)=>{
    const name =req.body.name
    const email =req.body.email
    const age =req.body.age
    const role =req.body.role
    const stack =req.body.stack
    const message =req.body.msg
    const phone ="1234567890"


    const newData = new Data({
        name: name,
        email: email,
        phone: phone,
        age: age,
        stack: stack,
        role: role,
        comments: message
      });

      
      newData.save().then((createdData) => {
        console.log('Data created:', createdData)
        res.render("success",{submission:true})
        })
        .catch((error) => {
        console.error('Error creating data:', error);
        res.render("success",{submission:false})
    })


})



app.listen(PORT||3000,(err)=>{
    if(err)
        console.log("err");
    else
        console.log("server started ");    
})