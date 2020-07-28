var express = require('express');
var querymen = require('querymen');
var router = express.Router();

const quizController = require('../controllers/quizController');

const schema = new querymen.Schema({
  filter: {
    type: [String],
    operator: '$nin',
    paths: ['difficulty'],
  }
});

//Query quizzes
router.get('/quizzes', querymen.middleware(schema), quizController.queryQuizzes);

//Query quizzes

//Get all questions associated with the quizId
router.get('/quiz/:id', quizController.getQuiz);

//Get results of quiz
router.post('/quiz/:id', quizController.submitAnswers);

module.exports = router;