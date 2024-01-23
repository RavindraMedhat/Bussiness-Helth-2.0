const express = require('express');
const userRout = require('./userRout');
const detailsRout = require('./detailsRout');
const companyRout = require('./companyRout');
const profileRout = require('./profileRout');
const indicatorRout = require('./indicatorRout');
const jwt = require("jsonwebtoken");
const app = express();



const verifyUser = (req, res, next) => {
    const t = req.cookies.BHC;
    if (t) {
        jwt.verify(t, "RKM", (err, decode) => {
            if (err) {
                res.redirect("/user/login");
            }
            req.data = decode.data;
            next();
        });
    } else {
        res.redirect("/user/login");
    }
}

const verifyAdmin = (req, res, next) => {
    const t = req.cookies.BHC;
    if (t) {
        jwt.verify(t, "RKM", (err, decode) => {
            if (err || decode.data.Roal != "Admin") {
                res.redirect("/Company/companyList");
            }
            req.data = decode;
            next();
        });
    } else {
        res.redirect("/user/login");
    }
}

app.use("/user", userRout);
app.use("/detail", detailsRout);
app.use("/profile", verifyUser, profileRout);
app.use("/Company", verifyUser, companyRout);
app.use("/indicator", verifyAdmin, indicatorRout);

app.get('/InvestFlow_Navigator', verifyUser, (req, res) => {

    res.render('InvestFlow_Navigator', {
        defaultInvestment: 100000,
        defaultIncomeTarget: 60000000
    });
});

app.use((req, res) => {
    console.log(req.url);
    res.redirect("/Company/companyList");
})

module.exports = app;