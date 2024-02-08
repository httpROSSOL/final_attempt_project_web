if (!CheckUserToken()) {
    window.location.replace("http://localhost:8000/authorisation/");
} else {
    GetBestScore();
}


function CheckUserToken() {
    if (sessionStorage.getItem("id") == null || sessionStorage.getItem("token") == null) {
        return false;
    }

    fetch("http://localhost:8000/CheckToken", {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
        },
        "body": JSON.stringify({
            "id": parseInt(sessionStorage.getItem("id")),
            "token": sessionStorage.getItem("token")
        }),
    })
        .then((response) => response.text())
        .then((text) => JSON.parse(text))
        .then((json) => json.response)
        .then((IsAccepted) => {
            if (!IsAccepted) {
                return false;
            }
        })
        .catch((error) => console.log(error));
    return true;
}

function GetBestScore() {
    fetch("http://localhost:8000/GetBestScore", {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
        },
        "body": JSON.stringify({
            "id": parseInt(sessionStorage.getItem("id")),
        }),
    })
        .then((response) => response.text())
        .then((text) => JSON.parse(text))
        .then((json) => json.score)
        .then((BestScore) => {
            document.getElementById("BestScore").innerHTML += BestScore;
        })
        .catch((error) => console.log(error));
}

function start_quiz() {
    window.location.replace("http://localhost:8000/test")
}

function logout() {
    fetch("http://localhost:8000/logout", {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
        },
        "body": JSON.stringify({
            "token": sessionStorage.getItem("token"),
        }),
    });

    sessionStorage.removeItem("id");
    sessionStorage.removeItem("token");

    window.location.replace("http://localhost:8000/authorisation/");
}


function GetStatistics() {
    window.location.replace("http://localhost:8000/statistics");
}