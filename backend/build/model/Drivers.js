"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drivers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UsersLikesDrivers_1 = require("./UsersLikesDrivers");
const DriversSchema = new mongoose_1.default.Schema({
    driverName: { type: String, required: true },
    wikipediaUrl: { type: String, required: true },
    usersLikesDrivers: [UsersLikesDrivers_1.UsersLikesDriversSchema]
});
exports.Drivers = mongoose_1.default.model('Drivers', DriversSchema);
