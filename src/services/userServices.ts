import { dynamoClient, kmsClient } from "../config/connection";
import { EncryptCommand, DecryptCommand } from "@aws-sdk/client-kms";

const TABLE_NAME = "UsersInfo";

import {
  ScanCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

// Encrypt the password
async function encryptPassword(password: string): Promise<string> {
  const encryptCommand = new EncryptCommand({
    KeyId: process.env.KMS_KEY_ARN, // Replace with the ARN or alias of your CMK
    Plaintext: new TextEncoder().encode(password),
  });

  const response = await kmsClient.send(encryptCommand);
  const ciphertextBase64 = Buffer.from(response.CiphertextBlob!).toString(
    "base64"
  );
  return ciphertextBase64;
}

// Decrypt the password
// Decrypt the base64-encoded ciphertext and return the plaintext password
async function decryptPassword(ciphertextBase64: string): Promise<string> {
  const ciphertext = Buffer.from(ciphertextBase64, "base64");

  const decryptCommand = new DecryptCommand({
    CiphertextBlob: ciphertext,
  });

  const response = await kmsClient.send(decryptCommand);
  return new TextDecoder().decode(response.Plaintext);
}

export const getUsrs = async () => {
  const params = {
    TableName: TABLE_NAME,
  };

  const command = new ScanCommand(params);
  const response = await dynamoClient.send(command);
  const questions = response;

  return questions;
};

export const getUsrById = async (id: string) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: id,
    },
  };

  const command = new GetCommand(params);
  const response = await dynamoClient.send(command);
  const usr = response;

  return usr;
};

export const lgin = async (data: any) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: data.id,
    },
  };

  const command = new GetCommand(params);
  const response = await dynamoClient.send(command);

  //console.log(response.Item);
  const usr = {
    id: response.Item?.id,
    fullName: response.Item?.fullName,
    password: await decryptPassword(response.Item?.password),
    rolePosition: response.Item?.rolePosition,
  };
  return usr;
};

export const addUsr = async (userinfo: any) => {
  //console.log(userinfo);
  const user = {
    id: userinfo.id,
    fullName: userinfo.fullName,
    password: await encryptPassword(userinfo.password),
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

  const command = new PutCommand(params);
  return await dynamoClient.send(command);
};

export const updateUsr = async (user: any) => {
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

  const command = new UpdateCommand(params);
  return await dynamoClient.send(command);
};

export const deleteUsr = async (id: string) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: id,
    },
  };

  const command = new DeleteCommand(params);
  return await dynamoClient.send(command);
};
