"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotHostError = exports.AlreadyInThisRoomError = exports.AlreadyInSomeRoomError = exports.RoomAlreadyExistsError = exports.RoomDoesNotExistError = void 0;
class RoomDoesNotExistError extends Error {
    constructor(message) {
        super(message);
        this.name = "RoomDoesNotExist";
    }
}
exports.RoomDoesNotExistError = RoomDoesNotExistError;
class RoomAlreadyExistsError extends Error {
    constructor(message) {
        super(message);
        this.name = "RoomAlreadyExists";
    }
}
exports.RoomAlreadyExistsError = RoomAlreadyExistsError;
class AlreadyInSomeRoomError extends Error {
    constructor(message) {
        super(message);
        this.name = "AlreadyInSomeRoom";
    }
}
exports.AlreadyInSomeRoomError = AlreadyInSomeRoomError;
class AlreadyInThisRoomError extends Error {
    constructor(message) {
        super(message);
        this.name = "AlreadyInThisRoom";
    }
}
exports.AlreadyInThisRoomError = AlreadyInThisRoomError;
class NotHostError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotHost";
    }
}
exports.NotHostError = NotHostError;
