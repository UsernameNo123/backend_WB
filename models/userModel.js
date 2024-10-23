import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    resetPasswordToken:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    }
}, { timestamps: true });


const User = mongoose.model('User', userSchema);
export default User;