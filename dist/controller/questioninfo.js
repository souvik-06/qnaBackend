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
exports.deleteQuestion = exports.updateQuestion = exports.addOrUpdateQuestion = exports.getSearchResult = exports.getQuestionById = exports.getQuestions = void 0;
const questionService_1 = require("../services/questionService");
const getQuestions = (traceId) => __awaiter(void 0, void 0, void 0, function* () {
    const questions = (0, questionService_1.getAllQuestions)(traceId);
    return questions;
});
exports.getQuestions = getQuestions;
const getQuestionById = (id, traceId) => __awaiter(void 0, void 0, void 0, function* () {
    const question = (0, questionService_1.getQstnById)(id, traceId);
    return question;
});
exports.getQuestionById = getQuestionById;
//Api for searching
const getSearchResult = (data, traceId) => __awaiter(void 0, void 0, void 0, function* () {
    const question = (0, questionService_1.getSrchResult)(data, traceId);
    return question;
});
exports.getSearchResult = getSearchResult;
const addOrUpdateQuestion = (question, traceId) => __awaiter(void 0, void 0, void 0, function* () {
    const qstn = (0, questionService_1.addOrUpdateQstn)(question, traceId);
    return qstn;
});
exports.addOrUpdateQuestion = addOrUpdateQuestion;
const updateQuestion = (question, imageLocation, traceId) => __awaiter(void 0, void 0, void 0, function* () {
    const qstn = (0, questionService_1.updateQstn)(question, imageLocation, traceId);
    return qstn;
});
exports.updateQuestion = updateQuestion;
const deleteQuestion = (id, traceId) => __awaiter(void 0, void 0, void 0, function* () {
    const qstn = (0, questionService_1.deleteQstn)(id, traceId);
    return qstn;
});
exports.deleteQuestion = deleteQuestion;
//# sourceMappingURL=questioninfo.js.map