var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  year: String,
  cover_url: String,
  publisher: String,
  user_ids: Array,
  picture_history: String,
  for_trade: Boolean,
  location_ids: Array
});

var Book = mongoose.model('Books', bookSchema);
// Make this available to our other files
module.exports = Book;
