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
const express_1 = require("express");
const jsonwebtoken_1 = require("jsonwebtoken");
const utils_1 = require("../utils/utils");
const logger_1 = require("../logger");
const router = (0, express_1.Router)();
const userinfo_1 = require("../controller/userinfo");
router.get("/userinfo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, userinfo_1.getUsers)();
        res.json(users);
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(500).json({ err: "Something went wrong" });
    }
}));
router.get("/userinfo/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield (0, userinfo_1.getUserById)(id);
        res.json(user);
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(500).json({ err: "Something went wrong" });
    }
}));
router.post("/logininfo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    try {
        const newUser = yield (0, userinfo_1.login)(req.body);
        logger_1.logger.info(newUser);
        logger_1.logger.info(password);
        if (newUser.password === password) {
            const token = (0, utils_1.generateToken)(newUser);
            const userObj = (0, utils_1.getCleanUser)(newUser);
            const usr = {
                id: userObj === null || userObj === void 0 ? void 0 : userObj.id,
                fullName: userObj === null || userObj === void 0 ? void 0 : userObj.fullName,
                rolePosition: userObj === null || userObj === void 0 ? void 0 : userObj.rolePosition,
            };
            return res.json({ Item: usr, token });
        }
        else {
            logger_1.logger.warn("Invalid credentials found");
            res.status(401).json({ err: "Invalid credentials found" });
        }
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(500).json({ err: "Something went wrong" });
    }
}));
router.post("/userinfo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, fullName, password, rolePosition } = req.body;
    const data = {
        id: id,
        fullName: fullName,
        password: password,
        rolePosition: rolePosition,
    };
    try {
        const newUser = yield (0, userinfo_1.addUser)(data);
        res.json(newUser);
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(500).json({ err: err });
    }
}));
//==================================================================
router.post("/tokeninfo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    var decodedClaims = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET || "");
    const { id, password } = decodedClaims;
    try {
        const newUser = yield (0, userinfo_1.login)(decodedClaims);
        if (newUser.Item.password === password) {
            const userObj = (0, utils_1.getCleanUser)(newUser.Item);
            return res.json({ Item: userObj });
        }
        else {
            logger_1.logger.warn("Invalid credentials found");
            res.status(500).json({ err: "Invalid credentials found" });
        }
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(500).json({ err: "Something went wrong" });
    }
}));
//==================================================================
router.put("/userinfo/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    const { id } = req.params;
    user.id = id;
    try {
        const editUser = yield (0, userinfo_1.updateUser)(user);
        res.json(editUser);
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(500).json({ err: "Something went wrong" });
    }
}));
router.delete("/userinfo/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        res.json(yield (0, userinfo_1.deleteUser)(id));
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(500).json({ err: "Something went wrong" });
    }
}));
exports.default = router;
//# sourceMappingURL=userRoute.js.map