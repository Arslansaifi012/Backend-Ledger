
import express from "express";
import { authmidlleware } from "../middleware/authMIdlleware";

const transactionRouter = express.Router() ;

transactionRouter.post("/", authmidlleware)