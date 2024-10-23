import User from "../models/userModel.js"
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import generateTokenAndSetCookie from '../utils/generateTokenAndSetCookie.js';

const signupUser = async(req, res) => {
    try {   
        const { email, userName, password } = req.body

        const user = await User.findOne({ $or:[{email}, {userName}] })
        if(user) {
            res.status(400).json({ error:"User already exists with the email or username"})
            return;
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            email, 
            password:hashPassword, 
            userName,
        })
        const savedUser = await newUser.save()
        if(savedUser){
            generateTokenAndSetCookie(savedUser._id, res)
            res.status(201).json({
                _id:savedUser._id,
                email:savedUser.email,
                userName:savedUser.userName,  
            })
        }
        else{
            res.status(400).json("Invalid user data")
        }
    } catch (error) {
        res.status(500).json({ error })
        console.log("Error in signup user:", error)
    }
}

const signinUser = async(req, res) => {

    try {
        const { userName, password } = req.body
        const user = await User.findOne({ userName })
        if(!user){
            res.status(404).json("Username doesn't exist")
            return
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect) {
            res.status(401).json("Invalid credentials")
            return
        }

        generateTokenAndSetCookie(user._id, res)


        res.status(201).json({
            _id:user._id,
            email:user.email,
            userName:user.userName,
        })

    } catch (error) {
        res.status(500).json({ error })
        console.error("Error signing in user :", error)
    }
}

const signoutUser = async(req, res) => {
    try {
        res.cookie("token", "", { maxAge:1 })
        res.status(201).json("User signed out successfully!")
    } catch (error) {
        res.status(500).json({ error })
        console.log("Error in signing out user:", error)
    }
}

export { signupUser, signinUser, signoutUser }
