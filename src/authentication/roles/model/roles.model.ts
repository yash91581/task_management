import mongoose, { model, Schema, Document } from "mongoose";

export default interface Roles extends Document {
  _id: string;
  name: string;
  description: string;
  slug: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const RolesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  }
);

export const RolesModel = model<Roles>("Roles", RolesSchema);
