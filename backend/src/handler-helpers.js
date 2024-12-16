"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfGameExists = checkIfGameExists;
const types_1 = require("./types"); // Import types
function checkIfGameExists(gameCode) {
    if (Object.values(types_1.games).find((game) => game.code === gameCode)) {
        return Error(`No game exists with code ${gameCode}`);
    }
}
