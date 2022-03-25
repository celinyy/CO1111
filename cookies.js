/*================================================================================================================================================================================
                                                                    Cookies functions
==================================================================================================================================================================*/

function setCookie(cookieName, cookieValue, expireDays) {//saves a cookie
    let date = new Date();
    date.setTime(date.getTime() + (expireDays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

function getCookie(cname) { //gets the saved cookie
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
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

/*===============================================================================================================================================================================
                                                                   Main game functions
================================================================================================================================================================================ */

function getChallenges () {//call  api list to get the treasuhunts available
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
    //searchers the url for the treasurehunt ID and saves it as a cookie
    let searchParams = new URLSearchParams(window.location.search);
    let treasureHuntID = searchParams.get("treasureHuntID");
    setCookie("treasureHuntID", treasureHuntID, 30);


    //gets the player name from the html element using its ID and saves it as a cookie
    const playerName = document.getElementById("playerName").value;
    setCookie("playerName", playerName, 30);


    if (document.getElementById("playerName").value.length === null) {
        console.log("empty");//checks if the field is empty
    } else {//if its !empty them console log the treasure hunt id and playername
        console.log("treasureHuntID: " + treasureHuntID);
        console.log("playerName:" + playerName);

    // call start API
        fetch("https://codecyprus.org/th/api/start?player=" + playerName + "&app=Team4-2022&treasure-hunt-id=" + treasureHuntID)
            .then(response => response.json()) //Parse JSON text to JavaScript object
            .then(jsonObject => {
                if (jsonObject.status === "OK") {//check if the status is ok
                    let sessionID = jsonObject.session;
                    console.log(sessionID);
                    setCookie("sessionID", sessionID, 30);//save session id as a cookie
                    window.location.href = "Questions.html";// if the status is ok take us to the questions.html page
                } else {
                    if (jsonObject.status === "ERROR") {//otherwise show the errors
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
//call questions API
function getQuestions() {
    fetch('https://codecyprus.org/th/api/question?session=' + sessionID)
        .then(response => response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK" && jsonObject.completed === false) {//if status is ok and its no completed

                let questionsElement = document.getElementById("question");//prinnting question
                questionsElement.innerText = jsonObject.questionText;

                if (jsonObject.questionType === "INTEGER"){//if questions integer create an input field for integer
                    document.getElementById("answers").innerHTML = "<input class=\"answer\" type=\"number\" id=\"integer-answer\" onsubmit=\"getAnswers(document.getElementById('integer-answer').value);\" required>\n";
                    document.getElementById('ingeger-form').style.visibility = "visible";//if question type integer maske the form visible
                    score();

                }
                if (jsonObject.questionType === "BOOLEAN"){//if boolean make a true and false button
                    document.getElementById("answers").innerHTML = "<input class=\"answer\" onclick=\"getAnswers(true);\" type=\"submit\" value=\"true\" id=\"true-answer\">\n" +
                        "                                <input class=\"answer\" onclick=\"getAnswers(false);\" type=\"submit\" value=\"false\" id=\"false-answer\">";
                    score();

                }
                if (jsonObject.questionType === "MCQ"){//if mcq make ABCD buttons
                    document.getElementById("answers").innerHTML = "<input style=\"width: 10%\" class=\"answer\" onclick=\"getAnswers('A');\" value=\"A\" type=\"submit\" id=\"answer-a\">\n" +
                        "                                <input style=\"width: 10%\" class=\"answer\" onclick=\"getAnswers('B');\" value=\"B\" type=\"submit\" id=\"answer-b\">\n" +
                        "                                <input style=\"width: 10%\" class=\"answer\" onclick=\"getAnswers('C');\" value=\"C\" type=\"submit\" id=\"answer-c\">\n" +
                        "                                <input style=\"width: 10%\" class=\"answer\" onclick=\"getAnswers('D');\" value=\"D\" type=\"submit\" id=\"answer-d\">";
                    score();//call score function
                }
                if (jsonObject.questionType === "TEXT"){//make the form visible
                    document.getElementById('text-form').style.visibility = "visible";
                    score();
                }
                if (jsonObject.questionType === "NUMERIC"){//if numeric create a fload only form
                    document.getElementById("answers").innerHTML = "<input class=\"answer\" type=\"number\" step=\"0.000001\" id=\"numeric-answer\" required>";
                    document.getElementById('numeric-form').style.visibility = "visible";//make form visible
                    score();//call score function
                }

                if (jsonObject.requires-location === true){//if it requires location call getlocation function
                    getLocation();
                }

                if (jsonObject.canBeSkipped === true) { //showing the skip button
                    document.getElementById("skip-form").innerHTML = "<input style=\"visibility: visible\" type=\"submit\" id=\"skipBtn\" value=\"Skip Question\">";
                    Skip();
                }

                } else {
                    let errorMessages = jsonObject.errorMessages;
                    let str = "";
                    for (let error in errorMessages) {
                    str += error;
                    }
                console.log(str);
                }

            if (jsonObject.completed === true){
                window.location.href="Leaderboard.html";
            }
        })
            .catch(error => {
                console.log(error);
            });

}
//function for the leaderboard score and player name
function leaderboardJS (){
    //display the score
    let scoreElement = document.getElementById("score-leaderboard");
    scoreElement.innerText = getCookie('ScoreValue');
    //display the playername
    let playernameElement = document.getElementById('player-name-leaderboard');
    playernameElement.innerText = getCookie('playerName');
}
//answer Api function
function getAnswers(answer) {
    fetch('https://codecyprus.org/th/api/answer?session=' + sessionID + '&answer=' + answer)//call api
        .then(response => response.json())
        .then(jsonObject => {

            if (jsonObject.status === "OK" && jsonObject.completed === false && jsonObject.correct === true) {
                score();
                console.log("correct");//if the asnwers are correct print correct
            }

                if (jsonObject.status === "OK" && jsonObject.completed === false && jsonObject.correct === true)
                {
                    score();
                    console.log("wrong");//if answer wrong print wrong
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



function Skip(){//call skin API
    fetch('https://codecyprus.org/th/api/skip?session=' + sessionID)
        .then(response => response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK" && jsonObject.completed === false){
                document.getElementById("playerName").innerText = playerName;
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
            if (jsonObject.status === "OK" && jsonObject.completed === false && jsonObject.finished === false){
                var score = jsonObject.score;
                setCookie('ScoreValue',score,365);//save score as a cookie
                let scoreElement = document.getElementById("score");//print it in the corresponding place
                scoreElement.innerText = score;
            }
            else if (jsonObject.status === "ERROR") {
                let errorMessages = jsonObject.errorMessages;
                let str = "";
                for (let error in errorMessages) {
                    str += error;
                }
                console.log(str);
            }
        })

}
function leaderboard(){
    let searchParams = new URLSearchParams(window.location.search);//find treasure hunt id
    let treasureHuntID = searchParams.get("treasureHuntID");
//call leaderboard API
    fetch('https://codecyprus.org/th/api/leaderboard?session=' + sessionID + '&treasure-hunt-id=' + treasureHuntID)
        .then(response => response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK"){

            }
        })
}
function getLocation() {

    var latitude = showPosition(position.coords.latitude);//find latiture
    var longitude = showPosition(position.coords.longitude);//find longtitude
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
