// DOM element declarations
let scores = document.querySelector("#scores");
let timer = document.querySelector("#timer");
let main = document.querySelector("#container");
let title = document.querySelector("#title");
let content = document.querySelector("#content");
let start = document.querySelector("#start");
let answer = document.querySelector("#answer");
class Question {
    constructor(question, options, answer) {
        this.question = question;
        this.options = options;
        this.answer = answer;
    }
}

let questionList = [];

// questions for the "questionList" array
const options1 = ["1. <js>", "2. <scripting>", "3. <script>", "4. <javascript>"];
const question1 = new Question("Inside which HTML element do we put the JavaScript?", options1, "3. <script>");
questionList.push(question1);

const options2 = ["1. String", "2. Boolean", "3. Null", "4. All of the Above"];
const question2 = new Question("Which is a JavaScript data type?", options2, "4. All of the Above");
questionList.push(question2);

const options3 = ["1. A Wrapper", "2. A String", "3. A Function", "4. A Const"];
const question3 = new Question("In JavaScript, _________ is an object of the target language data type that encloses an object of the source language.", options3, "1. A Wrapper");
questionList.push(question3);

// Variables for question loop functions
let optionList = [];
let currentQues = 0;
let score = 0;
let timeLeft = 61;
let isQuizOngoing = false;
let leaderboard = [];
let initials = "";
let isClearingAnswer = false;
let clearingAnswerCode = 0;
let isCorrect = false;

// makes start quiz function
function init() {
    start.addEventListener("click", questionLoop);
    scores.addEventListener("click", showScores);
}

// hides elements before quiz starts
function questionLoop () {
    runTimer();
    isQuizOngoing = true;
    start.setAttribute("style", "display: none");
    content.setAttribute("style", "display: none");
    let numOfOptions = questionList[0].options.length;
    for(let i = 0; i < numOfOptions; i++) {
        let option = document.createElement("button");
        container.appendChild(option);
        optionList.push(option);
        option.setAttribute("id", `button${i + 1}`);
    }
    nextQuestion();
}

// moves to end of quiz if timer hits 0, counts down from starting #
function runTimer () {
    let clock = setInterval(function() {
        timeLeft--;
        timer.textContent = `Time: ${timeLeft} seconds`;
        if(timeLeft === 0) {
            clearInterval(clock);
            if(title.textContent !== "All Done.") {
                endOfQuiz();
            }
        }
    }, 1000)
}


// moves to next question or end of questions
function nextQuestion(event) {
    writeAnswer(event);
    if(currentQues < questionList.length) {
        changeQuestion();
    } else {
        endOfQuiz();
    }
}

// if your answer is incorrect the time left is reduced by 10 until it goes to 0
function writeAnswer(event) {
    if(event !== undefined) {
        if(event.currentTarget.textContent === questionList[currentQues - 1].answer) {
            isCorrect = true;
            answer.textContent = "Correct";
            score += 10;
        } else {
            isCorrect = false;
            answer.textContent = "Incorrect";
            if(timeLeft > 10) {
                timeLeft -= 10;
            } else {
                timeLeft = 1;
            }
            setTimeout(function () {
                timer.setAttribute("style", "color: black");
            },1000);
        }
        clearAnswer();
    }
}

// "correct" or "incorrect" disappears after three seconds
function clearAnswer() {
    if(isClearingAnswer) {
        isClearingAnswer = false;
        clearTimeout(clearingAnswerCode);
        clearAnswer();
    } else {
        isClearingAnswer = true;
        clearingAnswerCode = setTimeout(function() {
            answer.textContent = "";
            isClearingAnswer = false;
        }, 3000);
    }
}

// changes the title to the next question
function changeQuestion() {
    title.textContent = questionList[currentQues].question;
    for(let i = 0; i < questionList[currentQues].options.length; i++) {
        optionList[i].textContent = questionList[currentQues].options[i];        
        optionList[i].addEventListener("click", nextQuestion);
    }
    currentQues++;
}

// changes title to "Finished"
function endOfQuiz() {
    title.textContent = "Finished";
    timeLeft = 1;
    clearOptions();
    clearAnswer();
    content.setAttribute("style", "display: visible");
    content.textContent = `Your final score is ${score}`;
    inputFields();
}

// deletes option buttons
function clearOptions() {
    for(let i = 0; i < optionList.length; i++) {
        optionList[i].remove();
    }
    optionList = [];
}

// Creates the form for entering initials
// Listens for click on submit 
function inputFields() {
    let initialsForm = document.createElement("form");
    container.appendChild(initialsForm);
    initialsForm.setAttribute("id", "form");
    let label = document.createElement("label");
    initialsForm.appendChild(label);
    label.textContent = "Enter initials: "
    let input = document.createElement("input")
    initialsForm.appendChild(input);
    input.setAttribute("id", "initials");
    let submit = document.createElement("button");
    initialsForm.appendChild(submit);
    submit.setAttribute("id", "submit");
    submit.textContent = "Submit";

    title.setAttribute("style", "align-self: start")
    content.setAttribute("style", "align-self: start; font-size: 150%");

    
    input.addEventListener("keydown", stopReload);
    submit.addEventListener("click", addScore);
    
}

function stopReload(event) {
    if(event.key === "Enter") {
        event.preventDefault();
    }
}

function addScore(event) {
    if(event !== undefined) {
        event.preventDefault();
    }
    let id = document.getElementById("initials");
    if(id.value.length > 3 || id.value.length === 0) {
        invalidInput();
        return;
    }
    isQuizOngoing = false;
    document.getElementById("form").remove();
    saveScore(id);
}

function createEndButtons() {
    if(!document.getElementById("restart")) {
        let restartVar = document.createElement("button");
        container.appendChild(restartVar);
        restartVar.textContent = "Go Back";
        restartVar.setAttribute("id", "restart");
        
        let clearScoresVar = document.createElement("button");
        container.appendChild(clearScoresVar);
        clearScoresVar.textContent = "Clear High Scores";
        clearScoresVar.setAttribute("id", "clearScores");
        
        restartVar.addEventListener("click", restart);
        clearScoresVar.addEventListener("click", clearScores)
    }
}

function restart() {
    title.setAttribute("style", "align-self: center");
    content.setAttribute("style", "align-self: center; font-size: 110%");
    document.getElementById("restart").remove();
    document.getElementById("clearScores").remove();
    title.textContent = "Coding Quiz Challenge";
    content.textContent = "Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your time by reducing it by ten seconds.";
    start.setAttribute("style", "display: visible");
    currentQues = 0;
    score = 0;
    timeLeft = 61;
    init();
}


init();