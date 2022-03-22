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
/*========================================================================*/
const sessionID = getCookie("sessionID");
const treasureHutID = getCookie("treasureHuntID");
const playerName = getCookie("playerName");
/*========================================================================*/

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
        console.log("empty");
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
                    if (jsonObject.status === "ERROR") {
                        let errorMessages = jsonObject.errorMessages;
                        let str = "";
                        for (let error in errorMessages) {
                            str += error;
                        }
                        console.log(str);
                    }
                }
            })
            .catch(error => {
                console.log(error);
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


                }
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


                if (jsonObject.canBeSkipped === true) { //showing the skip button
                    document.getElementById("skip-form").style.display= "inline";
                    Skip();
                }

                score();
                } else {
                    let errorMessages = jsonObject.errorMessages;
                    let str = "";
                    for (let error in errorMessages) {
                    str += error;
                    }
                console.log(str);
                }
        })
            .catch(error => {
                console.log(error);
            });
}

var inputs = document.getElementsByClassName('asnwer');

function getAnswers() {
    fetch('https://codecyprus.org/th/api/answer?session=' + sessionID + '&answer=' + inputs)
        .then(response => response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK"){
                if (jsonObject.completed === false && jsonObject.correct === true) {
                        //document.getElementById("correct-answer-msg").style.visibility = "visible";
                        getQuestions();

                }
                else {
                    if (jsonObject.completed === false && jsonObject.correct === true) {

                            //document.getElementById("wrong-answer-msg").style.visibility = "visible";
                            getQuestions();
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
                    console.log(str);
                }
            }
        })
}



function Skip(){
    fetch('https://codecyprus.org/th/api/skip?session=' + sessionID)
        .then(response => response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK"){
                score();
                if (jsonObject.completed === false){
                    //document.getElementById("skip-msg").style.visibility = "visible";

                }
            }
            else {
                if (jsonObject.status === "ERROR"){
                    let errorMessages = jsonObject.errorMessages;
                    let str = "";
                    for (let error in errorMessages) {
                        str += error;
                    }
                    console.log(str);
                }
            }
        })
        .catch(error => {
            console.log(error);
        });
}
function score(){
    fetch("https://codecyprus.org/th/api/score?session=" + sessionID)
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
function getLocation() {

    var latitude = showPosition(position.coords.latitude);
    var longitude = showPosition(position.coords.longitude);
    fetch('https://codecyprus.org/th/api/location?session=' + sessionID  +  '&latitude=' + latitude +  '&longitude='+ longitude)
        .then(response = response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK"){
                alert("Added location" + "(" + longitude + latitude + ")")
            }
        })
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        console.log("Geolocation is not supported by your browser.");
    }
}
function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude + ", Longitude: " +
        position.coords.longitude);
}
getLocation();