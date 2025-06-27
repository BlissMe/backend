const express = require("express");
const router = express.Router();
// const { verifyToken } = require('../middleware/auth');

const blissmeRoutes = require("./blissme.route");
const userRoutes = require("./user.route");

// router.use(verifyToken);

router.use("/blissme",
    blissmeRoutes,
    userRoutes
);

router.use((err, req, res, next) => {
    res.status(500).send({ message: err.message })
})

module.exports = router;
