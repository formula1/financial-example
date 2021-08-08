import * as mongoose from "mongoose";
import { loadType } from "mongoose-int32";

const Int32 = loadType(mongoose);

export { Int32 };
