/**
 * Question Schema Definition.
 *
 * Defines the database schema for the question collection.
 *
 * @module  questionModel
 * @file    This file defines the question schema.
 * @author  syoung908
 * @since   1.0.0
 */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const questionSchema = new Schema({
  question: { type: String, default: '' },
  answers: Schema.Types.Mixed,
  correct: { type: String },
  type: {
    type: String, 
    default: 'Select Single',
    enum: ['Select Single', 'True/False', 'Select Multiple']
  },
  media: {
    type: String,
    default: 'None',
    enum: ['Code', 'Image', 'None']
  },
  _quizID: Schema.Types.ObjectId,
});

const question = mongoose.model('question', questionSchema);

module.exports = question;