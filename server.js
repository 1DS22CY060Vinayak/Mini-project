const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user.js');
const path=require('path');

const ejsmate=require("ejs-mate");


const methodoverride=require('method-override');
app.use(express.static(path.join(__dirname,'/public')));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine('ejs',ejsmate);
app.use(methodoverride("_method"));

const PORT = 3000;
const MONGO_URI = 'mongodb://localhost:27017/miniproject';

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection successful'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session management
app.use(session({
  secret: 'hjsvdcjhsadvchjsdvhsdj',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
}));

app.use(passport.initialize());
app.use(passport.session());

// Using passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login.html');
}

// Routes
app.use(express.static('public'));

// Signup route

app.get('/signup',async(req,res)=>{
  res.render('signup.ejs');
})
app.post('/signup', async (req, res, next) => {
  const { name, username, email, role, password } = req.body;
  try {
    const newUser = new User({ name, username, email, role });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      res.redirect('/');
    });
  } catch (err) {
    console.error(err);
    res.redirect('signup.ejs');
  }
});

app.get('/login',async(req,res)=>{
  res.render('login.ejs');
});


  app.post('/login',passport.authenticate('local',{
    failureRedirect:'/login'
}),async(req,res)=>{
    
    res.redirect("/");
});

app.get('/logout',(req,res,next)=>{
  req.logout((err)=>{
      if(err){
          return  next(err);
      }
     
      res.redirect('/');
  });
});

app.get('/',async(req,res)=>{
  res.render('index.ejs');
})
app.get('/feedback',async(req,res)=>{
  res.render('feedback.ejs');
});

app.get('/courses',async(req,res)=>{
  res.render('courses.ejs');
});

app.get('/chat',async(req,res)=>{
  res.render('chat.ejs');
});

app.get('/resorces',async(req,res)=>{
  res.render('resources.ejs');
});

app.get('/profile',async(req,res)=>{
  res.render('profile.ejs');
});

app.get('/teacher_dashboard',async(req,res)=>{
  res.render('teacher_dashboard.ejs');
});


// Login route
app.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login'
}));

// Resources route
app.get('/resources', isAuthenticated, (req, res) => {
  res.sendFile(__dirname + '/views/resources.ejs');
});

// Profile route
app.get('/profile', isAuthenticated, (req, res) => {
  res.json(req.user);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
