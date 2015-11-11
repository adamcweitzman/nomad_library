var express = require('express');
var router = express.Router();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Books = require('../model/book');
var User = require('../model/user');
var jwt = require('jsonwebtoken');
var config = require('../config');
var bcrypt = require('bcrypt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Nomad Library' });
});

router.get('/new', function(req, res) {
  res.render('new');
})

router.get('/login', function(req, res) {
  res.render('login');
//    // User.findOne({'name': name }, function(err, users) {
//    //    console.log(users);
//    // }
});

// route middleware to verify a token
router.get('/*' , function(req, res, next) {
  console.log('in all routes');
  // decode token
  if (globalToken.token) {

    var token = { body: globalToken.token }

    // verifies secret and checks exp
    jwt.verify(token.body, 'ilovescotchyscotch', function(err, decoded) {      
      if (err) {
        console.log(token)
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
        console.log('authenticated token')
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

router.get('/profile', function(req, res, next) {
  res.render('profile');
  console.log(req.headers.cookie)
  console.log(globalToken)
});

router.get('/books', function(req, res, next) {
	Books.find({}, function(err, books){
		var books = books
		res.json(books)
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
    console.log('User saved successfully');
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

    console.log('User Saved!');
    res.render('login');
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
          console.log(req.headers.cookie)

          globalToken = { token: token, name: req.body.name }
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        }
      });

    }
  });

});   

module.exports = router;




