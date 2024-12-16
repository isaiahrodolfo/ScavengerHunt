"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlreadyInRoomError = exports.RoomDoesNotExistError = void 0;
class RoomDoesNotExistError extends Error {
    constructor(message) {
        super(message);
        this.name = "RoomDoesNotExistError";
    }
}
exports.RoomDoesNotExistError = RoomDoesNotExistError;
class AlreadyInRoomError extends Error {
    constructor(message) {
        super(message);
        this.name = "AlreadyInRoomError";
    }
}
exports.AlreadyInRoomError = AlreadyInRoomError;
