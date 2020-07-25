/**
 * Quiz Schema Definition.
 *
 * Defines the database schema for the quiz collection.
 *
 * @module  quizModel
 * @file    This file defines the quiz schema.
 * @author  syoung908
 * @since   1.0.0
 */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const quizSchema =  new Schema ({
  name: {type: String, default: ''},
  difficulty: {type: String, default: 'Easy', enum: ['Easy', 'Medium', 'Hard']},
  length: {type: Number, default: 0},
  tags: [String],
});

const quiz = mongoose.model('quiz', quizSchema);

module.exports = quiz;