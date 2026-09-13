

import accountModel from "../models/account.models.js"


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
               res.status(200).json({
                success:true,
                message:'Transaction was completed',
                transaction: isTransactionAllreadyExists
               }) 
            };

            if (isTransactionAllreadyExists.status === "PENDING") {
                res.status(400).json({
                    success:false,
                    message:'Transaction was pending, Please Retry'
                })
                
            };

            if (isTransactionAllreadyExists.status === "FAILED") {
                res.status(500).json({
                    message:"transaction was failed, Please Retry"
                });
            };

            if (isTransactionAllreadyExists.status === "REVERSED") {
                res.status({
                    success:false,
                    message:'Transactio was Reversed. Please Wait'
                })
                
            }

        } 

        
        
    }
    
