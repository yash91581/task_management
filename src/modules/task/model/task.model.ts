import mongoose, { model, Schema, Document } from "mongoose";

enum E_Priority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  IMMEDIATE = "Immediate",
}

export default interface Tasks extends Document {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: E_Priority;
  dueDate: Date;
  comments: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const TasksSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
    },
    priority: {
      type: String,
      enum: E_Priority,
    },
    dueDate: {
      type: Date,
    },
    comments: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const TasksModel = model<Tasks>("Tasks", TasksSchema);
