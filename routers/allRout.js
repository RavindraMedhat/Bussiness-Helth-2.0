const express = require('express');
const userRout = require('./userRout');
const detailsRout = require('./detailsRout');
const companyRout = require('./companyRout');
const indicatorRout = require('./indicatorRout');
const jwt = require("jsonwebtoken");
const app = express();



const verifyUser = (req,res,next)=>{
    const t = req.cookies.BHC;
    if(t){
        jwt.verify(t,"RKM",(err,decode)=>{
            if(err){
                res.redirect("/user/login");
            }
            req.data = decode.data;
            console.log("req.data");
            console.log(req.data);
            next();
    });
    }else{
        res.redirect("/user/login");
    }
}

const verifyAdmin = (req,res,next)=>{
    const t = req.cookies.BHC;
    if(t){
        jwt.verify(t,"RKM",(err,decode)=>{
            if(err || decode.data.Roal != "Admin"){
                res.redirect("/user/login");
            }
            req.data = decode;
            next();
    });
    }else{
        res.redirect("/user/login");
    }
}


// const verify = (req, res, next) => {
//     if (req.session.data) {
//         next();
//     } else {
//         res.redirect("/user/login");
//     }
// };
// const isAdmin=(req, res, next) => {
//     if (req.session.data.Roal === "Admin") {
//         next();
//     } else {
//         res.redirect("/user/login");
//     }
// };

app.use("/user",userRout);
app.use("/detail",detailsRout);
app.use("/Company",verifyUser,companyRout);
app.use("/indicator",verifyAdmin,indicatorRout);

app.use((req,res)=>{
    console.log(req.url);
    res.redirect("/Company/companyList");
})
module.exports=app;