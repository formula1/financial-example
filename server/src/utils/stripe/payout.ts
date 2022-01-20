/*
https://stripe.com/docs/payouts#adding-bank-account-information
*/
import Stripe from 'stripe'
import { SECRET_KEY } from "./constants";
import  { CardInfoModel } from "../../models/Finance-IO/CardInfo";

export async function payout(userId, amount){
  const stripe = new Stripe(SECRET_KEY, {
    apiVersion: '2020-08-27',
  });
  const card = await CardInfoModel.findOne({ user: userId });

  const payout = await stripe.payouts.create({
    amount: amount,
    currency: 'usd',
    method: 'instant',
    destination: card.card,
    description: 'My First Test Payout (created for API docs)',
  });
}
