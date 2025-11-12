const express = require("express");
const {
    handleGetAllTherapies,
    handleGetTherapiesByLevel,
    handleAddTherapy,
} = require("../controllers/therapyListController");

const router = express.Router();

router.get("/", handleGetAllTherapies);
router.get("/:level", handleGetTherapiesByLevel);
router.post("/", handleAddTherapy);

module.exports = router;
