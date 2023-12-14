const express = require('express')
const app = express()
const user = require("../models/Users");

app.get('/', async (req, res) => {
    try {
      // Replace this with your authentication logic (e.g., check if the user is logged in)
      const userId = req.data._id; // You need to get the user ID dynamically
  
      // Fetch user details from the database based on the user ID
      const User = await user.findById(userId);
  
      // Render the profile page with user information
      res.render('profile', {
        userEmail: User.Email,
        companyName: User.CompanyName,
        contactPerson: User.ContactPerson,
        mobileNumber: User.MobileNumber,
    });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = app;