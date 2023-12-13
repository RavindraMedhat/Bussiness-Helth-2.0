const express = require('express');
const userRout = require('./userRout');
const detailsRout = require('./detailsRout');
const companyRout = require('./companyRout');
const indicatorRout = require('./indicatorRout');
const app = express();


const verify = (req, res, next) => {
    if (req.session.data) {
        next();
    } else {
        res.redirect("/user/login");
    }
};
const isAdmin=(req, res, next) => {
    if (req.session.data.Roal === "Admin") {
        next();
    } else {
        res.redirect("/user/login");
    }
};

app.use("/user",userRout);
app.use("/detail",detailsRout);
app.use("/Company",verify,companyRout);
app.use("/indicator",verify,isAdmin,indicatorRout);

app.use((req,res)=>{
    res.redirect("/Company/companyList");
})
module.exports=app;