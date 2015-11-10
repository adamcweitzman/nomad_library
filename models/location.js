var mongoose = require('mongoose');

var locationSchema = new mongoose.Schema({
  name: String,
  picture_url: String,
  email: Boolean,
  user_ids: Array,
  book_ids: Array
});

var Location = mongoose.model('Location', locationSchema);
// Make this available to our other files
module.exports = Location;
