/*
https://stripe.com/docs/payouts#adding-bank-account-information
*/
import stripe from './api'
import { SECRET_KEY } from "./constants";
import  { CardInfoModel } from "../../models/Finance-IO/CardInfo";

export async function payment(userId, amount){
  const card = await CardInfoModel.findOne({ user: userId });

  const payment = await stripe.charges.create({
    amount: amount,
    currency: 'usd',
    source: 'tok_mastercard',
    description: 'My First Test Charge (created for API docs)',
  });
}
