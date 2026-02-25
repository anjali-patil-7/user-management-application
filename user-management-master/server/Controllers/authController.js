const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken")
const { validationResult } = require("express-validator")

// Register
exports.registerUser = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() })

  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })
  if (userExists)
    return res.status(400).json({ message: "User already exists" })

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  })

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage,
    role: user.role,
    accessToken,
  })
}

// Login
exports.loginUser = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() })

  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user)
    return res.status(400).json({ message: "Invalid credentials" })

  if (user.isDeleted) {
    return res.status(403).json({ message: "Your account has been deleted" })
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch)
    return res.status(400).json({ message: "Invalid credentials" })

  if (user.isBlocked) {
    return res.status(403).json({ message: "Your account has been blocked by admin" })
  }

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  })

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage,
    role: user.role,
    accessToken,
  })
}

// Refresh Token
exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken
  if (!token)
    return res.status(401).json({ message: "No refresh token" })

  jwt.verify(token, process.env.REFRESH_SECRET, async (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Invalid refresh token" })

    const user = await User.findById(decoded.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked" })
    }

    if (user.isDeleted) {
      return res.status(403).json({ message: "Your account has been deleted" })
    }

    const newAccessToken = generateAccessToken(user)

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
      accessToken: newAccessToken,
    })
  })
}

// Logout
exports.logoutUser = (req, res) => {
  res.clearCookie("refreshToken")
  res.json({ message: "Logged out successfully" })
}