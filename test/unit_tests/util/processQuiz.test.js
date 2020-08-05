import {processQuiz} from '../../../src/util/quizUtils';

const generateMap = (answers) => {
  let answerKey = new Map();
  answers.forEach((answer, index) => {
    answerKey.set(index.toString(), answer);
  });
  return answerKey;
}

const generateUserAnswers = (answers) => {
  let userAnswers = {};
  answers.forEach((answer, index) => {
    userAnswers[index.toString()] = answer;
  });
  return userAnswers
}

const basicQuizAnswerKey = generateMap(
  ["A", "B", "C", "D", "A", "B", "C", "D", "A", "B"]
);

test('All correct answers', () => {
  const results = processQuiz(generateUserAnswers(
    ["A", "B", "C", "D", "A", "B", "C", "D", "A", "B"]),
    basicQuizAnswerKey);

  expect(results).toMatchObject({
    correct: 10,
    total: 10,
    corrections: {}
  })
});

test('One wrong', () => {
  const results = processQuiz(generateUserAnswers(
    ["A", "C", "C", "D", "A", "B", "C", "D", "A", "B"]),
    basicQuizAnswerKey);

  expect(results).toMatchObject({
    correct: 9,
    total: 10,
    corrections: {1: "B"}
  })
});

test('All wrong', () => {
  const results = processQuiz(generateUserAnswers(
    ["D", "C", "B", "A", "D", "C", "B", "A", "D", "C"]),
    basicQuizAnswerKey);

  expect(results).toMatchObject({
    correct: 0,
    total: 10,
    corrections: basicQuizAnswerKey
  })
});

test('Extra user responses', () => {
  const results = processQuiz(generateUserAnswers(
    ["A", "B", "C", "D", "A", "B", "C", "D", "A", "B", "C"]),
    basicQuizAnswerKey);

  expect(results).toMatchObject({
    correct: 10,
    total: 10,
    corrections: {}
  })
});

test('Missing user responses', () => {
  const results = processQuiz(generateUserAnswers(
    ["A", "B", "C", "D", "A", "B", "C", "D", "A"]),
    basicQuizAnswerKey);

  expect(results).toMatchObject({
    correct: 9,
    total: 10,
    corrections: {9: "B"}
  })
});

test('Non-existent Question key', ()=> {
  const results = processQuiz({9999: 'A', 1: 'B', 2: 'C'},
    new Map([['0', 'A'], ['1', 'B'], ['2', 'C']]))
    expect(results).toMatchObject({
      correct: 2,
      total: 3,
      corrections: {0: "A"}
    })
});