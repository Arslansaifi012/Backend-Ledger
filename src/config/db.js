
import mongoose from "mongoose";

function connectToDB() {
    console.log(process.env.MONGODB_URI);
    
    
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("DB Connected To Successfully")
    })
    .catch(err=>{
        console.log("Error connection to DB",err.message)
        process.exit(1) 
    })
} ;

export default connectToDB ;




