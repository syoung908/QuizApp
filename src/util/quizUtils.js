/**
 * Quiz Schema Utilities.
 *
 * Contains various utilities for use with the quiz database schema.
 *
 * @module  quizUtils
 * @file    This file defines utilites for creating, manipulating, and 
 *          processing quizzes defined by the quiz schema.
 * @author  syoung908
 * @version 1.0.0
 * @since   1.0.0
 */

/** 
 * processQuiz. 
 *
 * Compares the user's answers with the answer key and returns the user's score 
 * and the correct answer for any incorrect answers.
 * 
 * @since 1.0.0
 * 
 * @param  {Object}   userAnswers  An object containing questionId, answer 
 *                                 pairs that the user submitted. 
 * @param  {Map}      answerKey    A map with the questionId as the key and the 
 *                                 correct answer as the value.
 * 
 * @return {Object}  The number of correct answers, total questions, and the 
 *                   correct answers for any questions the user answered 
 *                   incorrectly as an object with questionId, answerPairs.
 */

exports.processQuiz = (userAnswers, answerKey) => {
  let numCorrect = 0;
  let corrections = {};
 
  //Check Answers
  for(id in userAnswers) {
    if (answerKey.get(id) == userAnswers[id]) {
      numCorrect++;
    } else if (answerKey.has(id)){
      corrections[id] = answerKey.get(id);
    }
  }

  // Return results as object
  return({
    correct: numCorrect,
    total: answerKey.size,
    corrections: corrections
  });
}