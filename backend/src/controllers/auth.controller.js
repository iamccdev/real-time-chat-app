import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body
  try {

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    //hass password
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const user = await User.findOne({ email })


    if (user) return res.status(400)({ message: "Email already exists" });
    const salt = await bcrypt.genSalt(10)


    const hashedPassword = await bcrypt.hash(password, salt)


    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    })


    if (newUser) {
      generateToken(newUser._id, res)

      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      })

    } else {
      res.status(400).json({ message: "Invalid user data" })
    }
  }
  catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" })
  }

};
export const login = async (req, res) => {

  const { password, email } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ messagge: "invalidad credentialds" })

    const passIsCorrect = await bcrypt.compare(password, user.password)
    if (!passIsCorrect) return res.status(400).json({ messagge: "invalidad credentialds" })
    generateToken(user._id, res)
    
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic
    })
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" })
  }
};
export const logout = (req, res) => {

  try {
    res.cookie("jwt", "", {maxAge: 0})
    res.status(200).json({message: "Logged out succesfully"})
  } catch (error) {
    console.log("Error in logout Controller", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }

};

export const updateProfile = async (req, res) =>{
  try {
    const {profilePic} = req.body
    const userId = req.user._id

    if(!profilePic){
      return res.status(400).json({message: "Profile pic is requird"})
    }
    const uploadRespone = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadRespone.secure_url}, {new: true})
    res.status(200).json(updatedUser)
  } catch (error) {
    console.log("Error in updateProfile Controller", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const checkAuth = (req, res) =>{
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.log("Error in checkAuth Controller", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}