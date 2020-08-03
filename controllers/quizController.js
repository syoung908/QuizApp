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

/** 
 * queryQuizzes. 
 *
 * Returns all quizzes that are found given query parameters. If no query 
 * parameters are given then all quizzes will be returned (up to 30 for one
 * page by default). 
 * 
 * @since 1.0.0
 * 
 * @param  {String}  req.queryman  A queryman object that is produced by the 
 *                                 queryman middleware that contains the parsed
 *                                 query parameters from a query-string.
 * 
 * @return {Object}  JSON containing all quizzes that match the given query 
 *                   parameters. 
 */
exports.queryQuizzes = async(req, res) => {
  try {
    // Replace $in with $nin (appears to be package bug)
    if (req.querymen.query.difficulty) {
      req.querymen.query.difficulty['$nin'] = req.querymen.query.difficulty['$in'];
      delete req.querymen.query.difficulty['$in'];
    }
    
    //console.log(req.querymen.query);
    //console.log(req.querymen.select);
    //console.log(req.querymen.cursor);

    quizModel.find(
      req.querymen.query,
      req.querymen.select,
      req.querymen.cursor
    )
      .select("-__v")
      .then(data => res.json({results: data}))
      .catch((err) => {
        console.error(err);
        res.statusMessage = "Database Query Failed";
        res.status(500).end();
      })
  } catch (err) {
    console.error(err);
    res.statusMessage = "Error Processing Request";
    res.status(500).end();
  }
}

const randomQuizzes = async(req, res) => {
  const tags = [
    "Computer Science", "Math", "Biology", "Java", "C++",
    "Javascript", "Python", "Algebra", "Calculus", "History",
    "English", "Spanish", "Chemistry", "Anatomy", 
  ];
  const diffs = ["Easy", "Medium", "Hard"];

  const getRandom = (arr, n) =>{
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }

  for (let i = 0; i < 50; i++) {
    let randomTags = getRandom(tags, 5);
    randomTags.push("Empty");
    let diff = diffs[Math.floor(Math.random() * diffs.length)];
    let newRandomQuiz = new quizModel({
      name: "Empty Quiz "+ i,
      difficulty: diff,
      tags: randomTags
    })
    newRandomQuiz.save();

  }
}

/** 
 * queryQuizzes. 
 *
 * Returns a random quiz from the database.
 * 
 * @since 1.0.0
 * 
 * @return {Object}  JSON containing aa single random quiz. 
 */
exports.getRandomQuiz = async(req, res) => {
  try {
    const count =  await quizModel.countDocuments();
    var random = Math.floor(Math.random() * count);

    quizModel.findOne().skip(random)
    .then(data => res.json({results: data}))
    .catch((err) => {
      console.error(err);
      res.statusMessage = "Database Query Failed";
      res.status(500).end();
    })
  } catch (err) {
    console.error(err);
    res.statusMessage = "Error Processing Request";
    res.status(500);
  }
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
      res.statusMessage = "Missing Quiz ID";
      res.status(400).end();
    } else if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      res.statusMessage = "Invalid Quiz ID";
      res.status(400).end();
    } else {
      questionModel.find(
        {_quizId: new ObjectId(req.params.id)})
        .select("-correct -__v")
        .exec()
        .then(data => res.json({results: data}))
        .catch(err => {
          console.error(err);
          res.statusMessage = "Database Query Failed"
          res.status(500).end();
      });
    }
  } catch (err) {
    console.error(err);
    res.statusMessage = "Error Processing Request";
    res.status(500);
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
    if (!req.params.id) {
      res.statusMessage = "Missing Quiz ID";
      res.status(400).end();
    } else if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      res.statusMessage = "Invalid Quiz ID";
      res.status(400).end();
    } else if(!req.body.answers) {
      res.statusMessage = "No Answers in Request Body";
      res.status(400).end();
    } else {
      // Generate answer key
      let questions = await questionModel.find(
        {_quizId: new ObjectId(req.params.id)}
      );

      if (!questions || questions.length == 0) {
        res.statusMessage = "No Questions Associated with ID";
        res.status(400).end()
      } else {
        questions.forEach((question) => {
          answerKey.set(question._id.toString(), question.correct);
        });
        res.json(quizUtils.processQuiz(req.body.answers, answerKey));
      }
    }
  } catch (err) {
    console.error(err);
    res.statusMessage = "Error Processing Request";
    res.status(500);
  }
}