import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../logger.js";

const router = Router();

import {
  addOrUpdateQuestion,
  getQuestions,
  deleteQuestion,
  getQuestionById,
  getSearchResult,
  updateQuestion,
} from "../controller/questioninfo.js";
import { deleteS3Object, uploadImage } from "../services/questionService.js";
import { upload } from "../utils/imageStorage.js";

router.get("/questions", async (req, res) => {
  try {
    logger.info("Fetching");
    const questions = await getQuestions();
    logger.info("Fetching Successful");
    res.json(questions);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.get("/questions/:id", async (req, res) => {
  const id = req.params.id;
  try {
    logger.info(`Fetching ${id}`);
    const question = await getQuestionById(id);
    logger.info(`Fetching ${id} Successful`);
    res.json(question);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.get("/questionsans/:data", async (req, res) => {
  const data = req.params.data;

  try {
    logger.info(`Searching ${data}`);
    const question = await getSearchResult(data);
    logger.info(`Searching ${data} Successful`);
    res.json(question);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.post("/questions", upload, async (req, res) => {
  const {
    question,
    answer,
    status,
    dateLog,
    secondary,
    createdBy,
    authorRole,
  } = JSON.parse(req.body.data);

  logger.info("Uploading");

  try {
    let imageLocation = [];
    let s3Keys = [];
    let id = uuidv4();
    const qa = question.toLowerCase() + " " + answer.toLowerCase();
    const qnavalue = {
      question: question,
      answer: answer,
      questionId: id,
      createdBy: createdBy,
      authorRole: authorRole,
      qa: qa,
      status: status,
      dateLog: dateLog,
      secondary: secondary,
      imageLocation: imageLocation,
      s3Keys: s3Keys,
    };

    const newQuestion = addOrUpdateQuestion(qnavalue);

    if (req.files) {
      const uploadPromises = Promise.all(
        req.files.map(async (file) => {
          try {
            const fileres = await uploadImage(file, id);
            logger.info(fileres, "done");
          } catch (error) {
            logger.error("Error:", error);
          }
        })
      );

      await uploadPromises;
      res.json(newQuestion);
    }

    logger.info("Upload Successful");
  } catch (err) {
    logger.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.put("/questions/:id", upload, async (req, res) => {
  const question = JSON.parse(req.body.data);
  let imageLocation = [];
  const { id } = req.params;
  question.id = id;
  try {
    logger.info(`Updating ${id}`);
    const newQuestion = await updateQuestion(question, imageLocation);

    if (req.files) {
      const uploadPromises = Promise.all(
        req.files.map(async (file) => {
          try {
            await uploadImage(file, id);
          } catch (error) {
            logger.error("Error:", error);
          }
        })
      );

      await uploadPromises;
      logger.info(`Updating ${id} Successful`);
      res.json(newQuestion);
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.delete("/questions/:id", async (req, res) => {
  const { id } = req.params;
  console.log(req.body.s3keys);
  const { s3keys } = req.body;

  try {
    logger.info("Deleting");
    s3keys.map(async (key) => {
      await deleteS3Object(key);
    });
    await deleteQuestion(id);
    logger.info("Question deleted successfully");
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

export default router;
