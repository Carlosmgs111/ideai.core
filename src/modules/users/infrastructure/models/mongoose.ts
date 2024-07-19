import { model, Schema, Document } from "mongoose";

export interface IUser extends Document {
  uuid: string;
  username: string;
  email: string;
  password: string;
  Markmaps: Array<any>;
  privilege: string;
  avatar: string;
  createdAt: number;
  updatedAt: number;
}

const userSchema: any = new Schema<IUser>({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: false,
    trim: false,
  },
  email: {
    type: String,
    unique: true,
    required: false,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  privilege: {
    type: String,
    required: true,
  },
  avatar: { type: String },
  Markmaps: [{ type: String, ref: "Markmap" }],
  createdAt: {
    type: Number,
    required: true,
    modifiable: false,
  },
  updatedAt: {
    type: Number,
    required: true,
  },
});

export const User = model<IUser>("User", userSchema);
