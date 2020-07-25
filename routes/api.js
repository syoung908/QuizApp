var express = require('express');
var querymen = require('querymen');
var router = express.Router();

const quizController = require('../controllers/quizController');

//Query quizzes
router.get('/quizzes', querymen.middleware(), quizController.queryQuizzes);

//Get all questions associated with the quizId
router.get('/quiz/:id', quizController.getQuiz);

//Get results of quiz
router.post('/quiz/:id');

module.exports = router;