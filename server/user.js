const mongoose = require('mongoose');
const user = new mongoose.Schema({
    userName: String,
    history: [
        {
          score: Number,
          date: Date,
        }
    ]
});

module.exports = mongoose.model('User', user);