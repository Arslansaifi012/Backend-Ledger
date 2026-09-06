

import accountModel from "../models/account.models.js";


export const createAccountController = async(req, res) => {

    const user = req.user;

    console.log(user,"cheking user");

    const account = await accountModel.create({
        user:user._id
    });

   return res.status(201).json({
        success: true,
        account
    })
}

