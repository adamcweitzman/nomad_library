var express = require('express');
var router = express.Router();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Books = require('../model/book');

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

module.exports = router;
