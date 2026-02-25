const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const { protect } = require("../middlewares/authMiddleware")
const { profileUpdateValidation } = require("../middlewares/validationMiddleware")
const { validationResult } = require("express-validator")
const upload = require("../middlewares/uploadMiddleware")
const cloudinary = require("../Config/cloudinary")

//**profile update (name,email,profile image)
router.put(
  "/profile",
  protect,
  upload.single("profileImage"),
  profileUpdateValidation,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const user = await User.findById(req.user.id)

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      // Update name & email
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.bio = req.body.bio || user.bio

      //If image uploaded
      if (req.file) {
        const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
          folder: "profile_images",
          transformation: [{ width: 300, height: 300, crop: "fill", gravity: "auto" }],
        })

        user.profileImage = uploadedImage.secure_url
      } else if (req.body.removeImage) {
        user.profileImage = ""
      }

      const updatedUser = await user.save()

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        token: req.headers.authorization.split(" ")[1],
      })
    } catch (error) {
      console.error(error)
      res.status(400).json({ message: error.message || "Error updating profile" })
    }
  }
)



//*** CHANGE PASSWORD */
router.put("/change-password", protect, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "user not found" })
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "old password incorrect" })
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "password must be at least 6 characters" })
    }
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    await user.save()

    res.json({ message: "password updates successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "server Error" })
  }
})

module.exports = router
