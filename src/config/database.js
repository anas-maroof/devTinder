const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://anas_maroof:INWP1uyq6NA7NblT@namastenode.lbcjebi.mongodb.net/devTinder");
};

module.exports = connectDB;