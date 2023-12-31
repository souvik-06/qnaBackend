import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../logger";

const router = Router();

import {
  addOrUpdateQuestion,
  getQuestions,
  deleteQuestion,
  getQuestionById,
  getSearchResult,
  updateQuestion,
} from "../controller/questioninfo";
import {
  deleteS3Object,
  getSignedURL,
  uploadImage,
} from "../services/questionService";
import { upload } from "../utils/imageStorage";

// Gneertae 6 Digit Random number
function get6DigitRandomNumber() {
  let traceId: number = Math.floor(100000 + Math.random() * 900000);
  return traceId;
}

router.get("/questions", async (req, res) => {
  const traceId = get6DigitRandomNumber();
  try {
    logger.info(`TraceID:${traceId},<------StartingPoint------>`);
    const questions = await getQuestions(traceId);
    logger.info(`TraceID:${traceId},<------EndPoint------>`);
    res.json({ traceId, questions }); // Include traceId in the response
  } catch (err) {
    logger.error(`TraceID:${traceId}, Error:${err}`);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.get("/signedUrl", async (req, res) => {
  const traceId = get6DigitRandomNumber();
  try {
    const { id, fileName, fileType, questionId } = req.query;

    const url = await getSignedURL(id, fileName, fileType, questionId);
    //console.log(url.body);
    res.json(url.body);
  } catch (err) {
    logger.error(`TraceID:${traceId}, Error:${err}`);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.get("/questions/:id", async (req, res) => {
  const id = req.params.id;
  const traceId = get6DigitRandomNumber();
  try {
    logger.info(`TraceID:${traceId},<------StartingPoint------>`);
    const question = await getQuestionById(id, traceId);
    logger.info(`TraceID:${traceId},<------EndPoint------>`);
    res.json({ traceId, question });
  } catch (err) {
    logger.error(`TraceID:${traceId}, Error:${err}`);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.get("/questionsans/:data", async (req, res) => {
  const data = req.params.data;
  const traceId = get6DigitRandomNumber();
  try {
    logger.info(`TraceID:${traceId},<------StartingPoint------>`);
    const question = await getSearchResult(data, traceId);
    logger.info(`TraceID:${traceId},<------EndPoint------>`);
    res.json({ traceId, question });
  } catch (err) {
    logger.error(`TraceID:${traceId}, Error:${err}`);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.post("/questions", upload, async (req, res) => {
  //console.log("before");
  const {
    question,
    questionId,
    answer,
    status,
    dateLog,
    secondary,
    createdBy,
    authorRole,
  } = JSON.parse(req.body.data);

  const traceId = get6DigitRandomNumber();

  logger.info(`TraceID:${traceId},<------StartingPoint------>`);
  logger.info(
    `TraceID:${traceId}, Data Incoming:${JSON.stringify(
      JSON.parse(req.body.data)
    )}`
  );

  //console.log("in post");

  try {
    let imageLocation: string[] = [];
    let s3Keys: string[] = [];
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

    addOrUpdateQuestion(qnavalue, traceId);

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
      logger.info(`TraceID:${traceId},<------EndPoint------>`);
      res.json(traceId);
    // }
  } catch (err) {
    logger.error(`TraceID:${traceId}, Error:${err}`);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.put("/questions/:id", upload, async (req, res) => {
  const question = JSON.parse(req.body.data);
  let imageLocation: string[] = [];
  const { id } = req.params;
  const traceId = get6DigitRandomNumber();
  question.id = id;
  try {
    logger.info(`TraceID:${traceId},<------StartingPoint------>`);
    logger.info(
      `TraceID:${traceId}, Data Incoming:${JSON.stringify(
        JSON.parse(req.body.data)
      )}`
    );
    await updateQuestion(question, imageLocation, traceId);

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
      logger.info(`TraceID:${traceId},<------EndPoint------>`);
      res.json(traceId);
    
  } catch (err) {
    logger.error(`TraceID:${traceId}, Error:${err}`);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.delete("/questions/:id", async (req, res) => {
  const { id } = req.params;
  //console.log(req.body.s3keys);
  const { s3keys } = req.body;
  const traceId = get6DigitRandomNumber();
  try {
    logger.info(`TraceID:${traceId},<------StartingPoint------>`);
    s3keys.map(async (key: string) => {
      await deleteS3Object(key, traceId);
    });
    await deleteQuestion(id, traceId);
    logger.info(`TraceID:${traceId},<------EndPoint------>`);
    res.json({ message: "Question deleted successfully", traceId: traceId });
  } catch (err) {
    logger.error(`TraceID:${traceId}, Error:${err}`);
    res.status(500).json({ err: "Something went wrong" });
  }
});

export default router;
