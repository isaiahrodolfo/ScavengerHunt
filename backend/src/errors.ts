export class RoomDoesNotExistError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RoomDoesNotExist";
  }
}

export class RoomAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RoomAlreadyExists";
  }
}

export class AlreadyInSomeRoomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AlreadyInSomeRoom";
  }
}

export class NotInThisRoomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotInThisRoom";
  }
}

export class NotHostError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotHost";
  }
}