
import User from "../models/UserSchema.js";
import Booking from '../models/BookingSchema.js'
import Doctor from '../models/DoctorSchema.js'

export const updateUser = async(req, res) =>{
    const id = req.params.id

    try {
        const updateUser = await User.findByIdAndUpdate(
            id,
            { $set: req.body},
            { new: true}
        );

        res
        .status(200)
        .json({
            success: true,
            message: "Successfully updated",
            data: updateUser
        });
        
    } catch (error) {
        res
        .status(500)
        .json({
            success: false,
            message: "Failed to update"
        });
    }
}

export const getSingleUser = async(req, res) =>{
    const id = req.params.id

    try {
        const user = await User.findById(id).select("-password");

        res
        .status(200)
        .json({
            success: true,
            message: "User found",
            data: user
        });
        
    } catch (error) {
        res
        .status(404)
        .json({
            success: false,
            message: "No user found"
        });
    }
}

export const deleteUser = async(req, res) =>{
    const id = req.params.id

    try {
        await User.findByIdAndDelete(id);

        res
        .status(200)
        .json({
            success: true,
            message: "Successfully deleted"
        });
        
    } catch (error) {
        res
        .status(500)
        .json({
            success: false,
            message: "Failed to delete"
        });
    }
}

export const getAllUser = async(req, res) =>{
    

    try {
        const users = await User.find({}).select("-password");

        res
        .status(200)
        .json({
            success: true,
            message: "Users found",
            data: users
        });
        
    } catch (error) {
        res
        .status(404)
        .json({
            success: false,
            message: "Not found"
        });
    }
}

export const getUserProfile = async(req, res)=>{
    const userId = req.userID
   
    try{
        const user = await User.findById(userId)
        if(!user){
           
            return res
                .status(404)
                .json({ success: false, message: "User not found !" })
        }
        const {password, ...rest} =  user._doc;

        res
        .status(200)
        .json({
            success:true,
            message: "Profile is getting",
            data: {...rest},
        })

    } catch(error){
        res
        .status(500)
        .json({success:false, message:"Something went wrong, cannot get" + error.message})

    }
}

export const getMyAppointments = async(req,res) =>{
    try {
        //Step 1: retrieve appointments from booking for a specific user 
        const bookings = await Booking.find({user:req.userId})
        //Step 2: extract doctor ids from appointment booking

        const doctorIds = bookings.map(el=>el.doctor.id)

        //Step 3: retrieve doctor using doctor ids
        const doctors = await Doctor.find({_id: {$in:doctorIds}}).select("-password")

        res
        .status(200)
        .json({
            success:true,
            message: "Appointments are getting",
            data: doctors,
        })
    } catch (error) {
        res
        .status(500)
        .json({success:false, message:"Something went wrong, cannot get"})
    }
}
