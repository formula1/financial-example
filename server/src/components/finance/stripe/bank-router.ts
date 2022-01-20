
import { IUser } from "../../../models/User";

import {passport} from "../../../utils/passport";
import { Router } from "express";
import { json as bodyParserJSON } from "body-parser";

import {
  stripe
} from "../../../utils/stripe/api";

// import {
//   ExternalAccountListParams
// } from "stripe"

import {
  getCustomer,
  getAccount
} from "./functions";

export function createRouter(){
  const router = Router()

  router.get(
    "/list",
    passport.authenticate('jwt', {session: false}),
    async function(req, res, next){
      try {
        const user = req.user as IUser;
        // const customer = await getCustomer(user._id);
        const account = await getAccount(user._id);
        console.log("got account:", account);

        const accountBankAccounts = await stripe.accounts.listExternalAccounts(
          account.stripeId,
          {
            object: 'bank_account'
          }
        );

        res.status(200).json(paymentMethods);
        console.log("respond")
      }catch(e){
        next(e)
      }
    }
  )

  router.get(
    "/list/:page",
    passport.authenticate('jwt', {session: false}),
    async function(req, res, next){
      try {
        const user = req.user as IUser;
        // const customer = await getCustomer(user._id);
        const account = await getAccount(user._id);


        const paymentMethods = await stripe.accounts.listExternalAccounts(
          account.stripeId,
          {
            object: 'bank_account',
            starting_after: req.params.page
          }
        );


        res.status(200).json(paymentMethods);
      }catch(e){
        next(e);
      }
    }
  )

  router.get(
    "/delete/:id",
    passport.authenticate('jwt', {session: false}),
    async function(req, res, next){
      try{
        const user = req.user as IUser;
        // const customer = await getCustomer(user._id);
        const account = await getAccount(user._id);

        const deleted = await stripe.accounts.deleteExternalAccount(
          account.stripeId,
          req.params.id
        );
        console.log("delete account0", req.params.id);
        res.status(200).json(deleted);
      }catch(e){
        next(e)
      }
    }
  )

  router.post(
    "/create",
    passport.authenticate('jwt', {session: false}),
    bodyParserJSON(),
    async function(req, res, next){
      try {
        const user = req.user as IUser;
        // const customer = await getCustomer(user._id);
        const account = await getAccount(user._id);
        console.log("Attaching:", account.stripeId, req.body)

        const bankAccount = await stripe.accounts.createExternalAccount(
          account.stripeId,
          {
            external_account: req.body.token,
          }
        );
        res.status(200).json(bankAccount);
      }catch(e){
        console.error(e);
        next(e);
      }
    }
  );

  return router;

}
