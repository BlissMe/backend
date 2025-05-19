const express = require("express");
const router = express.Router();
// const { verifyToken } = require('../middleware/auth');

const blissmeRoutes = require("./blissme.route")

// router.use(verifyToken);

router.use("/blissme",
    blissmeRoutes
);

router.use((err, req, res, next) => {
    res.status(500).send({ message: err.message })
})

module.exports = router;
