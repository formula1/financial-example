import * as mongoose from "mongoose";
import { WalletModel } from "../../Wallet"
import { StateFunction } from "../types"

export const creditAccount: StateFunction = {
  name: "Credit the To account",
  test: async (transactionDoc)=>{
    const wallet = await WalletModel.findById(transactionDoc.to);
    return wallet.toTransactions.some((objectId: mongoose.Types.ObjectId)=>{
      return objectId.toString() === transactionDoc._id.toString()
    });
  },
  run: (transactionDoc)=>{
    return WalletModel.updateOne(
      { user: transactionDoc.to },
      {
        $inc: { balance: transactionDoc.balance },
        $push: { toTransactions: transactionDoc._id }
      }
    ).exec().then((result: mongoose.Document)=>{
      console.log(result)
      return result;
    });
  },
  revert(transactionDoc){
    return WalletModel.updateOne(
      { user: transactionDoc.to },
      {
        $inc: { balance: (
          "-" + transactionDoc.balance
        ) },
        $pull: { toTransactions: transactionDoc._id }
      }
    ).exec();
  }
}
