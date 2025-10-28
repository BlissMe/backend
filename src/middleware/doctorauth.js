const jwt = require("jsonwebtoken");

const verifyDoctor = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    if (decoded.role !== "doctor")
      return res.status(403).json({ message: "Forbidden: Not a doctor" });

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = verifyDoctor;


