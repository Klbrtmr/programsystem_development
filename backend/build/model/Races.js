"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Races = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Comment_1 = require("./Comment");
const UsersLikesRaces_1 = require("./UsersLikesRaces");
const RacesSchema = new mongoose_1.default.Schema({
    trackName: { type: String, required: true },
    locationName: { type: String, required: true },
    date: { type: String, required: true },
    comments: [Comment_1.CommentSchema],
    usersLikesRaces: [UsersLikesRaces_1.UsersLikesRacesSchema],
    wikipediaUrl: { type: String, default: '' }
});
exports.Races = mongoose_1.default.model('Races', RacesSchema);
