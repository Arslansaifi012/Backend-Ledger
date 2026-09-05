

import accountModel from "../models/account.models.js";


export const createAccountController = (req, res) => {

    const user = req.user;

    const account = accountModel.create({
        user:user._id
    });

    res.status(201).json({
        success: true,
        account
    })
}

