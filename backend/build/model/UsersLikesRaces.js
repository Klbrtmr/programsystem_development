"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersLikesRaces = exports.UsersLikesRacesSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
;
exports.UsersLikesRacesSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true }
});
exports.UsersLikesRaces = mongoose_1.default.model('UsersLikesRaces', exports.UsersLikesRacesSchema);
