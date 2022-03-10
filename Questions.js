const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [
    {
        question: "whats the assignment?",
        choice1: "cartoon",
        choice2: "treasure hunt",
        choice3: "monkey",
        choice4: "banana",
        answer: 2
    },
    {

        question: "whats the year?",
        choice1: "1090",
        choice2: "1998",
        choice3: "2010",
        choice4: "2022",
        answer: 4
    },
    {
        question: "whens the deadline?",
        choice1: "march,2023",
        choice2: "april, 2022",
        choice3: "jan, 2020",
        choice4: "march, 2022",
        answer: 4
    }
];

//constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

//esx function
startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    console.log(availableQuestions);
    getNewQuestion();
}
getNewQuestion = () => {

    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        //END PAGE
        return window.location.assign("Leaderboard.html")
        z }

    questionCounter++;//increment the question the moment the game starts for a new question.
    const questionIndex =  Math.floor(Math.random() * availableQuestions.length) //make it an integer
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach( choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex,1);

    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;

        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        getNewQuestion();
    });
});

startGame();