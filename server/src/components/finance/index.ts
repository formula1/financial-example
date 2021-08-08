
import {passport} from "../../utils/passport";
import { Router } from "express";
import { json as bodyParserJSON } from "body-parser";

import { WalletModel, IWallet } from "../../models/Wallet"
import { TransactionModel } from "../../models/Transaction"
import { IUser } from "../../models/User";
import { getTransactions } from "./get-transactions"

export function createRouter(){
  const router = Router()

  router.get(
    "/unfinished-transactions/",
    passport.authenticate('jwt', {session: false}),
    async (req, res, next)=>{
      const user = req.user as IUser;
      if(!user){
        console.error("Not logged in")
        return next({ status: 403, message: "Not logged in"})
      }
      try {
        var trans = await TransactionModel.find({ finised: false })
        res.status(200).json(trans)
      }catch(e){
        next(e)
      }
    }
  )

  router.get(
    "/transactions/:id",
    passport.authenticate('jwt', {session: false}),
    async (req, res, next)=>{
      const user = req.user as IUser;
      if(!user){
        console.error("Not logged in")
        return next({ status: 403, message: "Not logged in"})
      }
      const userId = req.params.id;
      try {
        var trans = await getTransactions(userId)
        res.status(200).json(trans)
      }catch(e){
        next(e)
      }
    }
  )

  router.get(
    "/transactions",
    passport.authenticate('jwt', {session: false}),
    async (req, res, next)=>{
      const user = req.user as IUser;
      if(!user){
        console.error("Not logged in")
        return next({ status: 403, message: "Not logged in"})
      }
      try {
        var trans = await getTransactions(user._id)
        res.status(200).json(trans)
      }catch(e){
        next(e)
      }
    }
  )

  router.get(
    "/wallet/:id",
    passport.authenticate('jwt', {session: false}),
    (req, res, next)=>{
      const user = req.user as IUser;
      if(!user){
        console.error("Not logged in")
        return next({ status: 403, message: "Not logged in"})
      }
      const userId = req.params.id;
      return WalletModel.findOrCreateWallet(userId)
      .then((wallet)=>{
        res.status(200).json(wallet)
      }).catch((err)=>{
        next({
          status: 500,
          message: err.message
        })
      })
    }
  )

  router.get(
    "/wallet",
    passport.authenticate('jwt', {session: false}),
    (req, res, next)=>{
      const user = req.user as IUser;
      if(!user){
        console.error("Not logged in")
        return next({ status: 403, message: "Not logged in"})
      }
      return WalletModel.findOrCreateWallet(user._id)
      .then((wallet)=>{
        res.status(200).json(wallet)
      }).catch((err)=>{
        next({
          status: 500,
          message: err.message
        })
      })
    }
  )

  router.post(
    "/send-transaction",
    passport.authenticate('jwt', {session: false}),
    bodyParserJSON(),
    (req, res, next)=>{
      const user = req.user as IUser;
      if(!user){
        console.error("Not logged in")
        return next({ status: 403, message: "Not logged in"})
      }
      const { to, balance } = req.body
      if(!to) return next({ status: 400, message: "No to parameter"})
      if(!balance) return next({ status: 400, message: "No balance parameter"})
      return WalletModel.sendTransaction(
        {
          from: user._id,
          to: to,
          balance: balance
        }
      ).then((transaction)=>{
        res.status(200).json(transaction)
      }).catch((err)=>{
        next({
          status: 500,
          message: err.message
        })
      })
    }
  )

  return router;
}
