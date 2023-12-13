const express = require('express')
const app = express()
const user = require("../models/Users");

app.get('/:id', (req, res) => {
    Rating.findById(req.params.id).then((data) => {

        res.render('details', { id : req.params.id ,Company : data.CompanyName });
    }).catch((error) => {
        console.log(error);
        res.send(data_for_graph);
    });
        
});

app.get('/data/:id', (req, res) => {
    console.log("data");
    var id = req.params.id;

    Rating.findById(id).then((data) => {

        console.log(data.Data);

        // Initialize an empty object to store the total rating and count for each area
        const areaStats = {};

        // Loop through the data to calculate the total rating and count for each area
        data.Data.forEach((area) => {
            const areaName = area.Area;
            const performanceIndicators = area.PerformanceIndicators;

            // Calculate the total rating for the area
            const totalRating = performanceIndicators.reduce((sum, indicator) => {
                return sum + indicator.rating;
            }, 0);

            // Calculate the count of performance indicators in the area
            const indicatorCount = performanceIndicators.length;

            // Calculate the average rating for the area
            const averageRating = indicatorCount > 0 ? totalRating / indicatorCount : 0;

            // Store the result in the areaStats object
            areaStats[areaName] = averageRating;
        });

        // Initialize an array to store the final result in the desired format
        const result = Object.keys(areaStats).map((areaName) => {
            return { department: areaName, count: areaStats[areaName].toFixed(2) };
        });

        console.log(result);

        // console.log(departmentCounts);

        res.send(result);

    }).catch((error) => {
        console.log(error);
        res.send(data_for_graph);
    });
});

module.exports = app;