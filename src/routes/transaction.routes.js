
import express from "express";
import { authmidlleware } from "../middleware/authMIdlleware";
import createTransaction from "../controllers/transaction.controller";

const transactionRouter = express.Router() ;

transactionRouter.post("/", authmidlleware, createTransaction);