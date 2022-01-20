import {
  getCustomer,
  getPaymentSourceById,
  updateWallet
} from "./functions";

import {
  FiatOutputModel
} from "../../../models/Finance-IO/FiatOutput";

import {
  stripe
} from "../../../utils/stripe/api";

export async function fromWalletToFiat(
  {userId, sourceId, amount} :
  {userId: string, sourceId: string, amount: number}
){

  const customer = await getCustomer(userId);

  if(!customer){
    throw "No customer associated to user"
  }

  const source = await getPaymentSourceById(
    customer.stripeId,
    sourceId
  );
  if(!source){
    throw "No source with chosen id exists"
  }
  console.log("got payment source", source)

  if(amount < 1){
    throw "amount is less than minimum";
  }

  if(Math.floor(amount) !== amount){
    throw "amount must not be a decimal";
  }

  console.log("amount is correct")


  var amountStr = `$${amount}.00`;
  var amountCharge = amount * 100;

  var transaction = new FiatOutputModel({
    user: userId,
    source: source.id,
    amount: amountCharge,
    apiName: "stripe"
  })
  await transaction.save()

  console.log("create transaction")
  try {
    // https://stripe.com/docs/api/charges/create
    var result = await stripe.payouts.create({
      amount: amountCharge,
      currency: "usd",
      destination: source.id,

      // customer: customer.stripeId,
      description: amountStr + " bought for financial test app",
      statement_descriptor: "Financial Test App",

      method: "instant",
      source_type: "card",

    })

    console.log("after payout");

    transaction.transactionId = result.id
    await transaction.save();

    await updateWallet(userId, amountCharge, false);

    transaction.finished = true;
    await transaction.save();

    return transaction;
  }catch(e){
    await transaction.remove();
    throw e;
  }

}
