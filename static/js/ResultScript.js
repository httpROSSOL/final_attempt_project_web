if (!CheckUserToken()) {
    window.location.replace("http://localhost:8000/authorisation/");
} else {
    ShowResult();
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

function ShowResult() {
    let score = sessionStorage.getItem("score");

    let score_field = document.getElementById("ScoreField");
    score_field.innerHTML = "Your Score: " + score;

    console.log(score_field);
}
// pleeeeseeee commit
