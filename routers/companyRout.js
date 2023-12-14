const express = require('express')
const app = express();
// const moment = require('moment');
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');

const Indicator = require('../models/indicators');  
const Rating = require('../models/ratings');

app.get("/companyList", async (req, res) => {

    function calculateOverallScore(data) {
        let totalScore = 0;
        let totalIndicators = 0;

        // Loop through each area
        data.forEach(area => {
            // Loop through each performance indicator
            area.PerformanceIndicators.forEach(indicator => {
                totalScore += indicator.rating;
                totalIndicators += 1;
            });
        });

        // Calculate overall score (average rating)
        const overallScore = totalIndicators > 0 ? (totalScore / totalIndicators).toFixed(2) : 0;
        return overallScore;
    }

    try {
        
        if (req.data.Roal === "Admin" || req.data.Roal === "Team member") {
            if (req.query.str != null) {
                var cn = req.query.str;

                cn = cn.replace(/^\s+|\s+$/g, "");


                const companies = await Rating.find({ CompanyName: { $regex: cn, $options: 'i' } }).sort({ timestamps: 1 }).sort({companyName:1});
                var overallScore = 0;
                var i = 0;

                const formattedRatings = companies.map(rating => ({
                    id: rating._id,
                    CompanyName: rating.CompanyName,
                    formattedTimestamp: moment(rating.timestamps).tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss'),
                    overallScore: calculateOverallScore(rating.Data),
                }));
                res.render('companyList', { companies: formattedRatings, isAdmin: true });

            } else {

                const ratings = await Rating.find().sort({ timestamps: -1 });
                const last10Ratings = ratings.slice(0, 10);

                const formattedRatings = last10Ratings.map(rating => ({
                    id: rating._id,
                    CompanyName: rating.CompanyName,
                    formattedTimestamp: moment(rating.createdAt).tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss'),
                    overallScore: calculateOverallScore(rating.Data),
                }));

                res.render('companyList', { companies: formattedRatings, isAdmin: true });
            }

        } else if (req.data.Roal === "Customer") {

            const companyName = req.data.CompanyName;
            const ratings = await Rating.find({ CompanyName: companyName }).sort({ timestamps: 1 });

            const formattedRatings = ratings.map(rating => ({
                id: rating._id,
                CompanyName: rating.CompanyName,
                formattedTimestamp: moment(rating.createdAt).tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss'),
                overallScore: calculateOverallScore(rating.Data),
            }));

            res.render('companyList', { companies: formattedRatings, isAdmin: false, CompanyName: companyName });

        } else {
            res.status(403).send("Unauthorized");
        }
    } catch (error) {
        console.error("Error fetching ratings:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/addRating",async (req,res)=>{
    const indicators = await Indicator.find().sort({area : 1});
    res.render('AddRating', { indicators: indicators });
});

app.post('/submit-ratings', async (req, res) => {
    

    const transformedData = [];

    // Extract the company name
    const companyName = req.data.CompanyName;
    const indicators = await Indicator.find().sort({area : 1});
    // Loop through the indicatorsData array and create the desired structure
    indicators.forEach((item, index) => {
        const area = item.area;
        const performanceIndicator = item['performanceIndicator'];
        const rating = parseInt(req.body[`rating-${index}`]);

        // Find or create the data object for the current area
        let areaData = transformedData.find((data) => data.Area === area);
        if (!areaData) {
            areaData = { Area: area, PerformanceIndicators: [] };
            transformedData.push(areaData);
        }
        // Add the performance indicator and rating to the area data
        areaData.PerformanceIndicators.push({
            Performance_Indicator: performanceIndicator,
            rating: rating,
        });
    });

    // Create the final data object
    const finalData = {
        CompanyName: companyName,
        Data: transformedData,
    };
    

    try {
        const data = new Rating(finalData);
        data.save().then((savedata)=>{
           
            sendEmail(req.data.Email,req.data.CompanyName,savedata._id);
            res.redirect('/detail/'+savedata._id);
        });
    } catch (err) {
        console.log(err);
        res.redirect('/NotAdded');

    }

});

async function sendEmail(email,companyName,id) {
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
            subject: 'New Ratings Submitted',
            text: `New ratings have been submitted for ${companyName}.\n For details :- https://business-health.cyclic.app/detail/${id}`,
        };

        // Send email
        await transporter.sendMail(mailOptions); 
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = app;