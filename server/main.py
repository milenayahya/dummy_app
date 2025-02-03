from typing import List
from fastapi import FastAPI, status, Query
from motor.motor_asyncio import (
    AsyncIOMotorClient,
    AsyncIOMotorCollection,
)
from pydantic import BaseModel
from models import LLM
from routes.llms import add_llm

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
async def create_llm(mode: str = Query("random", enum=["random", "manual"])) -> dict:
    """
    Read a random LLM from the CSV file and insert it into the MongoDB collection.
    """
    if mode == "manual":
        # dummy data
        llm_data = {
            "company": "AlexNet",
            "category": "vision",
            "release_date": "2023-12-06",
            "model_name": "Gemini 1.5 Pro",
            "num_million_parameters": 8978,
        }
    else:
        llm_data = None
        
    return await add_llm(mode=mode, llm=llm_data)

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