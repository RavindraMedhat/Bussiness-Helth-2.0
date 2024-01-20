const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const allRout = require("./routers/allRout");
const port = process.env.PORT || 7485;


const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://test:74857485@cluster0.3snq0fm.mongodb.net/BussinessHelthDatabase');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB database');
});

app.use("/public", express.static("public"));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());


app.use((req, res, next) => {
    console.log("New Request");
    console.log("url : -" + req.hostname + req.url);
    next();
})

app.use(allRout);

app.listen(port, () => {
    console.log(`Server is running on https://business-health.cyclic.app/`);
    console.log(`Server is running on http://localhost:7485`);
});
