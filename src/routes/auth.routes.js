
import express from "express";
import { userRegistrationController } from "../controllers/auth.controller.js";

const router = express.Router() ;

router.post('/register', userRegistrationController)


 const authRouter = router ;

export default authRouter 