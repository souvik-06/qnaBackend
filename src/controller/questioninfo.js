import {
  getAllQuestions,
  getQstnById,
  getSrchResult,
  addOrUpdateQstn,
  updateQstn,
  deleteQstn,
} from "../services/questionService.js";

export const getQuestions = async () => {
  const questions = getAllQuestions();
  return questions;
};

export const getQuestionById = async (id) => {
  const question = getQstnById(id);
  return question;
};

//Api for searching
export const getSearchResult = async (data) => {
  const question = getSrchResult(data);
  return question;
};

export const addOrUpdateQuestion = async (question) => {
  const qstn = addOrUpdateQstn(question);
  return qstn;
};
export const updateQuestion = async (question, imageLocation) => {
  const qstn = updateQstn(question, imageLocation);
  return qstn;
};

export const deleteQuestion = async (id) => {
  const qstn = deleteQstn(id);
  return qstn;
};
