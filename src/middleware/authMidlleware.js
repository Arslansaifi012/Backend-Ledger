
import jwt from 'jsonwebtoken'
import userModel from '../models/user.model.js';

export async function authmidlleware(req, res, next) {

    const token = req.headers.authorization.split(" ")[1] || req.cookies.token.split(" ")[1];
    
    console.log(token, 'checking token');
    

    if(!token){
        res.status(401).json({
            success: false,
            message:'Unauthorized access, token is missing'
        });
    }

    try {
   
           const decode = jwt.verify(token, process.env.JWT_SECRET);
           const userId= decode.id
           
           
           req.user = await userModel.findById(userId) ;
          
           
           next() ; 
            
        } catch (error) {
          return  res.status(401).json({
                success:false,
                message:'unauthorized access, token is invalid'
            })
        }
    
}


