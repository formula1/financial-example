
import { IUser } from "../../../models/User";
import { StripeCustomerModel } from "../../../models/Finance-IO/stripe/StripeCustomer"

import {passport} from "../../../utils/passport";
import { Router } from "express";
import { json as bodyParserJSON } from "body-parser";

import { fromWalletToFiat } from "./wallet-to-fiat";
import { fromFiatToWallet } from "./fiat-to-wallet";

import {
  stripe
} from "../../../utils/stripe/api";

import {
  getCustomer,
  doesCustomerExist
} from "./functions";

import {
  createRouter as cardRouter
} from "./card-router"

export function createRouter(){
  const router = Router()

  router.use("/card", cardRouter());

  router.get(
    "/get-customer",
    passport.authenticate('jwt', {session: false}),
    async function(req, res, next){
      try {
        const user = req.user as IUser;
        var customerDoc = await StripeCustomerModel.findOne({ user: user._id}).exec();
        if(!customerDoc){
          return res.status(404).json({
            error: true,
            message: "Customer not found"
          })
        }
        const customerStripe = await stripe.customers.retrieve(
          customerDoc.stripeId
        );
        res.status(200).json({
          customerDoc,
          customerStripe
        });
      }catch(e){
        next(e);
      }
    }
  )

  router.post(
    "/create-or-update-customer",
    passport.authenticate('jwt', {session: false}),
    bodyParserJSON(),
    async function(req, res, next){
      try {
        const user = req.user as IUser;
        var customer = await StripeCustomerModel.findOne({ user: user._id});
        if(customer){
          console.log("Customer Found")
          const update = await stripe.customers.update(
            customer.stripeId,
            {
              name: req.body.name,
              address: req.body.address,
              email: req.body.email
            }
          );
          console.log("customer update:", update);
        } else {
          var stripeCustomer = (
            await doesCustomerExist(req.body.email, user._id)
          ) || (
            await stripe.customers.create({
              description: 'Create a Customer',
              name: req.body.name,
              address: req.body.address,
              email: req.body.email,
              metadata: {
                userId: user._id.toString()
              }
            })
          );
          customer = new StripeCustomerModel({
            user: user._id,
            stripeId: stripeCustomer.id
          })
          await customer.save()
        }

        res.status(200).json(customer);
      }catch(e){
        next(e);
      }
    }
  )

  router.post(
    "/exchange-value",
    passport.authenticate('jwt', {session: false}),
    bodyParserJSON(),
    async function(req, res, next){
      try {
        const user = req.user as IUser
        console.log("get user:", user)
        const args = {
          userId: user._id,
          sourceId: req.body.sourceId,
          amount: req.body.amount
        }
        console.log("create args:", args)
        var purchaseOrWithdraw = req.body.purchaseOrWithdraw;
        var transaction;
        if(purchaseOrWithdraw === "purchase") {
          console.log("before purchase")
          transaction = await fromFiatToWallet(args);
          console.log("after purchase")
        } else if(purchaseOrWithdraw === "withdraw") {
          console.log("before withdraw")
          transaction = await fromWalletToFiat(args);
          console.log("after withdraw")
        } else {
          throw "purchaseOrWithdraw needs to either be purchase or withdraw";
        }

        res.status(200).json(transaction);
      }catch(e){
        console.error(e);
        res.status(400).json({
          error: true,
          message: e.message || e
        });
      }

    }

  )

  router.post(
    "/fiat-to-wallet",
    passport.authenticate('jwt', {session: false}),
    bodyParserJSON(),
    async function(req, res, next){
      try {
        const user = req.user as IUser
        const transaction = await fromFiatToWallet({
          userId: user._id,
          sourceId: req.body.sourceId,
          amount: req.body.amount
        })
        res.status(200).json(transaction);
      }catch(e){
        res.status(400).json({
          error: true,
          message: e.message || e
        });
      }

    }
  )

  router.post(
    "/wallet-to-fiat",
    passport.authenticate('jwt', {session: false}),
    bodyParserJSON(),
    async function(req, res, next){
      try {
        const user = req.user as IUser
        const transaction = await fromWalletToFiat({
          userId: user._id,
          sourceId: req.body.sourceId,
          amount: req.body.amount
        })
        res.status(200).json(transaction);
      }catch(e){
        res.status(400).json({
          error: true,
          message: e.message || e
        });
      }
    }
  )

  return router;

}
