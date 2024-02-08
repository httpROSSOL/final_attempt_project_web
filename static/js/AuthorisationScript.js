function CheckFiedls() {
    if (document.getElementById("user_name").value == '') {
        alert("you have to input your nick")
        return false;

    }
    if (document.getElementById("user_email").value == '') {
        alert("you have to input your email")
        return false;
    }
    if (document.getElementById("user_password").value <= 5) {
        alert("Your password is toooooo short")
        return false;
    }
}

function onRegisterButtonClick() {
    const url = "http://localhost:8000/CreateUser";
    if (CheckFiedls()) {
        return;
    }

    fetch(url, {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
        },
        "body": JSON.stringify({
            "nick": document.getElementById("user_name").value,
            "email": document.getElementById("user_email").value,
            "password": document.getElementById("user_password").value
        }),
    })
        .then((response) => response.status)
        .then((status) => CheckUserExistence(status))
        .catch((error) => console.log(error));
}

function CheckUserExistence(status) {
    if (status == 200) {
        alert("Account was successfully created! Please log in.")
        window.location.replace("http://localhost:8000/");
    } else if (status == 403) {
        alert("User with this email already exists.");
    } else {
        alert("Unknown error.");
    }
}

function LoginClick() {
    const url = "http://localhost:8000/CheckUser";
    const user_email = document.getElementById("user_email").value;
    const user_password = document.getElementById("user_password").value;

    let status;

    fetch(url, {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
        },
        "body": JSON.stringify({
            "email": user_email,
            "password": user_password
        }),
    })
        .then((response) => {
            status = response.status;
            return response.text();
        })
        .then((text) => JSON.parse(text))
        .then((json) => CheckUser(json, status))
        .catch((error) => console.log(error));
}

function CheckUser(json, status) {
    console.log(typeof sessionStorage.getItem("id"));
    if (status == 200) {
        let verified = json.verified;
        if (verified) {
            alert("Welcome!");
            sessionStorage.setItem("id", json.id);
            sessionStorage.setItem("token", json.token);
            window.location.replace("http://localhost:8000/");
        } else {
            alert("Uncorrect password");
        }
    } else {
        alert("User was not found");
    }
}
