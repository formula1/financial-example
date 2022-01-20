
import { IUser } from "../../../models/User";

import {passport} from "../../../utils/passport";
import { Router } from "express";
import { json as bodyParserJSON } from "body-parser";

import {
  stripe
} from "../../../utils/stripe/api";

import {
  getCustomer,
} from "./functions";

export function createRouter(){
  const router = Router()

  router.get(
    "/list",
    passport.authenticate('jwt', {session: false}),
    async function(req, res, next){
      try {
        const user = req.user as IUser;
        const customer = await getCustomer(user._id);
        console.log("got customer:", customer);

        const paymentMethods = await stripe.paymentMethods.list({
          customer: customer.stripeId,
          type: 'card',
        });

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
        const customer = await getCustomer(user._id);

        const paymentMethods = await stripe.paymentMethods.list({
          customer: customer.stripeId,
          type: 'card',
          starting_after: req.params.page
        });


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
        const customer = await getCustomer(user._id);

        const paymentMethod = await stripe.paymentMethods.detach(
          req.params.id
        );
        console.log("detach payment", req.params.id);
        res.status(200).json(paymentMethod);
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
        const customer = await getCustomer(user._id);
        console.log("Attaching:", customer.stripeId, req.body)
        const newCard = await stripe.paymentMethods.attach(
         req.body.id,
         {customer: customer.stripeId}
        );
        res.status(200).json(newCard);
      }catch(e){
        console.error(e);
        next(e);
      }
    }
  );

  return router;

}
