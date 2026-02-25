const jwt = require("jsonwebtoken")
const User = require("../models/User")

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer"))
      return res.status(401).json({ message: "No token provided" })

    const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET)

    req.user = await User.findById(decoded.id).select("-password")

    if (!req.user)
      return res.status(401).json({ message: "User not found" })

    if (req.user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked" })
    }

    if (req.user.isDeleted) {
      return res.status(403).json({ message: "Your account has been deleted" })
    }

    next()
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" })
  }
}

const admin = (req, res, next) => {
  if (req.user?.role === "admin") next()
  else res.status(403).json({ message: "Not authorized as admin" })
}

module.exports = { protect, admin }