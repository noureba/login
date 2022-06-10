require('dotenv').config()
const express = require('express');
const bcrypt = require('bcrypt')
const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const initializePassort = require('./passportConfig');
const methodOverride = require('method-override');


initializePassort(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users =[]


app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index', {name: req.user.FirstName});
})

app.get('/login',checkNotAuthenticated, (req, res)=>{
    res.render('login')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))


app.get('/register',checkNotAuthenticated, (req, res)=>{
    res.render('register')
})

app.post('/register', async (req, res)=>{
    try{
        const HashPassword = await bcrypt.hash(req.body.Password, 10)
        users.push({
                id: Date.now().toString(),
                FirstName: req.body.FirstName,
                LastName: req.body.LastName,
                email: req.body.Email,
                password: HashPassword
        })
        res.redirect('/login')
       
    } catch(err){
        res.redirect('/register')
    }
})

app.delete("/logout",(req, res, next)=>{
    req.logOut((err)=>{
        if(err) {
            return next(err)
        }
    })
    res.redirect('/login')
})

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
     return next()
}

app.listen(3000)