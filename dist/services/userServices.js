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
exports.deleteUsr = exports.updateUsr = exports.addUsr = exports.lgin = exports.getUsrById = exports.getUsrs = void 0;
const connection_1 = require("../config/connection");
const client_kms_1 = require("@aws-sdk/client-kms");
const TABLE_NAME = "UsersInfo";
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
// Encrypt the password
function encryptPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const encryptCommand = new client_kms_1.EncryptCommand({
            KeyId: process.env.KMS_KEY_ARN,
            Plaintext: new TextEncoder().encode(password),
        });
        const response = yield connection_1.kmsClient.send(encryptCommand);
        const ciphertextBase64 = Buffer.from(response.CiphertextBlob).toString("base64");
        return ciphertextBase64;
    });
}
// Decrypt the password
// Decrypt the base64-encoded ciphertext and return the plaintext password
function decryptPassword(ciphertextBase64) {
    return __awaiter(this, void 0, void 0, function* () {
        const ciphertext = Buffer.from(ciphertextBase64, "base64");
        const decryptCommand = new client_kms_1.DecryptCommand({
            CiphertextBlob: ciphertext,
        });
        const response = yield connection_1.kmsClient.send(decryptCommand);
        return new TextDecoder().decode(response.Plaintext);
    });
}
const getUsrs = () => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: TABLE_NAME,
    };
    const command = new lib_dynamodb_1.ScanCommand(params);
    const response = yield connection_1.dynamoClient.send(command);
    const questions = response;
    return questions;
});
exports.getUsrs = getUsrs;
const getUsrById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: id,
        },
    };
    const command = new lib_dynamodb_1.GetCommand(params);
    const response = yield connection_1.dynamoClient.send(command);
    const usr = response;
    return usr;
});
exports.getUsrById = getUsrById;
const lgin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: data.id,
        },
    };
    const command = new lib_dynamodb_1.GetCommand(params);
    const response = yield connection_1.dynamoClient.send(command);
    //console.log(response.Item);
    const usr = {
        id: (_a = response.Item) === null || _a === void 0 ? void 0 : _a.id,
        fullName: (_b = response.Item) === null || _b === void 0 ? void 0 : _b.fullName,
        password: yield decryptPassword((_c = response.Item) === null || _c === void 0 ? void 0 : _c.password),
        rolePosition: (_d = response.Item) === null || _d === void 0 ? void 0 : _d.rolePosition,
    };
    return usr;
});
exports.lgin = lgin;
const addUsr = (userinfo) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(userinfo);
    const user = {
        id: userinfo.id,
        fullName: userinfo.fullName,
        password: yield encryptPassword(userinfo.password),
        rolePosition: userinfo.rolePosition,
    };
    // console.log(user);
    // const dcry = await decryptPassword(user.password);
    // console.log(dcry);
    const params = {
        TableName: TABLE_NAME,
        Item: user,
        ConditionExpression: "attribute_not_exists(id)",
    };
    const command = new lib_dynamodb_1.PutCommand(params);
    return yield connection_1.dynamoClient.send(command);
});
exports.addUsr = addUsr;
const updateUsr = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: user.id,
        },
        UpdateExpression: "set rolePosition = :rolePosition",
        ExpressionAttributeValues: {
            ":rolePosition": user.rolePosition,
        },
    };
    const command = new lib_dynamodb_1.UpdateCommand(params);
    return yield connection_1.dynamoClient.send(command);
});
exports.updateUsr = updateUsr;
const deleteUsr = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: id,
        },
    };
    const command = new lib_dynamodb_1.DeleteCommand(params);
    return yield connection_1.dynamoClient.send(command);
});
exports.deleteUsr = deleteUsr;
//# sourceMappingURL=userServices.js.map