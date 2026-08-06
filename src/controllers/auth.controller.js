
import userModel from "../models/user.model.js"; 
import jwt from "jsonwebtoken" ;
import sendEmails from "../services/email.sevice.js";

function fntoken(id) {
     return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:"3d"})
}

 async function userRegistrationController (req, res) {

    const {email, name, password} = req.body ;

    const isExist = await userModel.findOne({email:email}) ;
    
    if(isExist){
        return res.status(422).json({
            message:"User allready exists with email",
            success:false
        })
    } ;

    const user =  await userModel.create({
        email,
        name,
        password,
    }) ;

    const token = fntoken(user._id) ;

    res.cookie("token", token) ;

    res.status(201).json({
        token,
        user,
        message:"user created successfully ",
        success:true,
    });

    sendEmails(email) ;
    
} ;


async function userLogin(req, res) {

    const {email, password} = req.body ;

    const user = await userModel.findOne({email:email}).select("+password") ;    

    if (!user) {
        return res.status(404).json({message:'user not found this email', success:false})
    } ;

    const isValidPassword = await user.comparePassword(password)

    if (!isValidPassword) {
        return res.status(401).json({message:"Invalid Credentials..", success:false})
    }

    const token = fntoken(user._id) ;

    res.cookie("token", token)

    res.status(200).json({user, token, message:'user successfully login', success:true}) ;

    
}


export {userRegistrationController, userLogin}
