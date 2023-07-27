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
exports.getSignedURL = exports.uploadImage = exports.deleteS3Object = exports.deleteQstn = exports.updateQstn = exports.addOrUpdateQstn = exports.getSrchResult = exports.getQstnById = exports.getAllQuestions = void 0;
const connection_1 = require("../config/connection");
const uuid_1 = require("uuid");
const client_s3_1 = require("@aws-sdk/client-s3");
const logger_1 = require("../logger");
const TABLE_NAME = "QuestionAnswer";
// export const getAllQuestions = async () => {
//   const params = {
//     TableName: TABLE_NAME,
//   };
//   const questions = await dynamoClient.scan(params).promise();
//   return questions;
// };
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const getAllQuestions = (traceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = {
            TableName: TABLE_NAME,
        };
        logger_1.logger.info(`TraceID:${traceId}, Fetching All Questions from DynamoDB TableName ${TABLE_NAME}`);
        const command = new lib_dynamodb_1.ScanCommand(params);
        const response = yield connection_1.dynamoClient.send(command);
        const questions = response;
        return questions;
    }
    catch (error) {
        logger_1.logger.error(`TraceID:${traceId}, Error:${error}`);
    }
});
exports.getAllQuestions = getAllQuestions;
// export const getQstnById = async (id) => {
//   const params = {
//     TableName: TABLE_NAME,
//     Key: {
//       questionId: id,
//     },
//   };
//   return await dynamoClient.get(params).promise();
// };
const getQstnById = (id, traceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`TraceID:${traceId}, Fetching Specific Question from DynamoDB TableName ${TABLE_NAME}`);
        const params = {
            TableName: TABLE_NAME,
            Key: {
                questionId: id,
            },
        };
        const command = new lib_dynamodb_1.GetCommand(params);
        const response = yield connection_1.dynamoClient.send(command);
        const question = response;
        return question;
    }
    catch (error) {
        logger_1.logger.error(`TraceID:${traceId}, Error:${error}`);
    }
});
exports.getQstnById = getQstnById;
//Api for searching
const getSrchResult = (data, traceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`TraceID:${traceId}, Fetching from DynamoDB TableName ${TABLE_NAME}`);
        const params = {
            TableName: TABLE_NAME,
            FilterExpression: "contains(qa, :qa)",
            ExpressionAttributeValues: {
                ":qa": data,
            },
        };
        const command = new lib_dynamodb_1.ScanCommand(params);
        const response = yield connection_1.dynamoClient.send(command);
        const result = response;
        return result;
    }
    catch (error) {
        logger_1.logger.error(`TraceID:${traceId}, Error:${error}`);
    }
});
exports.getSrchResult = getSrchResult;
// export const addOrUpdateQstn = async (question) => {
//   const params = {
//     TableName: TABLE_NAME,
//     Item: question,
//   };
//   return await dynamoClient.put(params).promise();
// };
const addOrUpdateQstn = (question, traceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`TraceID:${traceId}, Adding Question To DynamoDB TableName:${TABLE_NAME}`);
        const params = {
            TableName: TABLE_NAME,
            Item: question,
        };
        const command = new lib_dynamodb_1.PutCommand(params);
        return yield connection_1.dynamoClient.send(command);
    }
    catch (error) {
        logger_1.logger.error(`TraceID:${traceId}, Error:${error}`);
    }
});
exports.addOrUpdateQstn = addOrUpdateQstn;
// export const updateQstn = async (question, imageLocation) => {
//   // console.log("question",question);
//   // console.log("imageLoc",imageLocation);
//   //console.log("last imageloc", question.secondary[0].imgdata);
//   const params = {
//     TableName: TABLE_NAME,
//     Key: {
//       questionId: question.id,
//     },
//     UpdateExpression:
//       "set question = :q, answer = :a, qa = :qa, dateLog = :dt,secondary=:sc,imageLocation = :imgl,createdBy=:cb,authorRole=:ar",
//     ExpressionAttributeValues: {
//       ":q": question.question,
//       ":a": question.answer,
//       ":qa":
//         question.question.toLowerCase() + " " + question.answer.toLowerCase(),
//       ":dt": question.dateLog,
//       ":sc": question.secondary,
//       ":imgl": [...imageLocation, ...question.imgLocation],
//       ":cb": question.createdBy,
//       ":ar": question.authorRole,
//     },
//   };
//   return await dynamoClient.update(params).promise();
// };
const updateQstn = (question, imageLocation, traceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`TraceID:${traceId}, Updating Qestion to DynamoDB TableName:${TABLE_NAME}`);
        const params = {
            TableName: TABLE_NAME,
            Key: {
                questionId: question.id,
            },
            UpdateExpression: "SET question = :q, answer = :a, qa = :qa, dateLog = :dt, secondary = :sc, imageLocation = :imgl, createdBy = :cb, authorRole = :ar",
            ExpressionAttributeValues: {
                ":q": question.question,
                ":a": question.answer,
                ":qa": question.question.toLowerCase() + " " + question.answer.toLowerCase(),
                ":dt": question.dateLog,
                ":sc": question.secondary,
                ":imgl": [...imageLocation, ...question.imgLocation],
                ":cb": question.createdBy,
                ":ar": question.authorRole,
            },
        };
        const command = new lib_dynamodb_1.UpdateCommand(params);
        return yield connection_1.dynamoClient.send(command);
    }
    catch (error) {
        logger_1.logger.error(`TraceID:${traceId}, Error:${error}`);
    }
});
exports.updateQstn = updateQstn;
// export const deleteQstn = async (id) => {
//   const params = {
//     TableName: TABLE_NAME,
//     Key: {
//       questionId: id,
//     },
//   };
//   console.log("first");
//   return await dynamoClient.delete(params).promise();
// };
const deleteQstn = (id, traceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`TraceID:${traceId}, Deleting QuestionID:${id} from DynamoDB TableName:${TABLE_NAME}`);
        const params = {
            TableName: TABLE_NAME,
            Key: {
                questionId: id,
            },
        };
        const command = new lib_dynamodb_1.DeleteCommand(params);
        return yield connection_1.dynamoClient.send(command);
    }
    catch (error) {
        logger_1.logger.error(`TraceID:${traceId}, Error:${error}`);
    }
});
exports.deleteQstn = deleteQstn;
// export const deleteS3Object = async (objectKey) => {
//   try {
//     var params = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: objectKey,
//     };
//     s3.deleteObject(params, function (err, data) {
//       if (err) console.log(err, err.stack); // an error occurred
//       else console.log(data); // successful response
//     });
//   } catch (error) {
//     console.error("Error deleting object:", error);
//   }
// };
const deleteS3Object = (objectKey, traceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`TraceID:${traceId}, Deleting from s3Bucket ${objectKey}`);
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: objectKey,
        };
        const command = new client_s3_1.DeleteObjectCommand(params);
        const response = yield connection_1.s3.send(command);
    }
    catch (error) {
        logger_1.logger.error(`TraceID:${traceId}, Error:${error}`);
    }
});
exports.deleteS3Object = deleteS3Object;
// export const uploadImage = (file, id) => {
//   const uniqueId = uuidv4();
//   return new Promise((resolve, reject) => {
//     const params = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: uniqueId + file.originalname,
//       Body: file.buffer,
//       ContentType: file.type,
//     };
//     s3.upload(params, async (error, data) => {
//       if (error) {
//         console.log(error);
//         reject(error);
//       } else {
//         const params = {
//           TableName: "QuestionAnswer",
//           Key: {
//             questionId: id,
//           },
//           UpdateExpression:
//             "SET #listAttr = list_append(#listAttr, :newString), #anotherAttr = list_append(#anotherAttr, :newData)",
//           ExpressionAttributeNames: {
//             "#listAttr": "imageLocation",
//             "#anotherAttr": "s3Keys",
//           },
//           ExpressionAttributeValues: {
//             ":newString": [data.Location],
//             ":newData": [uniqueId + file.originalname],
//           },
//         };
//         dynamoClient.update(params, function (err, data) {
//           if (err) {
//             console.log("thissssss");
//             // console.log("Error:", err);
//             reject(err);
//           } else {
//             console.log("Item updated successfully:", data);
//             resolve(data);
//           }
//         });
//       }
//     });
//   });
// };
const uploadImage = (file, id, traceId) => __awaiter(void 0, void 0, void 0, function* () {
    const uniqueId = (0, uuid_1.v4)();
    try {
        logger_1.logger.info(`TraceID:${traceId}, Uploading Image to s3Bucket ${process.env.S3_BUCKET_NAME}`);
        const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: uniqueId + file.originalname,
            Body: file.buffer,
            ContentType: file.type,
        };
        const command = new client_s3_1.PutObjectCommand(uploadParams);
        const response = yield connection_1.s3.send(command);
        const updateParams = {
            TableName: "QuestionAnswer",
            Key: {
                questionId: id,
            },
            UpdateExpression: "SET #listAttr = list_append(#listAttr, :newString), #anotherAttr = list_append(#anotherAttr, :newData)",
            ExpressionAttributeNames: {
                "#listAttr": "imageLocation",
                "#anotherAttr": "s3Keys",
            },
            ExpressionAttributeValues: {
                ":newString": [
                    `https://${uploadParams.Bucket}.s3.${process.env.MY_REGION}.amazonaws.com/${uploadParams.Key}`,
                ],
                ":newData": [uniqueId + file.originalname],
            },
        };
        const updateCommand = new lib_dynamodb_1.UpdateCommand(updateParams);
        const updateResponse = yield connection_1.dynamoClient.send(updateCommand);
        logger_1.logger.info(`TraceID:${traceId}, Uploaded Image Successfully`);
        return updateResponse;
    }
    catch (error) {
        logger_1.logger.error(`TraceID:${traceId}, Error:${error}`);
    }
});
exports.uploadImage = uploadImage;
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const getSignedURL = (id, fileName, contentType, questionId) => __awaiter(void 0, void 0, void 0, function* () {
    const uniqueId = (0, uuid_1.v4)();
    console.log(fileName, contentType);
    try {
        // Now you can use the expirationDate in your params
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: uniqueId + fileName,
            ContentType: contentType,
        };
        const command = new client_s3_1.PutObjectCommand(params);
        const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(connection_1.s3, command);
        //console.log(signedUrl);
        const updateParams = {
            TableName: "QuestionAnswer",
            Key: {
                questionId: questionId,
            },
            UpdateExpression: "SET #listAttr = list_append(#listAttr, :newString), #anotherAttr = list_append(#anotherAttr, :newData)",
            ExpressionAttributeNames: {
                "#listAttr": "imageLocation",
                "#anotherAttr": "s3Keys",
            },
            ExpressionAttributeValues: {
                ":newString": [
                    `https://${params.Bucket}.s3.${process.env.MY_REGION}.amazonaws.com/${params.Key}`,
                ],
                ":newData": [params.Key],
            },
        };
        const updateCommand = new lib_dynamodb_1.UpdateCommand(updateParams);
        yield connection_1.dynamoClient.send(updateCommand);
        return {
            statusCode: 200,
            body: JSON.stringify({ url: signedUrl }),
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error generating presigned URL" }),
        };
    }
});
exports.getSignedURL = getSignedURL;
//# sourceMappingURL=questionService.js.map