from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext

from app.database import db
from app.models.user import User

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ----------------------------------------
# Signup
# ----------------------------------------

@router.post("/signup")
async def signup(user: User):

    existing = await db.users.find_one(
        {"email": user.email.lower().strip()}
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    print("Password:", user.password)
    print("Length:", len(user.password))

    hashed_password = pwd_context.hash(user.password)

    user_data = {
        "name": user.name.strip(),
        "email": user.email.lower().strip(),
        "password": hashed_password,
    }

    await db.users.insert_one(user_data)

    return {
        "message": "User created successfully"
    }


# ----------------------------------------
# Login
# ----------------------------------------

@router.post("/login")
async def login(user: User):

    existing_user = await db.users.find_one(
        {"email": user.email.lower().strip()}
    )

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not pwd_context.verify(
        user.password,
        existing_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "message": "Login Successful",
        "name": existing_user["name"],
        "email": existing_user["email"]
    }