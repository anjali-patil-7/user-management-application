const User = require("../models/User")

exports.getProfile = async (req,res)=>{
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
}
exports.updateProfile = async(req,res)=>{
    const user = await User.findById(req.user.id)

    if(user){
        user.name = req.body.name || user.name
        if(req.file) user.profileImage = req.file.path

        const updateUser = await user.save()
        res.json(updateUser)
    }
}