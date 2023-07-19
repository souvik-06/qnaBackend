import {
  getAllQuestions,
  getQstnById,
  getSrchResult,
  addOrUpdateQstn,
  updateQstn,
  deleteQstn,
} from "../services/questionService.js";

export const getQuestions = async (traceId) => {
  const questions = getAllQuestions(traceId);
  return questions;
};

export const getQuestionById = async (id, traceId) => {
  const question = getQstnById(id, traceId);
  return question;
};

//Api for searching
export const getSearchResult = async (data, traceId) => {
  const question = getSrchResult(data, traceId);
  return question;
};

export const addOrUpdateQuestion = async (question, traceId) => {
  const qstn = addOrUpdateQstn(question, traceId);
  return qstn;
};
export const updateQuestion = async (question, imageLocation, traceId) => {
  const qstn = updateQstn(question, imageLocation, traceId);
  return qstn;
};

export const deleteQuestion = async (id, traceId) => {
  const qstn = deleteQstn(id, traceId);
  return qstn;
};
