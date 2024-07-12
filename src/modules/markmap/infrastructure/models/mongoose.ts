import { model, Schema, Document } from "mongoose";

export interface IMarkmap extends Document {
  uuid: string;
  title: string;
  User: string;
  emitedDate: number;
  image: string;
  url: string;
  tags: String[];
  emitedAt: number;
  createdAt: number;
  updatedAt: number;
}

const markmapScheme: any = new Schema({
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

export default model<IMarkmap>("Markmap", markmapScheme);
