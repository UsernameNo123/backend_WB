import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';


const protectRoute = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            res.status(401).json({ message:"Unauthorized"})
            return;
        }
        const jwtSecret = process.env.JWT_SECRET
        if(!jwtSecret) throw new Error("JWT Secret is not defined");

        const decoded = jwt.verify(token, jwtSecret)
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            res.status(401).json("Unauthorized: User not found");
            return;
        }

        req.user = user;
        next();

    } catch (error) {
        if(error instanceof jwt.JsonWebTokenError){
            res.status(401).json("Unauthorized: Invalid token");
        }
        else{
            res.status(500).json({ error });
        }
        console.error("Error in protectRoute:",error)
    }
}

export default protectRoute;