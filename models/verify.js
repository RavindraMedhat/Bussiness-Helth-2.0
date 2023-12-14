const mongoose = require('mongoose');

const VerifySchema = new mongoose.Schema({
    Email : String,
    otp : String,
},{
    timestamps: true
});

const Verify = mongoose.model('Verify', VerifySchema);

module.exports = Verify;