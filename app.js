//npm
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//js files
var Campground = require("./models/campground");
var User = require("./models/user");
var Comments = require("./models/comment");
var seedDB = require("./seeds");
seedDB();
//variables
var username = "";
var password = "";
//db
mongoose.connect("mongodb://localhost:27017/YelpCamp", { useNewUrlParser: true });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");





//landing login 
app.get("/", function(req, res) {
    res.render("landing");
});
//validate login
app.post("/", function(req, res) {
    username = req.body.username.toString();
    password = req.body.password.toString();
    console.log("form username " + username + "password " + password);
    User.findOne({ username: username, password: password }, function(err, result) {
        if (err) {
            console.log(err);
            console.log("notfound");
            res.render("campgrounds/landing", { err: err });
        } else if (result) {
            res.redirect("/campgrounds");
        } else {
            res.render("landing", { err: err });
            console.log("invalid");
        }
    })
});

//index show all campgrounds
app.get("/campgrounds", function(req, res) {
    //get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            //render index ejs with allcampgrounds found
            res.render("campgrounds/index", { campgrounds: allCampgrounds })
        }
    });
    // res.render("campgrounds", { campgrounds: campgrounds });
});

//Create - add new campground to db
app.post("/campgrounds", function(req, res) {
    //get all form info and posting to new campground created
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = { name: name, image: image, description: description };
    //insert newcampground into the database
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to the campground page
            res.redirect("/campgrounds");
        }
    });
});

//New -show form to create new campground
app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new")
});

//Show - shows more info about one campground
app.get("/campgrounds/:id", function(req, res) {
    //find the campground with id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //call shows ejs to display campground selected with id
            res.render("campgrounds/shows", { campgrounds: foundCampground });
        }
    });
});


//Update
app.put("/campgrounds/:id", function(req, res) {

});
//delete
app.delete("/campgrounds/:id", function(req, res) {

});
//edit
app.get("/campgrounds/:id/edit", function(req, res) {

});

//================ Comments =========================================
//new
app.get("/campgrounds/:id/comments/new", function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        // body... 

        if (err) {
            console.log(err)
        } else {
            // statement
            console.log(foundCampground);
            res.render("comments/new", { campground: foundCampground });
        }


    });


});
//create
app.post("/campgrounds/:id/comments/", function(req, res) {

Campground.findById(req.params.id, function (err,campground) {
    if (err) {
        console.log(err);
        res.redirect("/campgrounds");
    } else {
        Comments.create(req.body.comment, function (err,comment) {
            if (err) {
                console.log(err);
            } else {
                console.log(comment);
                campground.comments.push(comment);
                campground.save();
                res.redirect("/campgrounds/"+campground._id);
            }
        })
    }
    /* body... */
})
});
//=============================================










app.listen(3000, function() {
    console.log("server is running");
});