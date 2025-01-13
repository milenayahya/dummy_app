from typing import List

from fastapi import FastAPI, status
from motor.motor_asyncio import (
    AsyncIOMotorClient,
    AsyncIOMotorCollection,
)
from pydantic import BaseModel


app = FastAPI()
llms_collection: AsyncIOMotorCollection = AsyncIOMotorClient(
    "mongodb://root:example@mongodb:27017"
)["plino"]["llms"]


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.post(
    "/llm",
    status_code=status.HTTP_201_CREATED,
)
async def create_llm() -> None:
    """
    Read a random LLM from the CSV file and insert it into the MongoDB collection.
    """
    ...


class GetLLMsResponseBody(BaseModel):
    llms: List[LLM]


@app.get(
    "/llms",
    status_code=status.HTTP_200_OK,
    response_model=GetLLMsResponseBody,
)
async def get_llms() -> GetLLMsResponseBody:
    """Retrieve LLMs from the database."""
    return ...