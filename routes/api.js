/**
 * API Router.
 *
 * Defines the routes for the server API.
 *
 * @file    Routes for server API.
 * @author  syoung908
 * @since   1.0.0
 * @version 1.0.0
 */

var express = require('express');
var querymen = require('querymen');
var router = express.Router();

const quizController = require('../controllers/quizController');

//Schema for parsing query string to filter difficulties
const schema = {
  filter: {
    type: [String],
    paths: ['difficulty'],
    operator: '$nin',
  }
};

//Query quizzes
router.get('/quizzes', querymen.middleware(schema), quizController.queryQuizzes);

//Get random quiz
router.get('/random', quizController.getRandomQuiz);

//Get all questions associated with the quizId
router.get('/quiz/:id', quizController.getQuiz);

//Get results of quiz
router.post('/quiz/:id', quizController.submitAnswers);

module.exports = router;