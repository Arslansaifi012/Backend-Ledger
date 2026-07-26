
import userModel from "../models/user.model.js"; 
import jwt from "jsonwebtoken" ;

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
    })
    
} ;


export {userRegistrationController}
