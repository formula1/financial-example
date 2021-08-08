import { WalletModel } from "../../Wallet"
import { StateFunction, ITransactionState } from "../types";

export const finishTransaction: StateFunction = {
  name: "set to finished and clean up wallets",
  test: (transactionDoc: ITransactionState)=>{
    return Promise.resolve(transactionDoc.finished)
  },
  run: (transactionDoc: ITransactionState)=>{
    transactionDoc.finished = true;
    return transactionDoc.save().then(()=>{
      return Promise.all([
        WalletModel.updateOne(
          { user: transactionDoc.to },
          {
            $pull: { toTransactions: transactionDoc._id }
          }
        ).exec(),
        WalletModel.updateOne(
          { user: transactionDoc.from },
          {
            $pull: { fromTransactions: transactionDoc._id }
          }
        ).exec(),
      ])
    });
  },
  revert: (transactionDoc: ITransactionState)=>{
    transactionDoc.finished = false;
    return transactionDoc.save();
  },
}
