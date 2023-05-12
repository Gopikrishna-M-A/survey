const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const PORT = process.env.PORT;
const passKey = process.env.PASS_KEY;
const username = process.env.USER;
const saltRounds = 10;

const app = express()
const URL = 'mongodb+srv://'+username+':'+passKey+'@survey.0ijfdji.mongodb.net/?retryWrites=true&w=majority'

mongoose.set("strictQuery", false);
mongoose.connect(URL, { useNewUrlParser: true });

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')  
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser());
app.use(session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: true
  }));



// user Collection

const userSchema = mongoose.Schema(
    {
    name:String,
    email:String,
    password:String,
    role:String,
    phone:Number,
    }
)
userSchema.set('timestamps', true);

const User = new mongoose.model('User',userSchema)

//data Collection

const dataSchema = mongoose.Schema(
    {
    userId:mongoose.ObjectId,
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

    




const isLoggedIn = (req, res, next) => {
    if (req.cookies.loggedIn === 'true') {
      next();
    } else {
      res.redirect("/login")
    }
}


// **************************************************************** routes ***************************************************************

// route

app.get("/",(req,res)=>{
    res.redirect("/signup")
})

app.get("/home",(req,res)=>{
    if(req.session.user.role == "admin")
    {
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
  
    }
    else
        res.render("form")

})



//logout route

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err)
        console.log(err)
      else {
        res.clearCookie('loggedIn');
        res.redirect('/login');
      }
    });
  });


//login route

app.get("/login",(req,res)=>{
    res.render("login")
})
app.post("/login",(req,res)=>{
    const email = req.body.email
    const password = req.body.password

    User.findOne({ email: email }).then((user) => {
    if (!user) {
      console.log('User not found')
    } else {
        const hash = user.password
        bcrypt.compare(password, hash, function(err,result) {
            if(result){
                req.session.user = user;
                // console.log(user.name);
                res.cookie('loggedIn', 'true');
                res.redirect("/home")
            }
            else    
                res.send("password does not match")    
        })
    }
  })
  .catch((err) => {
    console.log(err);
  });
})




//signup route

app.get("/signup",(req,res)=>{
    res.render("signup")
})
app.post("/signup",(req,res)=>{
    const name =req.body.name
    const email =req.body.email
    const password =req.body.password
    const role ="user"
    const phone =req.body.phone

    bcrypt.hash(password, saltRounds, function(err, result) {
        if(!err){
            const user = new User({
                name:name,
                email:email,
                password:result,
                role:role,
                phone:phone,
            })
            user.save()
            console.log("encrypting sucessfull ....");
        }
        else
            console.log("err in encrypting password ....");
       
    
    });

   
    res.redirect("/login")
})



//form 

app.post("/form",(req,res)=>{
    const name =req.body.name
    const email =req.body.email
    const age =req.body.age
    const role =req.body.role
    const stack =req.body.stack
    const message =req.body.msg


    const newData = new Data({
        userId: req.session.user._id,
        name: name,
        email: email,
        phone: req.session.user.phone,
        age: age,
        stack: stack,
        role: role,
        comments: message
      });

      
      newData.save().then((createdData) => {
        console.log('Data created:', createdData)
        res.redirect("/home")
        })
        .catch((error) => {
        console.error('Error creating data:', error);})


})


app.listen(PORT||3000,(err)=>{
    if(err)
        console.log("err");
    else
        console.log("server started at port 3000");    
})



// app.get("/faculty",isLoggedIn,(req,res)=>