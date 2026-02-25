const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// LOGIN
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && user.role === "admin" && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" }),
    })
  } else {
    res.status(401).json({ message: "Invalid admin credentials" })
  }
}

// LOGOUT
exports.logoutAdmin = async (req, res) => {
  res.json({ message: "Admin logged out successfully" })
}

// DASHBOARD
exports.getDashboard = async (req, res) => {
  const userCount = await User.countDocuments({ isDeleted: { $ne: true } })
  res.json({ totalUsers: userCount })
}

// GET ALL USERS (with Search & Pagination)
exports.getAllUsers = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 5
    const page = Number(req.query.page) || 1

    const keyword = req.query.search
      ? {
        role: { $ne: "admin" },
        isDeleted: { $ne: true },
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
      : { role: { $ne: "admin" }, isDeleted: { $ne: true } }

    const count = await User.countDocuments({ ...keyword })
    const users = await User.find({ ...keyword })
      .select("-password")
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 })

    res.json({
      users,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error fetching users" })
  }
}

// GET SINGLE USER
exports.getSingleUser = async (req, res) => {
  const user = await User.findById(req.params.id)
  res.json(user)
}

// CREATE USER
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, bio } = req.body

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      bio: bio || "",
    })

    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ message: error.message || "Error creating user" })
  }
}

// UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, role, bio } = req.body
    const updateData = { name, email, role, bio }

    if (password) {
      const salt = await bcrypt.genSalt(10)
      updateData.password = await bcrypt.hash(password, salt)
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password")

    res.json(user)
  } catch (error) {
    res.status(400).json({ message: error.message || "Error updating user" })
  }
}

// DELETE USER (Soft Delete)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json({ message: "User deleted successfully" })
  } catch (error) {
    res.status(400).json({ message: "Error deleting user" })
  }
}

// TOGGLE BLOCK USER
exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.isBlocked = !user.isBlocked
    await user.save()

    res.json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      isBlocked: user.isBlocked
    })
  } catch (error) {
    res.status(400).json({ message: "Error toggling user block status" })
  }
}

// REFRESH ADMIN TOKEN
exports.refreshAdminToken = async (req, res) => {
  const token = req.cookies.adminRefreshToken
  if (!token)
    return res.status(401).json({ message: "No admin refresh token" })

  jwt.verify(token, process.env.REFRESH_SECRET, async (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Invalid admin refresh token" })

    const user = await User.findById(decoded.id).select("-password")
    if (!user || user.role !== "admin") {
      return res.status(404).json({ message: "Admin not found" })
    }

    const { generateAccessToken } = require("../utils/generateToken")
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

