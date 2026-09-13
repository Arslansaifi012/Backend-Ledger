

import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema({

    account:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true, "Ledger must be associated with an account"],
        index:true,
        immutable:true
    },

    ammount:{
        type:Number,
        required:[true, "Amount Is Required for creating a ledger entry"],
        immutable:true
    },


    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:[true, "Ledger must be associated with a transaction"],
        index:true,
        immutable:true
    },

    type:{
        type:{
            enum:{
                values:["Credit", "Debit"],
                message: "Type can be either credit  or Debit "
            },
            required:[true, "Ledger type is required"],
            immutable:true,
        }

    }
     
}) ;

    function preventLedgerModification() {
        throw new Error("Ledger entries are immutable and cannot be modified or deleted")
    } ;

    ledgerSchema.pre('findOneAndUpdate', preventLedgerModification);
    ledgerSchema.pre('updateOne', preventLedgerModification);
    ledgerSchema.pre('deleteOne', preventLedgerModification);
    ledgerSchema.pre('remove', preventLedgerModification);
    ledgerSchema.pre('deleteMany', preventLedgerModification);

    const ledgerModel = mongoose.models.ledger || mongoose.model('ledger', ledgerSchema);

    export default ledgerModel ;