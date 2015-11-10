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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Nomad Library' });
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
  
router.get('/new', function(req, res) {
  res.render('new')
})

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
    res.json({ success: true });
  })
});

router.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

router.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, config.secret, {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   

    }

  });
});   

module.exports = router;




