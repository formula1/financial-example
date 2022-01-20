import { model, Model, Types, Schema, Document, ObjectId } from "mongoose";

interface IStripeAccount extends Document {
  user: ObjectId | string;
  stripeId: string;
}

const StripeAccountSchema = new Schema({
  user: { type : Types.ObjectId, require: true, ref: "User" },
  stripeId: { type : String, require: true },
});

const StripeAccountModel: Model<IStripeAccount> = model('StripeCustomer', StripeAccountSchema);

export {
  IStripeAccount,
  StripeAccountModel
}
