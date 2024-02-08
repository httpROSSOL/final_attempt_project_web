import uvicorn
from fastapi import Request
from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from DatabaseFunc import CreateUser, GetUserByEmail, UserRecordById, UserExists, UpdateScoreById, DeleteToken, \
    GetUserById, GetSomeBestUsers

app = FastAPI()

app.mount("/static", StaticFiles(directory="static", html=True), name="static")


@app.get("/authorisation/")
async def Authorisation():
    return FileResponse(r"static/html/Authorisation.html")


@app.get("/")
async def Root():
    return FileResponse("static/html/Root.html")


@app.get("/test/")
async def Test():
    return FileResponse("static/html/Test.html")


@app.get("/signup/")
async def Registration():
    return FileResponse("static/html/Registration.html")


@app.get("/statistics/")
async def Registration():
    return FileResponse("static/html/LeaderBoard.html")


@app.get("/login/")
async def Login():
    return FileResponse("static/html/Login.html")


@app.post("/logout/")
async def logout(request: Request):
    json = await request.json()

    DeleteToken(json["token"])


@app.post("/CreateUser")
async def CreateNewUser(requset: Request):
    json = await requset.json()
    if UserExists(json["email"]):
        return JSONResponse(content={}, status_code=403)

    CreateUser(json["nick"], json["email"], json["password"])

    return JSONResponse(content={}, status_code=200)


@app.post("/GetBestScore")
async def sent_questions(request: Request):
    json = await request.json()

    return JSONResponse(content={"score": UserRecordById(_id=int(json["id"])).score})


@app.post("/CheckUser")
async def CheckUser(requset: Request):
    json = await requset.json()

    if UserExists(json["email"]) is None:
        return JSONResponse(content={}, status_code=404)

    user = GetUserByEmail(email=json["email"])
    response_json = {"id": int(user.id),
                     "verified": user.password.password == json["password"]}

    return JSONResponse(content=response_json, status_code=200)


@app.post("/update/score")
async def update_score(request: Request):
    json = await request.json()
    UserId = json["id"]
    UserScore = json["score"]

    UpdateScoreById(UserId, UserScore)


@app.get("/score")
async def score():
    return FileResponse("static/html/ScorePage.html")


@app.post("/CheckToken")
async def score(request: Request):
    json = await request.json()

    token = json["token"]
    UserId = json["id"]

    User = GetUserById(UserId)

    if User.token == None or User.token.token != token:
        return JSONResponse(content={"response": False}, status_code=200)

    return JSONResponse(content={"response": True}, status_code=200)


@app.get("/GetUsers")
async def GetUsers():
    Users = GetSomeBestUsers(6)

    return JSONResponse(content={"content": [{"nick": User.nick, "score": User.score.score} for User in Users]})


if __name__ == '__main__':
    uvicorn.run('main:app', port=8000, reload=True)
