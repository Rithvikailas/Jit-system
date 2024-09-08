const mongoose = require('mongoose');

const connectToServer = (callback) => {
    mongoose.connect('mongodb+srv://Delta_jit:<Delta_jit>@jitsystem.rahki.mongodb.net/?retryWrites=true&w=majority&appName=jitsystem', {
    }, callback);
};

module.exports = { connectToServer };
