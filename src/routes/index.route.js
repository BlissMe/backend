const express = require("express");
const router = express.Router();
// const { verifyToken } = require('../middleware/auth');

const blissmeRoutes = require("./blissme.route");
const userRoutes = require("./user.route");
const characterRoutes = require("./character.route");

// router.use(verifyToken);

router.use("/blissme",
    blissmeRoutes,
    userRoutes,
    characterRoutes
);

router.use((err, req, res, next) => {
    res.status(500).send({ message: err.message })
})

module.exports = router;
