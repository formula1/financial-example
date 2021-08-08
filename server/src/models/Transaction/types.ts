import * as mongoose from "mongoose";
import {
  Long
} from "../types/long"

interface ITransactionState extends mongoose.Document {
  created: Date,
  from: mongoose.Types.ObjectId,
  to: mongoose.Types.ObjectId,
  balance: typeof Long,
  finished: boolean
}

interface StateFunction {
  name: string;
  test: (transactionDoc: ITransactionState)=>Promise<boolean>;
  run: (transactionDoc: ITransactionState)=>Promise<any>;
  revert: (transactionDoc: ITransactionState)=>Promise<any>;
}


export { StateFunction, ITransactionState }
