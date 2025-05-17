import mongoose, { Model, Schema } from "mongoose";
import { IUsersLikesDrivers, UsersLikesDrivers, UsersLikesDriversSchema } from "./UsersLikesDrivers";

interface IDrivers extends Document {
    driverName: string;
    wikipediaUrl: string;
    usersLikesDrivers: IUsersLikesDrivers[];
}

const DriversSchema: Schema<IDrivers> = new mongoose.Schema({
    driverName: { type: String, required: true },
    wikipediaUrl:   { type: String, required: true },
    usersLikesDrivers: [UsersLikesDriversSchema]
});

export const Drivers: Model<IDrivers> = mongoose.model<IDrivers>('Drivers', DriversSchema);