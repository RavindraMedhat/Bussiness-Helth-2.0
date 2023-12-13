const express = require('express')
const app = express()
const user = require("../models/Users");
const jwt = require("jsonwebtoken");

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    try {
        const newUser = new user({
            Email: req.body.email,
            Password: req.body.password,
            CompanyName: req.body.companyName,
            ContactPerson: req.body.contactPerson,
            MobileNumber: req.body.mobileNumber,
        });
        newUser.Roal = "Customer";
        // Save the user to the database
        const savedUser = await newUser.save();

        res.redirect("./login");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get("/login", (req, res) => {
    res.render("login", { errorMessage: "" });
})

app.post("/login", (req, res) => {
    const { Email, Password } = req.body;

    user.findOne({ Email: { $regex: new RegExp(Email, 'i') } })
        .then((data) => {

            if (!data || data.Password !== Password) {
                return res.render("login", { errorMessage: "Invalid email or password" });
            } else {
                req.data = data;
                // res.redirect("/Company/companyList");
                
                const t =  jwt.sign({data : data },"RKM",{expiresIn : "1h"});
                res.cookie("BHC",t);
                res.redirect("/Company/companyList");

            
            }

        })
        .catch((error) => {
            console.error("Error during login:", error);
            res.status(500).send("Internal Server Error");
        });
});

app.get("/logout", (req, res) => {
    res.cookie("BHC",null);
    res.redirect("/user/login")
});

module.exports = app;