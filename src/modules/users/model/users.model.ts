import mongoose, { model, Schema, Document } from 'mongoose';

export default interface User extends Document {
	_id:string
	fullname: string;
	email: string;
	password: string;
	contactNumber: string;
	resetPasswordToken: string;
	isPasswordReset: boolean;
	roles: [];
	isDeleted: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

const UserSchema = new Schema(
	{
		fullName: {
			type: String,
			required: true,
			trim: true,
			maxlength: 100
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		},
		contactNumber: {
			type: String
		},
		resetPasswordToken: {
			type: String,
			default: null
		},
		isPasswordReset: {
			type: Boolean,
			default: false
		},
		roles: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Roles',
				required: true
			}
		],
		lastLoggedInAt: {
			type: Date
		},
		isDeleted: {
			type: Boolean,
			require: true,
			default: false
		}
	},
	{
		timestamps: true
	}
);

export const UserModel = model<User>('Users', UserSchema);
