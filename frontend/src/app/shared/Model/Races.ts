import { UsersLikesRaces } from "./UsersLikesRaces";

export interface Races {
    _id: string;
    trackName: string;
    locationName: string;
    date: Date;
    comments: Comment[];
    usersLikesRaces: UsersLikesRaces[];
    wikipediaUrl: string;
}