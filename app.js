const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const User = require("./models/user");
const session = require("express-session");
const seedDB = require("./seeds");
const methodOverride = require("method-override");
const port = process.env.PORT || 3000;
//requiring routes
const commentRoutes    = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const indexRoutes      = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));

// seedDB(); //seed the database

//=============================
//=====PASSPORT CONFIG=========
//=============================
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=============================
//=========MIDDLEWARE==========
//=============================
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//=============================
//=====IMPORT   ROUTES=========
//=============================
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


//=============================
//= App Begins Listening Here =
//=============================
app.listen(port, process.env.IP, function(){
    console.log(`Server listening at http://localhost:${port}`);
    console.log('use Ctrl-C to stop this server');
    console.log("The YelpCamp Server Has Started!");
});

module.exports = app;