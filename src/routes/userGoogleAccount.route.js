const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// On success, generate JWT and redirect to frontend with token
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login/failed" }),
  (req, res) => {
    const token = jwt.sign(
      { email: req.user.email },
      process.env.ACCESS_TOKEN,
      { expiresIn: "8h" }
    );

res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
  }
);

router.get("/login/failed", (req, res) => {
  res.status(401).json({ message: "Google login failed" });
});

module.exports = router;
