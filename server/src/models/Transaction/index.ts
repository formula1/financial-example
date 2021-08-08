import mongoose from "mongoose";
import { StateFunction, ITransactionState } from "./types";
import {
  getTransactionStep,
  handleIncomplete,
} from "./StateFunctions";

import {
  Long
} from "../types/long"

const { model, Model, Types, Schema, Document } = mongoose;

const ObjectId = Types.ObjectId;


const TransactionStateSchema = new Schema({
  created: { type: Date, default: Date.now() },
  from: { type: ObjectId, required: true, ref: 'User'  },
  to: { type: ObjectId, required: true, ref: 'User' },
  balance: { type: Long, required: true},
  finished: {
    type: Boolean,
    default: false
  }
});


TransactionStateSchema.static(
  "restartIncompleteTransactions", async function(): Promise<any>{
    const TransactionModel = model("TransactionState");
    const transactionDocs = await TransactionModel.find({
      finished: false
    });
    await Promise.all(transactionDocs.map(async (transaction: ITransactionState)=>{
      const i = await getTransactionStep(transaction);
      return await handleIncomplete(transaction, i);
    }))
  }
);

TransactionStateSchema.pre('save', function(next) {
    (this as any).wasNew = this.isNew;
    next();
});

TransactionStateSchema.post('save', function() {
  if ( (this as any).wasNew ) {
      console.log("run transaction");
      handleIncomplete(this as ITransactionState, 0);
  }
});

const TransactionModel = model<ITransactionState>('TransactionState', TransactionStateSchema);

export {
  ITransactionState,
  TransactionModel
}
