import mongoose, { Model, Schema } from "mongoose";
import { CommentSchema, IComment } from "./Comment";
import { IUsersLikesRaces, UsersLikesRaces, UsersLikesRacesSchema } from "./UsersLikesRaces";

interface IRaces extends Document {
    trackName: string;
    locationName: string;
    date: string;
    comments: IComment[];
    usersLikesRaces: IUsersLikesRaces[];
    wikipediaUrl?: string;
}

const RacesSchema: Schema<IRaces> = new mongoose.Schema({
    trackName: { type: String, required: true },
    locationName: { type: String, required: true },
    date: { type: String, required: true },
    comments: [CommentSchema],
    usersLikesRaces: [UsersLikesRacesSchema],
    wikipediaUrl:   { type: String, default: '' }
});

export const Races: Model<IRaces> = mongoose.model<IRaces>('Races', RacesSchema);