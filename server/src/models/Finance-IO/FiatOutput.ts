import { model, Model, Types, Schema, Document } from "mongoose";

import {
  Long
} from "../types/long"

const ObjectId = Types.ObjectId;

interface IFiatOutput extends Document {
  user: typeof ObjectId;
  sourceId: string;
  created: Date;

  amount: typeof Long;
  transactionId: string;
  finished: boolean;

  apiName: string;
}

const FiatOutputSchema = new Schema({
  user: { type : ObjectId, require: true, ref: "User" },
  sourceId: { type: String },
  amount: { type: Long, required: true},

  created: { type: Date, default: Date.now() },
  finished: { type: Boolean, default: false },

  transactionId: { type: String },

  apiName: { type: String, required: true}
});

const FiatOutputModel: Model<IFiatOutput> = model('FiatOutput', FiatOutputSchema);

export {
  IFiatOutput,
  FiatOutputModel
}
