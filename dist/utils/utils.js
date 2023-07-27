"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCleanUser = exports.generateToken = void 0;
// generate token using secret from process.env.JWT_SECRET
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// generate token and return it
const generateToken = (user) => {
    //1. Don't use password and other sensitive fields
    //2. Use the information that are useful in other parts
    if (!user)
        return null;
    var u = {
        id: user.id,
        fullName: user.fullName,
        password: user.password,
        rolePosition: user.rolePosition,
    };
    return jsonwebtoken_1.default.sign(u, process.env.JWT_SECRET || "", {
        expiresIn: 60 * 60 * 24, // expires in 24 hours
    });
};
exports.generateToken = generateToken;
// return basic user details
const getCleanUser = (user) => {
    if (!user)
        return null;
    return {
        id: user.id,
        fullName: user.fullName,
        password: user.password,
        rolePosition: user.rolePosition,
    };
};
exports.getCleanUser = getCleanUser;
//# sourceMappingURL=utils.js.map