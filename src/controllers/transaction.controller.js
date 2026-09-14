

import mongoose from "mongoose";
import accountModel from "../models/account.models.js";
import accountModel from "../models/account.models.js";
import transactioModel from "../models/transaction.model.js";
import ledgerModel from "../models/ledger.model.js";
import { sendTransactionEmail } from "../services/email.sevice.js";


async function createTransaction(req, res) {

    const {fromAccount, toAccount, amount, idempotencyKey} = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
          return res.status(400).json({
            success:false,
            message:"fromAccount, toAccount, amount and idempotencykey are required",
        }) ;
    }

        const fromUserAccount = await accountModel.findOne({
            _id:fromAccount
        }); 

        const toUserAccount = await accountModel.findOne({
            _id:toAccount
        }) ;

        if (!fromUserAccount || !toUserAccount) {

            return res.status(400).json({
                success:false,
                message:'Invalid fromAccount or toAccount'
            })            
        };

        const isTransactionAllreadyExists = await transactioModel.findOne({
            idempotencyKey:idempotencyKey
        });

        if (isTransactionAllreadyExists) {

            if (isTransactionAllreadyExists.status === "COMPLETED") {
              return res.status(200).json({
                success:true,
                message:'Transaction was completed',
                transaction: isTransactionAllreadyExists
               }) 
            };

            if (isTransactionAllreadyExists.status === "PENDING") {
              return  res.status(400).json({
                    success:false,
                    message:'Transaction was pending, Please Retry'
                })
                
            };

            if (isTransactionAllreadyExists.status === "FAILED") {
               return res.status(500).json({
                    message:"transaction was failed, Please Retry"
                });
            };

            if (isTransactionAllreadyExists.status === "REVERSED") {
               return res.status({
                    success:false,
                    message:'Transactio was Reversed. Please Wait'
                })
                
            }
        } 

        if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){

            return res.status(400).json({
                success:false,
                message:"Both fromAccount and toUserAccount must be active to process transaction"
            })
        };

        const balance = await fromUserAccount.getBalance();

        if (balance < amount) {
            return res.status(400).json({
                success:false,
                message:`insufficient balance. Current balance is ${balance}. Requested  amount is ${amount}`
            })
        };

        // create transaction =====


        const session = mongoose.startSession() ;
        session.startTransaction();

        const transaction = await transactioModel.create({
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status:"PENDING",

        }, {session});

        const debitLedgerEntry = await ledgerModel.create({
            account:fromAccount,
            amount:amount,
            transaction:transaction._id,
            type:"DEBIT"
        },{session});

        const creditLedgerEntry = await ledgerModel.create({
            account:toAccount,
            amount:amount,
            transaction:transaction._id,
            type:"CREDIT"
        },{session});

        transaction.status = "COMPLETED" ;
        await transaction.save({session}) ;

        await session.commitTransaction();
        await session.endSession();

        // send email notification =====>
          sendTransactionEmail(req.user.email, req.user.name, amount, toAccount);

          return res.status(201).json({
            message:"Transaction completed successfully",
            transaction: transaction
          })
    };
    
export default createTransaction ;