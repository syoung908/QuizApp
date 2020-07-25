/**
 * Quiz Controller.
 *
 * Module which contains controllers for requests regarding the quiz and 
 * and question schema.
 *
 * @module  quizController
 * @file    This file defines functions that handle various API requests 
 *          regarding quizzes
 * @author  syoung908
 * @since   1.0.0
 */

const quizModel = require('../models/quizModel');
const questionModel = require('../models/questionModel');

const quizUtils = require('../src/util/quizUtils');

const ObjectId = require('mongoose').Types.ObjectId;

exports.queryQuizzes = (req, res) => {
  
}


/** 
 * getQuiz. 
 *
 * Returns all questions associated with the given quizId as a parameter in 
 * the request object.
 * 
 * @since 1.0.0
 * 
 * @param  {String}  req.params.id  The id of the quiz that the user is 
 *                                  requesting  
 * 
 * @return {Object}  JSON containing a list of all questions associated with 
 *                   the quizId or an error code if the query failed or the 
 *                   id was invalid.
 */
exports.getQuiz = (req, res) => {
  try {
    if (!req.params.id) {
      res.status(400).json("Missing Quiz ID");
    } else {
      questionModel.find(
        {_quizId: new ObjectId(req.params.id)})
        .select("-correct -__v")
        .exec()
        .then(data => res.json({results: data}))
        .catch(err => {
          console.error(err);
          res.status(500).json("Database Query Failed");
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error Processing Request");
  }
}


/** 
 * submitAnswers. 
 *
 * Checks the list of answers in the body of the request against the correct 
 * answers and returns the results. Incorrect answers will have the correct 
 * answers returned.
 * 
 * @since 1.0.0
 * 
 * @param  {String}  req.params.id  The id of the quiz that the user is 
 *                                  submitting answers for
 * 
 * @return {Object}  JSON containing the results of the quiz: answers correct,  
 *                   total, and corrections for questions the user got wrong.
 *                   Returns error codes in the event of a server error or
 *                   invalid parameters.
 */
exports.submitAnswers = async(req, res) => {
  try {
    let answerKey = new Map();
    if (!req.id) {
      res.status(400).json("Missing Quiz ID");
    } else if(!req.body.answers) {
      res.status(400).json("No Answers in Request Body");
    } else {
      // Generate answer key
      let questions = await questionModel.find(
        {_quizId: new ObjectId(req.params.id)}
      );

      if (questions.length == 0) {
        res.status(400).json("No Questions Associated with ID");
      } else {
        for (question in questions) {
          answerKey.set(question._questionId, question.correct);
        }

        res.json(quizUtils.processQuiz(req.body.answers, answerKey));
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Error Processing Request");
  }
}