export class RoomDoesNotExistError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RoomDoesNotExistError";
  }
}

export class AlreadyInRoomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AlreadyInRoomError";
  }
}