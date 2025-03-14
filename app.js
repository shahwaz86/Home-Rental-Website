if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const methodOverride = require("method-override");
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");
const sessions = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/reviews.js");
const userRoutes = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

const dbUrl =process.env.ATLAS_DB_URL

main().then(() => {
  console.log("connected to db");
})
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret: process.env.SECRET
  },
  touchAfter: 24 * 3600,
});

store.on("error", () =>{
  console.log("ERROR OCCOURED IN MONGO ATLAS", err);
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1 * 24 * 60 * 60 * 1000,
    maxAge: 1 * 24 * 60 * 60 * 1000,
    httpOnly : true,
  }
}



// app.get("/", (req, res) => {
//   res.send("Hii i am root");
// });

app.use(sessions(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});



app.use("/listing", listingRoutes)
app.use("/listing/:id/reviews", reviewRoutes);
app.use("/", userRoutes);


app.all("*", (req, res) => {
  throw new ExpressError(404, "page not found");
  // next(err);
})

app.use((err, req, res, next) => {
  let { statusCode = 500, message } = err;
  res.status(statusCode).render("./listings/error.ejs", { message });
});

app.listen(port, () => {
  console.log("listening on the port");
});