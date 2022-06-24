import { string } from 'joi';
import mongoose from 'mongoose';
// defaning a schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 6,
      max: 200,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      min: 6,
      max: 200,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profile: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);
// defaning a model
export default mongoose.model('User', userSchema);
