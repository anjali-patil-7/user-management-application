const express = require("express")
const router = express.Router()
const adminController = require("../Controllers/adminController")
const { protect, admin } = require("../middlewares/authMiddleware")

// 📊 DASHBOARD
router.get("/dashboard", protect, admin, adminController.getDashboard)

// 👥 USER MANAGEMENT
router.route("/users")
  .get(protect, admin, adminController.getAllUsers)   // Get all users
  .post(protect, admin, adminController.createUser)  // Create user

router.route("/users/:id")
  .get(protect, admin, adminController.getSingleUser) // Get single user
  .put(protect, admin, adminController.updateUser)
  .delete(protect, admin, adminController.deleteUser)

router.patch("/users/:id/toggle-block", protect, admin, adminController.toggleBlockUser)

module.exports = router



