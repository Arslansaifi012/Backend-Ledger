
import mongoose from "mongoose"; 
import bcrypt, { compare } from "bcrypt" ;


const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true, "Email is required for creating A user"],
        trim: true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique:[true, "Email is allready exist"]

    } ,

    name:{
        type:String,
        required:[true, "Name is required for creting an account"],

    },

    password:{type:String,
     required:[true, "password is required for creating an account "],
     minlength:[6 , "password should be contain more than 6 character"],
     select:false
    }

},{
   timestamps:true 
});




userSchema.pre("save", async function(){

    if (!this.isModified("password")) {
        return  ;
    };

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash ;

    return   ;
}) ;


userSchema.methods.comparePassword = async function (password) {
    
    return await bcrypt.compare(password, this.password) ;
    
} ;

const userModel = mongoose.models.user || mongoose.model("user", userSchema) ;

export default userModel ;

