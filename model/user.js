var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: Boolean,
  age: String,
  nationality: String,
  picture_url: String,
  book_ids: Array,
  current_location: String
});

var User = mongoose.model('User', userSchema);
// Make this available to our other files
module.exports = User;

