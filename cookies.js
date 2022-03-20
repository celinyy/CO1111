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

    const playerName = document.getElementById("playerName").value;

    //TODO - Check if the value is blank.....
    if (document.getElementById("playerName").value.length === 0) {
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
                console.log("OKY");
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