var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.get("/campgrounds", (req, res) => {
    Campground.find({}, (error, campgroundsList) => {
        if(error)
            console.log(error.message);
        else 
            res.render("index", {campgrounds: campgroundsList});
    })
})

app.get("/",(req, res) => {
    res.render("landingPage");
})

app.post("/campgrounds", (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let newCampground = {name: name, image: image, description: desc};
    Campground.create(newCampground, (error, campground) => {
        if(error)
            console.log(error.message);
        else 
            res.redirect("/campgrounds");
    })
})

app.get("/campgrounds/new", (req, res) => {
    res.render("newCampground");
})

app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id, (error, findCampground) => {
        if(error)
            console.log(error);
        else{
            res.render("show",{campground: findCampground})
        }
    })
})

app.get("*", (req,res) => {
    res.send("<h1 style='text-align: center;'>Error 404</h1>")
})

app.listen(3000, () => {
    console.log("listening to port 3000")
})