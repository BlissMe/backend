require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
require("./passport");
const app = express();
app.use(express.json());

const authRoute = require("./src/routes/userGoogleAccount.route");
const userRoute = require("./src/routes/userDetails.route");
const userAuthRoute = require("./src/routes/userAuth.route");
const chatRoutes = require("./src/routes/chat.route");
const sessionRoutes = require("./src/routes/session.route");
const sessionSummary = require("./src/routes/sessionSummary.route");

// Use CORS middleware before routes
app.use(
  cors({
    origin: "http://localhost:3000",  // Allow the frontend origin
    methods: "GET,POST,PUT,DELETE",  // Allowed HTTP methods
    credentials: true,  // Allow credentials (cookies)
  })
);

app.use(
  session({
    secret: "xzcbnxncdhvbfhncxbnvbcfhv", // use a strong secret in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoute);
app.use("/user", userRoute)
app.use("/authuser", userAuthRoute)
app.use("/chat", chatRoutes);
app.use("/session", sessionRoutes);
app.use("/sessionSummary", sessionSummary);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
