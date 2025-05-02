import mongoose, { Model, Schema } from "mongoose";


export interface IUsersLikesRaces extends Document {
    username: string;
};

export const UsersLikesRacesSchema: Schema<IUsersLikesRaces> = new mongoose.Schema({
    username: { type: String, required: true }
});

export const UsersLikesRaces: Model<IUsersLikesRaces> = mongoose.model<IUsersLikesRaces>('UsersLikesRaces', UsersLikesRacesSchema);