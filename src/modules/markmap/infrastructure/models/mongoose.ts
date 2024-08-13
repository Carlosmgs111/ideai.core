import { model, Schema, Document } from "mongoose";
export interface IMarkmap extends Document {
  uuid: string;
  title: string;
  text: string;
  description: string;
  User: string;
  createdAt: number;
  updatedAt: number;
}

const markmapScheme: any = new Schema<IMarkmap>({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    unique: false,
    required: true,
    lowercase: false,
    trim: false,
  },
  text: {
    type: String,
    required: true,
    unique: false,
  },
  description: {
    type: String,
    required: false,
    unique: false,
  },
  User: { type: String, ref: "User" },
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

export const Markmap = model<IMarkmap>("Markmap", markmapScheme);
