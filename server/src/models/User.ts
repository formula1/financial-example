import { model, Model, Schema, Document } from "mongoose";

type ObjectId = Schema.Types.ObjectId;

interface IUser extends Document {
  name: string;
  created: Date;
  permissions: Array<string>;
}

const UserSchema = new Schema({
  name: String,
  created: { type: Number, default: Date.now },
  permissions: { type: [String], default: [] }
});

const UserModel: Model<Document> = model('User', UserSchema);

export {
  IUser,
  UserModel
}
