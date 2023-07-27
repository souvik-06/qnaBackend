"use strict";
// import aws from "aws-sdk";
// import dotenv from "dotenv";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kmsClient = exports.s3 = exports.dynamoClient = void 0;
// dotenv.config();
// import { aws_remote_config } from "./config.js";
// aws.config.update(aws_remote_config);
// export const dynamoClient = new aws.DynamoDB.DocumentClient();
// export const docClient = new aws.DynamoDB();
// export const s3 = new aws.S3({
//   accessKeyId: process.env.ACCESS_KEY_ID,
//   secretAccessKey: process.env.ACCESS_SECRET_KEY,
//   region: process.env.AWS_REGION,
// });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = require("dotenv");
const client_kms_1 = require("@aws-sdk/client-kms");
(0, dotenv_1.config)();
const region = process.env.AWS_REGION;
const kmsClient = new client_kms_1.KMSClient({ region: region });
exports.kmsClient = kmsClient;
const dynamoClient = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({ region }));
exports.dynamoClient = dynamoClient;
const s3 = new client_s3_1.S3Client({ region });
exports.s3 = s3;
//# sourceMappingURL=connection.js.map