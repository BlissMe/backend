const router = require("express").Router();

router.post("/details", (req, res) => {
  const { virtualName, character, inputMethod } = req.body;

  if (!virtualName || !character || !inputMethod) {
    return res.status(400).json({ error: "Missing fields" });
  }
  console.log("Received virtual user:", { virtualName, character, inputMethod });
  res.status(200).json({ message: "User saved successfully" });
});

module.exports = router;
