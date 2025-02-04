from fastapi import APIRouter, HTTPException, status, Request, Query, Body
import pandas as pd
import os
from typing import Optional
from motor.motor_asyncio import (
    AsyncIOMotorClient,
    AsyncIOMotorCollection,
)
from models import LLM

router = APIRouter()

llms_collection: AsyncIOMotorCollection = AsyncIOMotorClient(
    "mongodb://root:example@mongodb:27017"
)["plino"]["llms"]

def get_random_llm():
    
    csv_path = os.path.join('data', 'llms.csv')
    print(f"CSV Path: {csv_path}")

    if not os.path.exists(csv_path):
        raise HTTPException(status_code=400, detail="CSV file not found")
    
    entry = pd.read_csv(csv_path)
    if entry.empty:
        raise HTTPException(status_code=400, detail="CSV file is empty")

    return entry.sample(1).to_dict(orient="records")[0]

async def insert_llm(llm: LLM):
   
    llm = llm.dict()
    # Check for duplicates
    query = {
        "company": llm["company"],
        "category": llm["category"],
        "release_date": llm["release_date"],
        "model_name": llm["model_name"],
        "num_million_parameters": llm["num_million_parameters"]
    }
    print(f"Querying for: {query}")

    # Check for duplicates excluding the _id field
    if await llms_collection.find_one(query):
        print("Found duplicate")
        print(await llms_collection.find_one(query))
        raise HTTPException(status_code=400, detail="Duplicate LLM entry")
    
    return await llms_collection.insert_one(llm)


@router.post("/llm", status_code=status.HTTP_200_OK)
async def add_llm(mode, llm: Optional[LLM] = None):
   
    print("mode: ", mode)
    print("llm: ", llm)
    if mode == "random":
        
        """
        Fetch a random LLM from CSV file and insert it into MongoDB.
        In case it is a duplicate, retry up to 5 times.
        """
    
        for _ in range(5):

            llm_data = get_random_llm()
            print(f"LLM Data: {llm_data}")
            if not await llms_collection.find_one({
                "company": llm_data["company"], 
                "category": llm_data["category"], 
                "release_date": llm_data["release_date"], 
                "model_name": llm_data["model_name"], 
                "num_million_parameters": llm_data["num_million_parameters"]
            }):
                print("entered if")
                result = await llms_collection.insert_one(llm_data)
                llm_data["_id"] = str(result.inserted_id)  # Convert ObjectId to string
                return {"message": "LLM added successfully", "entry": llm_data}

        # If 5 attempts failed (all rows already exist)
        print("never entered if")
        raise HTTPException(status_code=400, detail="Failed to find new LLM entry")
    
    elif mode == "manual":
        if not llm:
            raise HTTPException(status_code=400, detail="Missing LLM object in manual mode")
        
        result = await insert_llm(llm)
        llm = llm.dict()
        llm["_id"] = str(result.inserted_id)
        return {"message": "Custom LLM added", "entry": llm} 

    else:
        raise HTTPException(status_code=400, detail="Invalid mode or missing LLM object")
  
async def retrieve_llms():
    llms = await llms_collection.find().to_list(None)
    if not llms:
        raise HTTPException(status_code=404, detail="No LLMs found in the database")
    print("LLMs retrieved successfully")
    return {"message": "LLMs retrieved successfully", "llms": llms}