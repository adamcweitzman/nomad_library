var express = require('express');
var router = express.Router();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Book = require('../model/book');
var User = require('../model/user');
var jwt = require('jsonwebtoken');
var config = require('../config');
var bcrypt = require('bcrypt');
var Location = require('../model/location');
var user_id = "";
var location_ids = "";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Nomad Library' });
});

router.get('/new', function(req, res) {
  res.render('new');
})

router.get('/login', function(req, res) {
  res.render('login', {name: "hi"});
});

router.get('/logout', function(req,res,next) {
  globalToken.token = ""
  res.redirect('login')
});

router.get('/books', function(req, res, next) {
  Book.find({}, function(err, books){
    var books = books
    res.json(books)
  });
});

router.get('/library', function(req, res, next) {
  Location.find({'name': 'saigon'}, function(err, locations) {
    console.log(locations[0].picture_url, 'this is the picture URL');
    res.render('library',{picture: locations[0].picture_url,});
  });
});


// route middleware to verify a token
router.get('/*' , function(req, res, next) {

  if (globalToken.token) {

    var token = { body: globalToken.token }


    jwt.verify(token.body, config.secret, function(err, decoded) {      
      if (err) {

        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {

        req.decoded = decoded;
 
        next();

      }
    });

  } else {

    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

router.get('/profile/:name', function(req, res, next) {
  user_id = req.decoded._id
  User.findOne({'name': req.decoded.name}, function(err, users) {
    Book.find({'user_ids': user_id}, function(err, books) {
      res.render('profile', {name: req.decoded.name, books: books});
    });
  });
});

// create a sample user
router.get('/setup', function(req, res) {
  var nick = new User({ 
    name: 'nick', 
    password: 'nick',
  });
  // save the sample user
  nick.save(function(err) {
    if (err) throw err;
    res.json({ success: true });
  });
});
  

// create new user from params
router.post('/new_user', function(req, res) {
  var user = new User({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    age: req.body.age,
    nationality: req.body.nationality,
    picture_url: req.body.picture_url,
  });

  user.save(function(err){
    if (err) throw err;
    res.render('login', {name: "hi"});
  })
});

router.post('/new_book', function(req, res) {
  console.log(req.body.locations)

  var book = new Book({
    title: req.body.title,
    author: req.body.author,
    year: req.body.year,
    cover_url: req.body.cover_url,
    publisher: req.body.publisher,
    picture_history: req.body.picture_url,
    for_trade: req.body.for_trade,
    user_ids: user_id,
    location_ids: req.body.locations
  });
    book.save(function(err){
    if (err) throw err;
    res.redirect('/profile/' + globalToken.name)
  })

});

router.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

router.post('/authenticate', function(req, res) {
  var name = req.body.name;
  var password = req.body.password;

  User.findOne({
    name: name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    }
    else if (user) {

      bcrypt.compare(password, user.password, function(err, result) {
        if (!result) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        }
        else {
          // if user is found and password is right
          // create a token
          var token = jwt.sign(user, config.secret, {
            expiresInMinutes: 1440 // expires in 24 hours
          });

          req.headers.cookie = req.body.name

          globalToken = { token: token, name: req.body.name }

          res.redirect('/profile/' + globalToken.name)
        }
      });

    }
  });

});   

module.exports = router;




