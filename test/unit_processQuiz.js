var processQuiz = require('../src/util/quizUtils').processQuiz;
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var generateMap = (answers) => {
  answerKey = new Map();
  answers.forEach((answer, index) => {
    answerKey.set(index.toString(), answer);
  });
  return answerKey;
}

var generateUserAnswers = (answers) => {
  userAnswers = {};
  answers.forEach((answer, index) => {
    userAnswers[index.toString()] = answer;
  });
  return userAnswers
}

var basicQuizAnswerKey = generateMap(
  ["A", "B", "C", "D", "A", "B", "C", "D", "A", "B"]
);

function runTest(testDescription, userInput, answerKey, expectedCorrect, 
  expectedTotal, expectedCorrections) {

  let results;
  it(testDescription, () => {
    expect(() => {
      results = processQuiz(userInput, answerKey);
    }).to.not.throw();

    should.exist(results);
    results.should.be.an('object');
    results.should.have.property('correct', expectedCorrect);
    results.should.have.property('total', expectedTotal);
    results.should.have.property('corrections').that.is.an('object');
    if (expectedCorrect == expectedTotal) {
      Object.keys(results.corrections).should.be.empty;
    } else if(expectedTotal == userInput.size){
      Object.keys(results.corrections)
        .should.be.lengthOf(expectedTotal - expectedCorrect);

      for([id, answer] of Object.entries(expectedCorrections)) {
        results.corrections.should.have.key(id);
        results.corrections.get(id).should.be(answer);
      }
    }
  });
}


// Test Cases
describe("[Unit] Process Quiz", () => {
  runTest('All correct answers', 
  generateUserAnswers(["A", "B", "C", "D", "A", "B", "C", "D", "A", "B"]),
    basicQuizAnswerKey, 
    10, 
    10,
    new Map()
  );

  runTest('One wrong', 
    generateUserAnswers(["A", "C", "C", "D", "A", "B", "C", "D", "A", "B"]), 
    basicQuizAnswerKey, 
    9, 
    10, 
    new Map([['2', 'B']])
  );

  runTest('All wrong', 
    generateUserAnswers(["D", "C", "B", "A", "D", "C", "B", "A", "D", "C"]), 
    basicQuizAnswerKey, 
    0, 
    10, 
    basicQuizAnswerKey
  );

  runTest('Extra user responses',
    generateUserAnswers(["A", "B", "C", "D", "A", "B", "C", "D", "A", "B", "C"]),
    basicQuizAnswerKey, 
    10, 
    10,
    new Map()
  );

  runTest('Missing user responses',
    generateUserAnswers(["A", "B", "C", "D", "A", "B", "C", "D", "A"]),
    basicQuizAnswerKey, 
    9, 
    10,
    new Map()
  );
});