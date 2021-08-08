import mongoose from "mongoose";
import mongooseLong from 'mongoose-long'
mongooseLong(mongoose);

const Long = mongoose.Schema.Types.Long

type castableAsLong = typeof Long | string | number;

export {
  Long,
  castableAsLong
}
