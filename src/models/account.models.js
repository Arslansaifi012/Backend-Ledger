
import mongoose from "mongoose";


const accountSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Account must ne associated with a user"],
        index:true
    },

    status: {
        enum:{
            values: ["ACTIVE", "FROZEN", "CLOSED"],
            message: "Status can be either ACTIVE, FROZEN or CLOSED"
        }
    },
    currency: {
        type:String,
        required: [true, "Currency is required fro creating an account"],
        default:"INR"
    }
},{
    timestamps: true
})

const accountModel = mongoose.model("account", accountSchema)
 export default accountModel ;