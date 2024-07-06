import { model, Schema, Document } from "mongoose";

export interface IUser extends Document {
  uuid: string;
  username: string;
  email: string;
  password: string;
  Certifications: Array<any>;
  Institutions: Array<any>;
  Projects: Array<any>;
  Skills: Array<any>;
  Notes: Array<any>;
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
  Certifications: [{ type: String, ref: "Certification" }],
  Institutions: [{ type: String, ref: "Institution" }],
  Projects: [{ type: String, ref: "Project" }],
  Skills: [{ type: String, ref: "Skill" }],
  Notes: [{ type: String, ref: "Note" }],
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

export default model<IUser>("User", userSchema);
