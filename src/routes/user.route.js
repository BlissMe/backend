const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const verifyDoctor = require("../middleware/doctorauth");

router.post("/preferences", auth, userController.setPreferences);
router.patch("/preferences/nickname", auth, userController.updateNickname);
router.patch("/preferences/character", auth, userController.updateVirtualCharacter);
router.patch("/preferences/input-mode", auth, userController.updateInputMode);
router.get("/get-preferences", auth, userController.getPreferences);
router.put("/update-preferences", auth, userController.updatePreferences);
router.get("/all-preferences", verifyDoctor, userController.getAllPreferences);

module.exports = router;
