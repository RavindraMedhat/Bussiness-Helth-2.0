const express = require('express')
const app = express()
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

const randomstring = require('randomstring');
const user = require("../models/Users");
const verify = require("../models/verify");

app.get('/register', (req, res) => {
    res.render('verifyEmail',{Email : "",errorMessage:""});
});

app.post('/register', async (req, res) => {
    try {
        if(req.body.password){
            const newUser = new user({
                Email: req.body.email,
                Password: req.body.password,
                CompanyName: req.body.companyName,
                ContactPerson: req.body.contactPerson,
                MobileNumber: req.body.mobileNumber,
                Roal : "Customer",
                isVerify : false, 
            });
            
            // Save the user to the database
            const savedUser = await newUser.save();
            
            res.redirect("./login");
        }else if(req.body.email  && req.body.otp){

            verify.findOne({Email : req.body.email})
            .then((data)=>{
                console.log(data);
                console.log(req.body.email);

                if(data && data.otp == req.body.otp){
                    verify.deleteOne(data);
                    res.render("register",{Email : data.Email});
                }else{
                    res.render("verifyEmail",{Email : req.body.email , errorMessage:"Invalid email or otp"});
                }
            });
        }

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

app.get("/sendOTP",(req,res)=>{

    var Email = req.query.email;

    const otp = randomstring.generate({
        length: 6,
        charset: 'numeric',
      });


    const v = new verify({Email:Email,otp:otp});
    
    v.save().then((data)=>{
        console.log(data);
        sendEmail(data.Email,data.otp);
    })
        
    

    res.send("otp sent");
});


async function sendEmail(email,otp) {
    try {
        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mazzking666@gmail.com',  // replace with your Gmail email address
                pass: 'xctj naln sjnj gjsv',  // replace with your Gmail password
            },
        });
        
        // Email content
        const mailOptions = {
            from: 'mazzking666@gmail.com',  // replace with your Gmail email address
            to: email,  // replace with the recipient's email address
            subject: 'Verify Your Email',
            text: `OTP For Verify Your Email : - ${otp}`,
        };
        // Send email
        await transporter.sendMail(mailOptions); 
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}


module.exports = app;