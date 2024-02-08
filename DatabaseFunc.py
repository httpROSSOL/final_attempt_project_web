from sqlalchemy.orm import Session
from sqlalchemy import select
from Database import engine, User, Password, Score, Token
from typing import Optional

session = Session(engine)


def ClearDataBase():
    users = session.query(User).all()
    list_id = [user.id for user in users]

    for user_id in list_id:
        DeleteUserById(user_id)


def UserExists(email: str):
    return (GetUserByEmail(email=email) != None)


def GetUserIdByEmail(email: str):
    if not UserExists(email):
        return -1

    return session.scalar(select(User).where(User.email == email)).id


def GetUserById(_id: int) -> Optional[User]:
    return session.scalar(select(User).where(User.id == _id))


def GetUserByEmail(email: str) -> Optional[User]:
    return session.scalar(select(User).where(User.email == email))


def CreateUser(nick: str, email: str, password: str, score: int = 0) -> bool:
    if UserExists(email=email):
        return False

    session.add(User(nick=nick, email=email,
                     password=Password(password=password),
                     score=Score(score=score)))
    session.commit()

    return True


def UserRecordById(_id: int):
    user = GetUserById(_id)
    return user.score


def SetScoreById(id: int, new_score: int):
    session.query(Score).filter_by(id=id).update(
        values={"score": new_score})

    session.commit()


def UpdateScoreById(_id: int, new_score: int):
    session.query(Score).filter_by(user_id=_id).update(
        values={"score": new_score})

    session.commit()


def DeleteUserById(id: int) -> None:
    session.query(User).filter_by(id=id).delete()
    session.query(Password).filter_by(user_id=id).delete()
    session.query(Score).filter_by(user_id=id).delete()
    session.query(Token).filter_by(user_id=id).delete()
    session.commit()


def GetSomeBestUsers(AmountUsers: int):
    SortedUsers = sorted(session.query(User).all(), key=lambda x: x.score.score)
    SortedUsers.reverse()

    return SortedUsers[:AmountUsers]


def ShowDataBase(db_name) -> None:
    print(*session.query(db_name).all(), sep='\n')


def DeleteToken(token: str):
    session.query(Token).filter_by(token=token).delete()


if __name__ == "__main__":
    # CreateUser(nick='nick', email='email', password='password')
    print(UserRecordById(6).score)
    # ShowDataBase(User)
