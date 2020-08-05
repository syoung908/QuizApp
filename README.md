# QuizMe! WebApp


App is live on AWS at this [link](http://quizme-env-1.eba-tsxzwqun.us-west-1.elasticbeanstalk.com).

## Overview

In this repository is the code for a full-stack web implementation of the [Udemy coding challenge](https://github.com/udemy/coding-challenge).  

Users can select a quiz from the homepage, take the quiz, and view their score. As per the specifications, quizzes consist of one or more multiple choice questions.

### Search for Quizzes 
Users can search for a quiz they want to take based on key terms (such as a tag or a name).

![Search](https://media.giphy.com/media/PnJUrw87FQoxxxzguC/giphy.gif)

Users can filter by difficulty as well.

![Filter](https://media.giphy.com/media/TjS86cHWMGYSAcJDJZ/giphy.gif)

### Take Quizzes
Once a user selects a quiz they can take the quiz with a UI that allows the user to view their current progress using a progress bar and navigate questions either by selecting forward or back, or by selecting a question in the navigation pane.

![Quiz Page](https://media.giphy.com/media/LOKEVqhn9WZpak4MlU/giphy.gif)

### View Results
Once the user completes the quiz, they can submit the quiz to the server to be graded. The results will be displayed top the user after a successful request.

![Results](https://media.giphy.com/media/efUdkE1JJwl3XGKL85/giphy.gif)

## Built With

 - **Front End:** [React](https://reactjs.org/), [Material-UI](https://material-ui.com/)
 - **State Management:** [MobX](https://mobx.js.org/) 
 - **Server:** [Node.js](https://nodejs.org/en/), [Express](https://expressjs.com/)
 - **Database**: [mongoDB](https://www.mongodb.com/)
 - **Testing**: [Jest](https://jestjs.io/)

## Design and Architecture Choices

### Infinite Scrolling for the Quiz Table
The homepage primarily features a table of quizzes that are displayed from the server. By default, the homepage requests all quizzes. However these requests are for quizzes in batches of 15. Data is sent to the client on an as-requested basis so that it scales as the number of quizzes grows. 

The table automatically fetches more quizzes (if there are any) when the user reaches the end of the list of results (infinite scrolling). This reduces the overall amount of data sent to an average user, but the trade-off of this design is that there is an increase in the  number of HTTP requests sent to the server.

### State Management with MobX
In both the homepage and quiz page, multiple components utilize the same state variables. For example on the quiz page, selecting an answer highlights the answer on the quiz card, changes the text color on the navigation panel, and fills the progress bar. 

The use of a state management tool like MobX allows for the state to be centralized and provide an interface to any components that use or change that state. I found using MobX much simpler than passing state and functions around as props. Additionally I found MobX was much easier to use than Redux.

However, with React now supporting hooks one could argue that,  for an application of this size, the use of a state management framework adds unnecessary complexity. However I found MobX quite easy to use.

### MongoDB
I selected MongoDB as my database for two reasons. 

The first is familiarity as my previous web applications have all used MongoDB as their database. 

The second is the flexibility of a NoSQL database like MongoDB. With various types of questions and quizzes and the possibility of extending the functionality beyond just multiple choice questions, the use of MongoDB would allow me to make changes to the model in a more flexible manner since I would not have to reformat my entire database every time I wanted to make a change. Additionally, since the user (or even the administrator) is not writing to/modifying the database regularly, the benefits of an SQL system with ACID transactions are reduced.

## Testing

Some unit tests and integration tests were written using the testing framework [Jest](https://jestjs.io/). These tests can be located in the test directory.  

Unfortunately, my testing suite is somewhat limited. Being somewhat new to web development, I used this project as an opportunity to learn Jest.

 With the knowledge I have now and more time, I would have liked to have added more extensive tests (specifically React-MobX tests). Additionally, if I could start over I would definitely have used a more Test Driven Development approach.

However, the tests I did implement are detailed below.

### Unit Tests for Utility Functions
```
npm run-script test-util
```

With the only server-side processing being grading user's responses to a quiz. These tests simply test the processQuiz function which performs this function.

### MobX Unit Tests
```
npm run-script test-stores
```
These tests check the various utility functions and variables associated with the two MobX stores. These test that the basic state control functions work as well as sending requests and processing responses from the server. For these tests, the fetch function is mocked.

### Integration Tests for the Server API
```
npm run-script test-api
```
These tests perform a number of various requests to the server to test the API functionality. The server API  allows the user to query quizzes, load quiz questions, and submit quizzes to be graded.

### Integration Tests with MobX and React
```
npm run-script test-util
```
These tests mount components from that utilize the MobX stores and then verify that actions and information displayed on these components result in the proper state changes.

 - Currently only difficulty filter component

## If I Had More Time
1. More Unit and Integration Tests (mentioned above).
2. Display which questions the user got right and wrong and any corrections to be made. (The backend already supports this).
3. Frontend and Backend support for storing user scores, calculating a user's rank based on how their score compares to other users/previous attempts.
4. More real quizzes - Only 2 real quizzes are in the database, the rest are randomly generated quiz-stubs used for testing the inifinite scrolling, querying, and filtering.
5. 
## Deployment

Requires Node.js and npm to be installed on the system.
Install the dependencies with:
```
npm install
```
Afterwards the application can be run with:
```
node app.js
```
or
```
npm start
```
## Authors

* **Sean Young** - syoung908

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


