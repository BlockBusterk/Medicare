import jwt from "jsonwebtoken"
import Doctor from "../models/DoctorSchema.js"
import User from "../models/UserSchema.js"

export const authenticate = async (req, res, next) =>{
    const authToken = req.headers.authorization;
    

    //check token is exists 
    if(!authToken || !authToken.startsWith("Bearer ")){
        
        return res.status(401).json({success: false, message: "No token, authorization denied "})
    }
   try {
    console.log(authToken);
    const token = authToken.split(" ")[1];
     
    //verify token

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    req.userID = decoded.id
    req.role = decoded.role
    next(); //must be call the next fuction 
    
   } catch (error) {
    if(error.name == "TokenExpiredError"){
        res.status(401).json({ message: "Token is expired"})
    }
    return res.status(401).json({success: false, message: "Invalid token "+error.name})
   }
}

export const restrict = roles => async (req, res, next) =>{
    const userID = req.userID;
   
    let user;

    const patient = await User.findById(userID)
    const doctor = await Doctor.findById(userID)

    if(patient){
        user = patient
    }
   
    if(doctor){
        user = doctor
    }

    if(!roles.includes(user.role)){
        return res
        .status(401)
        .json({succes: false, message: "You are not authorized"});
    }
    next()
}