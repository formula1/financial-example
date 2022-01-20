import {
  StripeCustomerModel
} from "../../../models/Finance-IO/stripe/StripeCustomer";

import {
  StripeAccountModel
} from "../../../models/Finance-IO/stripe/StripeAcount";

import {
  WalletModel
} from "../../../models/Wallet"

import {
  stripe
} from "../../../utils/stripe/api";

async function doesCustomerExist(email: string, userId: string){
  var customers;
  do{
    customers = await stripe.customers.list({
      email: email,
      limit: 100,
      starting_after: customers ? customers.data[customers.data.length -1].id : void 0
    });

    var foundCustomer;
    if(customers.data.some((customer)=>{
      if(customer.metadata.userId === userId){
        foundCustomer = customer;
        return true;
      }
    })){
      return foundCustomer
    }
  }while(customers.has_more)

  return void 0;

}

async function getCustomer(userId: string){
  const customer = await StripeCustomerModel.findOne({ user: userId }).exec();
  if(!customer){
    throw "Customer Does Not exist";
  }
  return customer;
}

async function getAccount(userId: string){
  const customer = await StripeAccountModel.findOne({ user: userId }).exec();
  if(!customer){
    throw "Customer Does Not exist";
  }
  return customer;

}

async function getPaymentSourceById(customerId: string, paymentSourceId: string){
  const paymentSource = await stripe.paymentMethods.retrieve(paymentSourceId);
  if(paymentSource.customer !== customerId){
    throw "payment source has different customer";
  }
  return paymentSource;
}

function updateWallet(userId: string, amount: number, isPositive: boolean){
  return WalletModel.updateOne(
    {user: userId},
    {$inc : {balance : (isPositive ? "" : "-") + amount}}
  ).exec()
}


export {
  getCustomer,
  getAccount,
  doesCustomerExist,
  getPaymentSourceById,
  updateWallet
};
