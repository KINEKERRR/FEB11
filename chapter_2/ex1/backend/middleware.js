const jwt = require("jsonwebtoken");

const JWT_SECRET = "secret";

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Authorization required" });
  }

  const token = header.split(" ")[1];

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

function employerOnly(req, res, next) {
  if (req.user.role !== "employer") {
    return res.status(403).json({ message: "Access denied" });
  }

  next();
}

function applicantOnly(req, res, next) {
  if (req.user.role !== "applicant") {
    return res.status(403).json({ message: "Access denied" });
  }

  next();
}

module.exports = {
  authMiddleware,
  employerOnly,
  applicantOnly,
};