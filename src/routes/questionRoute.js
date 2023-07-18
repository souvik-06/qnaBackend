import { Router } from "express"; //import express
import { v4 as uuidv4 } from "uuid";
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
    const questions = await getQuestions();
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.get("/questions/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const question = await getQuestionById(id);
    //console.log(question);
    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.get("/questionsans/:data", async (req, res) => {
  const data = req.params.data;

  try {
    const question = await getSearchResult(data);

    res.json(question);
  } catch (err) {
    console.error(err);
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
            console.log(fileres, "done");
          } catch (error) {
            // Handle error if any
            console.log("Error:", error);
          }
        })
      );

      await uploadPromises; // Wait for all upload promises to settle
      res.json(newQuestion);
    }

    // console.log(imageLocation);
    // const params = {
    //   TableName: "QuestionAnswer",
    //   Key: {
    //     questionId: id,
    //   },
    //   UpdateExpression: "set imageLocation = :r",
    //   ExpressionAttributeValues: {
    //     ":r": imageLocation,
    //   },
    // };
    // await dynamoClient.update(params).promise();

    console.log("running");
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.put("/questions/:id", upload, async (req, res) => {
  const question = JSON.parse(req.body.data);
  let imageLocation = [];
  //console.log("question",question);
  const { id } = req.params;
  // if (req.file) {
  //   uploadImage(req.file, id);
  // }
  question.id = id;
  try {
    console.log("imagelocation", question.imgLocation);
    const newQuestion = await updateQuestion(question, imageLocation);

    if (req.files) {
      const uploadPromises = Promise.all(
        req.files.map(async (file) => {
          try {
            const fileres = await uploadImage(file, id);
            console.log(fileres, "done");
          } catch (error) {
            // Handle error if any
            console.log("Error:", error);
          }
        })
      );

      await uploadPromises; // Wait for all upload promises to settle
      res.json(newQuestion);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.delete("/questions/:id", async (req, res) => {
  const { id } = req.params;
  //const s3Keys = JSON.parse(req.body.keys);
  console.log(req.body.s3keys);
  const { s3keys } = req.body;

  try {
    s3keys.map(async (key) => {
      await deleteS3Object(key);
    });
    await deleteQuestion(id); // Wait for deletion to complete
    console.log("working");
    res.json({ message: "Question deleted successfully" }); // Send response to frontend
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.delete("/s3keys/:key", async (req, res) => {
  const { key } = req.params;
  try {
    console.log(key);
  } catch (err) {}
});

export default router;
