import { model, Model, Types, Schema, Document, ObjectId } from "mongoose";

interface IStripeCustomer extends Document {
  user: ObjectId | string;
  stripeId: string;
}

const StripeCustomerSchema = new Schema({
  user: { type : Types.ObjectId, require: true, ref: "User" },
  stripeId: { type : String, require: true },
});

const StripeCustomerModel: Model<IStripeCustomer> = model('StripeCustomer', StripeCustomerSchema);

export {
  IStripeCustomer,
  StripeCustomerModel
}
