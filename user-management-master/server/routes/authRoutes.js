const express = require("express")
const {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
} = require("../Controllers/authController")

const { registerValidation, loginValidation } =
  require("../middlewares/validationMiddleware")

const router = express.Router()

router.post("/register", registerValidation, registerUser)
router.post("/login", loginValidation, loginUser)
router.post("/refresh", refreshToken)
router.post("/logout", logoutUser)

module.exports = router