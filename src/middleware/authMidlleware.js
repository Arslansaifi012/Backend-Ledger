
import jwt, { decode } from 'jsonwebtoken'
import userModel from '../models/user.model.js';

export async function authmidlleware(req, res, next) {

    const token = req.headers.authorizations || req.cookies.token.split(" ")[1]

    if(!token){
        res.status(401).json({
            success: false,
            message:'Unauthorized access, token is missing'
        });

        try {
            const decode_token = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode_token);
            
            
        } catch (error) {
          return  res.status(401).json({
                success:false,
                message:'unauthorized access, token is invalid'
            })
        }
    }
    
}

