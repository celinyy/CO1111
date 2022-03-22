function setCookie(cookieName, cookieValue, expireDays) {
    let date = new Date();
    date.setTime(date.getTime() + (expireDays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    let username = getCookie("username");
    if (username != "") {
        alert("Welcome again " + username);
    } else {
        username = prompt("Please enter your name:", "");
        if (username != "" && username != null) {
            setCookie("username", username, 365);
        }
    }
}

function getChallenges () {
    let challengesList = document.getElementById("challenges");
    fetch("https://codecyprus.org/th/api/list?")
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            let treasureHunts = jsonObject.treasureHunts;
            for (let i = 0; i < treasureHunts.length; i++) {
                //get name of the treasure hunt...
                let name = treasureHunts[i].name;
                console.log(name);
                let listItem = document.createElement("li"); //Create a list item
                listItem.innerHTML = "<a href= 'login.html?treasureHuntID=" + treasureHunts[i].uuid + "' >" + treasureHunts[i].name + "</a>";
                challengesList.appendChild(listItem); //Append item to list
            }
            console.log(treasureHunts); //TODO - Success, do something with the data.+ treasureHunts[i].uuid
        });
}

function start() {
    let searchParams = new URLSearchParams(window.location.search);
    let treasureHuntID = searchParams.get("treasureHuntID");
    setCookie("treasureHuntID", treasureHuntID, 30);

    const playerName = document.getElementById("playerName").value;
    setCookie("playerName", playerName, 30);

    //TODO - Check if the value is blank.....
    if (document.getElementById("playerName").value.length === null) {
        alert("empty");
    } else {
        console.log("treasureHuntID: " + treasureHuntID);
        console.log("playerName:" + playerName);


        fetch("https://codecyprus.org/th/api/start?player=" + playerName + "&app=Team4-2022&treasure-hunt-id=" + treasureHuntID)
            .then(response => response.json()) //Parse JSON text to JavaScript object
            .then(jsonObject => {
                if (jsonObject.status === "OK") {
                    let sessionID = jsonObject.session;
                    console.log(sessionID);
                    setCookie("sessionID", sessionID, 30);
                    window.location.href = "Questions.html";
                } else {
                    let errorMessages = jsonObject.errorMessages;
                    let str = "";
                    for (let error in errorMessages) {
                        str += error;
                    }
                    alert(str);
                }
            })
            .catch(error => {
                alert(error);
            });

    }
}

function getQuestions() {
    fetch('https://codecyprus.org/th/api/question?session=' + sessionID)
        .then(response => response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK") {

                if (jsonObject.completed === false) {

                    let questionsElement = document.getElementById("question");//prinnting question
                    questionsElement.innerText = jsonObject.questionText;

                    if (jsonObject.questionType === "INTEGER") {
                        document.getElementById("option-integer").style.visibility = "visible";

                    } else {
                        document.getElementById("option-integer").style.visibility = "hidden";
                    }
                    /*================================================================================*/
                        if (jsonObject.questionType === "BOOLEAN") {
                        document.getElementById("option-boolean").style.visibility = "visible";
                    } else {
                        document.getElementById("option-boolean").style.visibility = "hidden";
                    }
                        /*================================================================================*/
                            if (jsonObject.questionType === "MCQ") {
                        document.getElementById("option-mcq").style.visibility = "visible";

                    } else {
                        document.getElementById("option-mcq").style.visibility = "hidden";
                    }
                            /*================================================================================*/
                                if (jsonObject.questionType === "TEXT") {
                        document.getElementById("text-option").style.visibility = "visible";
                    } else {
                        document.getElementById("text-option").style.visibility = "hidden";
                    }
                                /*================================================================================*/
                    if (jsonObject.questionType === "NUMERIC"){
                        document.getElementById("numeric-option").style.visibility = "visible";
                    }
                    else {
                        document.getElementById("numeric-option").style.visibility = "hidden";
                    }
                }

                if (jsonObject.canBeSkipped === true) { //showing the skip button
                    document.getElementById("skip-form").style.visibility = "visible";
                    Skip();
                }

                //let numOfQ = jsonObject.numOfQuestions;
                //let currentQ = jsonObject.currentQuestionIndex;
                //for (currentQ = 0; currentQ <= numOfQ.length;currentQ++){}
                score();
                } else {
                    let errorMessages = jsonObject.errorMessages;
                    let str = "";
                    for (let error in errorMessages) {
                    str += error;
                    }
                    alert(str);
                }
        })
            .catch(error => {
                alert(error);
            });
}

function answerParameter(){
    fetch('https://codecyprus.org/th/api/question?session=' + sessionID)
        .then(response => response.json())
        .then(jsonObject => {

            let answerParam = "";
            switch (answerParam) {
                case 0: {
                    if (jsonObject.questionType === "INTEGER") {
                        let integerAnswer = document.getElementById("integer-answer");
                        answerParam = integerAnswer;
                    }
                }
                    break;
                case 1: {
                    if (jsonObject.questionType === "BOOLEAN") {
                        let trueAnswer = document.getElementById("true-answer");
                        let falseAnswer = document.getElementById("false-answer");
                        answerParam = trueAnswer, falseAnswer;
                    }
                }
                    break;
                case 2: {
                    if (jsonObject.questionType === "TEXT") {
                        let textAnswer = document.getElementById("text-answer");
                        answerParam = textAnswer;
                    }
                }
                    break;
                case 3: {
                    if (jsonObject.questionType === "NUMERIC") {
                        let numericAnswer = document.getElementById("numeric-answer");
                        answerParam = numericAnswer;
                    }
                }
                    break;
                case 4: {
                    if (jsonObject.questionType === "MCQ") {
                        let optionA = document.getElementById("answer-a");
                        let optionB = document.getElementById("answer-b");
                        let optionC = document.getElementById("answer-c");
                        let optionD = document.getElementById("answer-d");
                        answerParam = optionA,optionB,optionC,optionD;
                    }
                }
            }
        })
}

function getAnswers() {




    fetch('https://codecyprus.org/th/api/answer?session=' + sessionID + '&answer=' + answerParameter())
        .then(response => response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK"){
                if (jsonObject.completed === false) {
                    if (jsonObject.correct === true) {
                        document.getElementById("correct-answer-msg").style.visibility = "visible";
                        score();
                    }
                }
                else {
                    if (jsonObject.completed === false) {
                         if (jsonObject.correct === true) {
                            document.getElementById("wrong-answer-msg").style.visibility = "visible";
                            score();
                        }
                    }
                }
            }
            else {
                if(jsonObject.status === "ERROR") {
                    let errorMessages = jsonObject.errorMessages;
                    let str = "";
                    for (let error in errorMessages) {
                        str += error;
                    }
                    alert(str);
                }
            }
        })
}

function Skip(){
    fetch('https://codecyprus.org/th/api/skip?session=' + sessionID)
        .then(response => response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK"){
                if (jsonObject.completed === false){
                    document.getElementById("skip-msg").style.visibility = "visible";
                    score();
                }
            }
            else {
                if (jsonObject.status === "ERROR"){
                    let errorMessages = jsonObject.errorMessages;
                    let str = "";
                    for (let error in errorMessages) {
                        str += error;
                    }
                    alert(str);
                }
            }
        })
        .catch(error => {
            alert(error);
        });
}
function score(){
    fetch("https://codecyprus.org/th/api/score?session" + sessionID)
        .then(response => response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK"){
                if (jsonObject.completed === false){
                    if (jsonObject.finished === false){
                        var score = jsonObject.score;
                        let scoreElement = document.getElementById("score");
                        scoreElement.innerHTML = score;
                    }
                }

            }
        })

}
score();
function leaderboard(){
    let searchParams = new URLSearchParams(window.location.search);
    let treasureHuntID = searchParams.get("treasureHuntID");

    fetch('https://codecyprus.org/th/api/leaderboard?session=' + sessionID + '&treasure-hunt-id=' + treasureHuntID)
        .then(response => response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK"){

            }
        })
}