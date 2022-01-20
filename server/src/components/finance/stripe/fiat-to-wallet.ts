import {
  getCustomer,
  getPaymentSourceById,
  updateWallet
} from "./functions";

import {
  FiatInputModel
} from "../../../models/Finance-IO/FiatInput";

import {
  stripe
} from "../../../utils/stripe/api";

export async function fromFiatToWallet(
  {userId, sourceId, amount} :
  {userId: string, sourceId: string, amount: number}
){

  const customer = await getCustomer(userId);

  if(!customer){
    throw "No customer associated to user"
  }
  console.log("got customrr");

  const source = await getPaymentSourceById(
    customer.stripeId,
    sourceId
  );

  if(!source){
    throw "No source with chosen id exists"
  }
  console.log("got payment source")

  if(amount < 1){
    throw "amount is less than minimum";
  }

  if(Math.floor(amount) !== amount){
    throw "amount must not be a decimal";
  }

  console.log("amount is correct")

  var amountStr = `$${amount}.00`;
  var amountCharge = amount * 100;

  var transaction = new FiatInputModel({
    user: userId,
    source: source.id,
    amount: amountCharge,
    apiName: "stripe"
  })
  await transaction.save()

  try {
    // https://stripe.com/docs/api/charges/create
    var result = await stripe.paymentIntents.create({
      amount: amountCharge,
      currency: "usd",
      customer: customer.stripeId,
      description: amountStr + " bought for financial test app",
      statement_descriptor: "Financial Test App",
      payment_method: source.id,
      confirm: true
    })
    transaction.transactionId = result.id
    await transaction.save();

    console.log("before update wallet")

    await updateWallet(userId, amountCharge, true);

    console.log("after update wallet")

    transaction.finished = true;
    await transaction.save();

    return transaction;
  }catch(e){
    await transaction.remove()
    throw e;
  }

}
