"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.addUser = exports.login = exports.getUserById = exports.getUsers = void 0;
const userServices_1 = require("../services/userServices");
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const questions = (0, userServices_1.getUsrs)();
    return questions;
});
exports.getUsers = getUsers;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const questions = (0, userServices_1.getUsrById)(id);
    return questions;
});
exports.getUserById = getUserById;
const login = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const questions = (0, userServices_1.lgin)(data);
    return questions;
});
exports.login = login;
const addUser = (userinfo) => __awaiter(void 0, void 0, void 0, function* () {
    const questions = (0, userServices_1.addUsr)(userinfo);
    return questions;
});
exports.addUser = addUser;
const updateUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const questions = (0, userServices_1.updateUsr)(user);
    return questions;
});
exports.updateUser = updateUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const questions = (0, userServices_1.deleteUsr)(id);
    return questions;
});
exports.deleteUser = deleteUser;
//# sourceMappingURL=userinfo.js.map