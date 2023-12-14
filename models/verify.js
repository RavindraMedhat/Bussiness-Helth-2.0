const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    Email : String,
    otp : String,
},{
    timestamps: true
});

const Otp = mongoose.model('Otp', OtpSchema);

module.exports = Otp;