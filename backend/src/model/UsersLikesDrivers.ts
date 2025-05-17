import mongoose, { Model, Schema } from "mongoose";


export interface IUsersLikesDrivers extends Document {
    username: string;
};

export const UsersLikesDriversSchema: Schema<IUsersLikesDrivers> = new mongoose.Schema({
    username: { type: String, required: true }
});

export const UsersLikesDrivers: Model<IUsersLikesDrivers> = mongoose.model<IUsersLikesDrivers>('UsersLikesDrivers', UsersLikesDriversSchema);