import mongoose from "mongoose";
import { ITransactionState } from "./Transaction/types"

import {
  Long,
  castableAsLong
} from "./types/long"

const { model, Model, Types, Schema, } = mongoose;

const ObjectId = mongoose.Types.ObjectId;

interface IWallet extends mongoose.Document {
  user: mongoose.ObjectId;
  balance: typeof Long,
  fromTransactions: Array<mongoose.Types.ObjectId>,
  toTransactions: Array<mongoose.Types.ObjectId>,
}

interface IWalletModel extends mongoose.Model<any, any, any> {
  findOrCreateWallet: (userId: string | mongoose.ObjectId)=> Promise<IWallet>,
  sendTransaction: (args: {
    from: mongoose.ObjectId, to: mongoose.ObjectId, balance: castableAsLong
  })=>Promise<ITransactionState>
}

const WalletSchema = new Schema({
  user: {
    type: ObjectId,
    required: true,
    unique: true
  },
  balance: { type: Long, default: 0 },
  fromTransactions: { type: [ObjectId], default: []},
  toTransactions: { type: [ObjectId], default: []},
});

WalletSchema.static(
  "findOrCreateWallet", async function(userId: string | mongoose.ObjectId): Promise<IWallet>{
    const WalletModel = model("Wallet");
    const wallet = await WalletModel.findOne({
      user: userId
    });
    if(wallet) return wallet as IWallet;
    const createdWallet = new WalletModel({
      user: userId
    })
    createdWallet.save();
    return createdWallet as IWallet;
  }
);

WalletSchema.static(
  "sendTransaction", async function(
    {
      from, to, balance
    }: {
      from: mongoose.ObjectId, to: mongoose.ObjectId, balance: castableAsLong
    }
  ): Promise<ITransactionState>{
    const WalletModel = model("Wallet") as IWalletModel;
    const [fromWallet, toWallet] = await Promise.all([
      WalletModel.findOrCreateWallet(from),
      WalletModel.findOrCreateWallet(to)
    ]);
    var TransactionModel = model("TransactionState")
    const transaction = new TransactionModel({
      from: fromWallet.user,
      to: toWallet.user,
      balance: balance,
    }) as ITransactionState
    return await transaction.save()
  }
)


const WalletModel = model<IWallet>('Wallet', WalletSchema) as IWalletModel;

export {
  IWallet,
  WalletModel
}
