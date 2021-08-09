import * as mongoose from "mongoose";
import { WalletModel } from "../../Wallet"
import { StateFunction } from "../types"

export const debitAccount: StateFunction = {
  name: "Debit the From account",
  test: async (transactionDoc)=>{
    const wallet = await WalletModel.findById(transactionDoc.from);
    return wallet.fromTransactions.some((objectId: mongoose.Types.ObjectId)=>{
      return objectId.toString() === transactionDoc._id.toString()
    });
  },
  run: (transactionDoc)=>{

    return WalletModel.updateOne(
      { user: transactionDoc.from, balance: { $gte: transactionDoc.balance }},
      {
        $inc: { balance: (
          "-" + transactionDoc.balance
        ) },
        $push: { fromTransactions: transactionDoc._id }
      }
    ).exec().then((result: mongoose.UpdateWriteOpResult)=>{
      console.log("DEBIT:", result)
      if(result.nModified === 0){
        throw new Error("No wallets found")
      }
    });
  },
  revert(transactionDoc){
    return WalletModel.updateOne(
      { user: transactionDoc.from },
      {
        $inc: { balance: transactionDoc.balance },
        $pull: { fromTransactions: transactionDoc._id }
      }
    ).exec();
  }
}
