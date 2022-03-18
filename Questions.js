const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];


fetch("https://codecyprus.org/th/api/question?session=ag9nfmNvZGVjeXBydXNvcmdyGQsSDFRyZWFzdXJlSHVudBiAgICAvKGCCgw")
    .then(response => {
        return res.json();
    })
    .then(loadedQuestions => {
        console.log(loadedQuestions.results);
        loadedQuestions.results.map( loadedQuestions => {
            const formattedQuestion = {
                question: loadedQuestion.questions
            };
            const answerChoices = [...loadedQuestions.incorrect_answers];
        })

    })
    .catch(err => {
        console.error(err);
    })

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

    //if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        //END PAGE
        //return window.location.assign("Leaderboard.html")
        //}

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