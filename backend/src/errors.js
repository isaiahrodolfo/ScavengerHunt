"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotHostError = exports.NotInThisRoomError = exports.AlreadyInSomeRoomError = exports.RoomAlreadyExistsError = exports.RoomDoesNotExistError = void 0;
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
class NotInThisRoomError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotInThisRoom";
    }
}
exports.NotInThisRoomError = NotInThisRoomError;
class NotHostError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotHost";
    }
}
exports.NotHostError = NotHostError;
