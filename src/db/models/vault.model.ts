import { Schema, model } from "mongoose";

const fieldSchema = new Schema({
  service: {
    type: String,
    required: true
  },
  emailOrUsername: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: false
  }
});

const schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  masterPassword: {
    type: String,
    required: true
  },
  field: [fieldSchema]
});

export default model("vault", schema);
