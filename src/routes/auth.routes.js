
import express from "express";
import { userRegistrationController, userLogin } from "../controllers/auth.controller.js";

const router = express.Router() ;

router.post('/register', userRegistrationController) ;
router.post('/login', userLogin)


 const authRouter = router ;

export default authRouter 