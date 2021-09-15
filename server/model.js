const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_CONNECTION_STRING);

const Menu = mongoose.model('Menu', { 
  name: String,
  price: Number,
});

module.exports = {
  Menu,
}
