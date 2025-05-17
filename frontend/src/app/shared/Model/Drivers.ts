import { UsersLikesDrivers } from "./UsersLikesDrivers";

export interface Drivers {
    _id: string;
    driverName: string;
    wikipediaUrl: string;
    usersLikesDrivers: UsersLikesDrivers[];
}