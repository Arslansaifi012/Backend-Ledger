
import express from 'express' ;

import { authmidlleware } from '../middleware/authMIdlleware.js';

import { createAccountController } from '../controllers/account.controller.js' ;

const accountRouter = express.Router() ;

accountRouter.post("/", authmidlleware, createAccountController) ;

export default accountRouter ;
