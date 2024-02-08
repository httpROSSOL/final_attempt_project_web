if (!CheckUserToken()) {
    window.location.replace("http://localhost:8000/authorisation/");
}

let UserAnswers = [];
const CorrectAnswers = ['строки', '92', 'умения', '100', '150', '#000000', '#000000', '4', '+7 985 174 7904']


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


function SubmitAnswers() {
    SaveUserAnswers();
    CheckAnswers();
    UpdateBestScoreOnServer();
    window.location.replace("http://localhost:8000/score/")
}

function SaveUserAnswers() {
    let questions = document.getElementsByClassName("question");

    for (let i = 0; i < questions.length; i++) {
        let input_fields = questions[i].getElementsByTagName("input");

        let flag_answer_added = false;
        for (let index_input = 0; index_input < input_fields.length; index_input++) {
            const input_field = input_fields[index_input];
            if (input_field.type == "radio") {
                if (input_field.checked) {
                    flag_answer_added = true;
                    UserAnswers.push(input_field.value);
                    break;
                }
            } else {
                flag_answer_added = true;
                UserAnswers.push(input_field.value);
            }
        }
        if (!flag_answer_added) {
            UserAnswers.push("");
        }
        console.log(UserAnswers);
    }
}

function CheckAnswers() {
    let score = 0;
    for (let index = 0; index < UserAnswers.length; index++) {
        const CorrectAnswer = CorrectAnswers[index];
        const UserAnswer = UserAnswers[index];

        if (CorrectAnswer == UserAnswer) {
            score++;
        }
    }
    sessionStorage.setItem("score", score);
    console.log(sessionStorage.getItem("score"))
}

function UpdateBestScoreOnServer() {
    fetch("http://localhost:8000/update/score", {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
        },
        "body": JSON.stringify({
            "id": parseInt(sessionStorage.getItem("id")),
            "score": parseInt(sessionStorage.getItem("score"))
        }),
    })
        .catch((error) => console.log(error));
}
