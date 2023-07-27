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
const logger_1 = require("../logger");
const router = (0, express_1.Router)();
const questioninfo_1 = require("../controller/questioninfo");
const questionService_1 = require("../services/questionService");
const imageStorage_1 = require("../utils/imageStorage");
// Gneertae 6 Digit Random number
function get6DigitRandomNumber() {
    let traceId = Math.floor(100000 + Math.random() * 900000);
    return traceId;
}
router.get("/questions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const traceId = get6DigitRandomNumber();
    try {
        logger_1.logger.info(`TraceID:${traceId},<------StartingPoint------>`);
        const questions = yield (0, questioninfo_1.getQuestions)(traceId);
        logger_1.logger.info(`TraceID:${traceId},<------EndPoint------>`);
        res.json({ traceId, questions }); // Include traceId in the response
    }
    catch (err) {
        logger_1.logger.error(`TraceID:${traceId}, Error:${err}`);
        res.status(500).json({ err: "Something went wrong" });
    }
}));
router.get("/signedUrl", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const traceId = get6DigitRandomNumber();
    try {
        const { id, fileName, fileType, questionId } = req.query;
        const url = yield (0, questionService_1.getSignedURL)(id, fileName, fileType, questionId);
        //console.log(url.body);
        res.json(url.body);
    }
    catch (err) {
        logger_1.logger.error(`TraceID:${traceId}, Error:${err}`);
        res.status(500).json({ err: "Something went wrong" });
    }
}));
router.get("/questions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const traceId = get6DigitRandomNumber();
    try {
        logger_1.logger.info(`TraceID:${traceId},<------StartingPoint------>`);
        const question = yield (0, questioninfo_1.getQuestionById)(id, traceId);
        logger_1.logger.info(`TraceID:${traceId},<------EndPoint------>`);
        res.json({ traceId, question });
    }
    catch (err) {
        logger_1.logger.error(`TraceID:${traceId}, Error:${err}`);
        res.status(500).json({ err: "Something went wrong" });
    }
}));
router.get("/questionsans/:data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.params.data;
    const traceId = get6DigitRandomNumber();
    try {
        logger_1.logger.info(`TraceID:${traceId},<------StartingPoint------>`);
        const question = yield (0, questioninfo_1.getSearchResult)(data, traceId);
        logger_1.logger.info(`TraceID:${traceId},<------EndPoint------>`);
        res.json({ traceId, question });
    }
    catch (err) {
        logger_1.logger.error(`TraceID:${traceId}, Error:${err}`);
        res.status(500).json({ err: "Something went wrong" });
    }
}));
router.post("/questions", imageStorage_1.upload, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log("before");
    const { question, questionId, answer, status, dateLog, secondary, createdBy, authorRole, } = JSON.parse(req.body.data);
    const traceId = get6DigitRandomNumber();
    logger_1.logger.info(`TraceID:${traceId},<------StartingPoint------>`);
    logger_1.logger.info(`TraceID:${traceId}, Data Incoming:${JSON.stringify(JSON.parse(req.body.data))}`);
    //console.log("in post");
    try {
        let imageLocation = [];
        let s3Keys = [];
        const qa = question.toLowerCase() + " " + answer.toLowerCase();
        const qnavalue = {
            question: question,
            answer: answer,
            questionId: questionId,
            createdBy: createdBy,
            authorRole: authorRole,
            qa: qa,
            status: status,
            dateLog: dateLog,
            secondary: secondary,
            imageLocation: imageLocation,
            s3Keys: s3Keys,
        };
        (0, questioninfo_1.addOrUpdateQuestion)(qnavalue, traceId);
        // if (req.files) {
        //   const allFiles: any = req.files;
        //   const uploadPromises = Promise.all(
        //     allFiles.map(async (file: any) => {
        //       try {
        //         await uploadImage(file, id, traceId);
        //       } catch (error) {
        //         logger.error(`TraceID:${traceId}, Error:${error}`);
        //       }
        //     })
        //   );
        //   await uploadPromises;
        logger_1.logger.info(`TraceID:${traceId},<------EndPoint------>`);
        res.json(traceId);
        // }
    }
    catch (err) {
        logger_1.logger.error(`TraceID:${traceId}, Error:${err}`);
        res.status(500).json({ err: "Something went wrong" });
    }
}));
router.put("/questions/:id", imageStorage_1.upload, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const question = JSON.parse(req.body.data);
    let imageLocation = [];
    const { id } = req.params;
    const traceId = get6DigitRandomNumber();
    question.id = id;
    try {
        logger_1.logger.info(`TraceID:${traceId},<------StartingPoint------>`);
        logger_1.logger.info(`TraceID:${traceId}, Data Incoming:${JSON.stringify(JSON.parse(req.body.data))}`);
        yield (0, questioninfo_1.updateQuestion)(question, imageLocation, traceId);
        // if (req.files) {
        //   const allFiles: any = req.files;
        //   const uploadPromises = Promise.all(
        //     allFiles.map(async (file: any) => {
        //       try {
        //         await uploadImage(file, id, traceId);
        //       } catch (error) {
        //         logger.error(`TraceID:${traceId}, Error:${error}`);
        //       }
        //     })
        //   );
        //   await uploadPromises;
        logger_1.logger.info(`TraceID:${traceId},<------EndPoint------>`);
        res.json(traceId);
    }
    catch (err) {
        logger_1.logger.error(`TraceID:${traceId}, Error:${err}`);
        res.status(500).json({ err: "Something went wrong" });
    }
}));
router.delete("/questions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    //console.log(req.body.s3keys);
    const { s3keys } = req.body;
    const traceId = get6DigitRandomNumber();
    try {
        logger_1.logger.info(`TraceID:${traceId},<------StartingPoint------>`);
        s3keys.map((key) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, questionService_1.deleteS3Object)(key, traceId);
        }));
        yield (0, questioninfo_1.deleteQuestion)(id, traceId);
        logger_1.logger.info(`TraceID:${traceId},<------EndPoint------>`);
        res.json({ message: "Question deleted successfully", traceId: traceId });
    }
    catch (err) {
        logger_1.logger.error(`TraceID:${traceId}, Error:${err}`);
        res.status(500).json({ err: "Something went wrong" });
    }
}));
exports.default = router;
//# sourceMappingURL=questionRoute.js.map