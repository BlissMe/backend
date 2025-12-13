require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
require("./passport");
const app = express();
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const authRoute = require("./src/routes/userGoogleAccount.route");
const userAuthRoute = require("./src/routes/userAuth.route");
const chatRoutes = require("./src/routes/chat.route");
const sessionRoutes = require("./src/routes/session.route");
const sessionSummary = require("./src/routes/sessionSummary.route");
const phq9Questions = require("./src/routes/phq9.route");
const indexRoutes = require("./src/routes/index.route");
const therapyRoutes = require("./src/routes/therapy.route");
const moodRoutes = require("./src/routes/mood.route");
const classifierRoutes = require("./src/routes/classifierResult.route");
const assessmentRoutes = require("./src/routes/levelDetection.router");
const doctorRoutes = require("./src/routes/doctor.route");
const doctorAuthRoutes = require("./src/routes/doctorAuth.route");
const therapyListRoutes = require("./src/routes/therapyList.route");
const smsRoutes = require("./src/routes/mSpaceSms.route");
const subscriptionRoutes = require("./src/routes/subscription.route");
// Use CORS middleware before routes
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "https://blissme.vercel.app", "https://doctor-portal-phi.vercel.app", "https://blissme-v2.vercel.app", "https://blissme-v1.vercel.app", "https://blissme-v3.vercel.app"],
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);

app.use(
  session({
    secret: "xzcbnxncdhvbfhncxbnvbcfhv",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoute);
app.use("/authuser", userAuthRoute);
app.use("/chat", chatRoutes);
app.use("/session", sessionRoutes);
app.use("/sessionSummary", sessionSummary);
app.use("/phq9", phq9Questions);
app.use("/api", indexRoutes);
app.use("/therapy", therapyRoutes);
app.use("/moods", moodRoutes);
app.use("/classifier", classifierRoutes);
app.use("/levelDetection", assessmentRoutes);
app.use("/doctorlevel", doctorRoutes);
app.use("/doctorAuth", doctorAuthRoutes);
app.use("/api/therapyList", therapyListRoutes);
app.use("/sms", smsRoutes);
app.use("/mspace", subscriptionRoutes);


app.get("/", (req, res) => {
  res.send("Welcome to Blissme App!");
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
