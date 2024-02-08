LoadUsers();

function LoadUsers() {
    fetch("http://localhost:8000/GetUsers", {
        "method": "GET",
        "headers": {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.text())
        .then((text) => JSON.parse(text))
        .then((json) => json.content)
        .then((First6Users) => ShowOnPage6BestUsers(First6Users))
        .catch((error) => console.log(error));
}

function ShowOnPage6BestUsers(Users) {
    for (let index_user = 0; index_user < Users.length; index_user++) {
        const User = Users[index_user];

        const table = document.getElementsByTagName("table")[0];
        const tr = document.createElement("tr");

        const td_nick = document.createElement("td");
        td_nick.innerHTML = User.nick;

        const td_score = document.createElement("td");
        td_score.innerHTML = User.score;

        tr.appendChild(td_nick);
        tr.appendChild(td_score);

        table.appendChild(tr);
    }
}