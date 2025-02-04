from typing import List, Optional
from fastapi import FastAPI, status, Query, Body, HTTPException
from motor.motor_asyncio import (
    AsyncIOMotorClient,
    AsyncIOMotorCollection,
)
from pydantic import BaseModel
from models import LLM
from routes.llms import add_llm, retrieve_llms
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

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
async def create_llm(
    mode: str = Body(...),
    llm: Optional[LLM] = Body(None)
) -> dict:
    """
    Read a random LLM from the CSV file and insert it into the MongoDB collection.
    """
    if mode == "manual":
        if llm is None:
            raise HTTPException(status_code=400, detail="LLM data is required for manual mode")
    
    return await add_llm(mode,llm)


class GetLLMsResponseBody(BaseModel):
    llms: List[LLM]


@app.get(
    "/llms",
    status_code=status.HTTP_200_OK,
    response_model=GetLLMsResponseBody,
)
async def get_llms() -> GetLLMsResponseBody:
    """Retrieve LLMs from the database."""
   
    return await retrieve_llms()