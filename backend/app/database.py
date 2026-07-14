import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import certifi

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

client = AsyncIOMotorClient(
    MONGODB_URL,
    tls=True,
    tlsCAFile=certifi.where()
)

db = client[DATABASE_NAME]