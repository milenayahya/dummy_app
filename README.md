# 🥟🧑‍💻 Plino Tech Assessment

*Job ref #2025-01-06-open*

## Overview

Thanks for taking the time to work on this tech assessment!  
This is a software engineering exercise that will encompass tasks similar to what you will be required to work on in your day-to-day at Plino.  

Our **goals** are:  
1. for you to get a realistic experience of what you will work on
2. for us to understand whether you match the expected engineering skill levels in our areas of interest.

Our goals are **not**:
- to waste your time
- to re-use your submitted code in our repository → this is a toy project on purpose
- to restrict your normal access to external sources and tools → you're free to use whatever you're used to.

Let's begin! 💪

## Assignment

### Setup

Use Docker to run the project:
```bash
docker compose up -d --build
```

After the command above finishes successfully, you will be able to open these web pages:
| Description | URL |
| -------- | -------- |
| React.js frontend   | http://localhost:3000  |
| FastAPI docs   | http://localhost:8000/docs   |
| Mongo Express | http://localhost:8081 |

### Section 1

#### Part 1

Write the POST `/llm` API. This API has 2 modes:
1. it reads the data/llms.csv file and adds 1 random LLM row to the `llms` MongoDB collection
2. it takes in an LLM object with the same data as the data/llms.csv header, validates it, and stores it in the `llms` MongoDB collection

You can decide the database structure. No duplicate LLMs are allowed in the database.  

#### Part 2

Write the GET `/llms` API that returns a list of LLM objects. The API should retrieve documents from the `llms` MongoDB collection. 

### Section 2

#### Part 1

Create a frontend with a UI that allows adding a new LLM to the database, supporting the 2 modes of the POST `/llm` API you've written.

#### Part 2

Create a frontend for the LLMs list returned by the GET API you've written, following these requirements:  
1. all data for every LLM should be shown at load time
2. the frontend should allow filtering by company and category
3. the frontend should update when a new LLM is added to the database with the code that you've written for part 1

### Notes

- You are encouraged to use git commits to make the history of your changes clearer.
- You can test your APIs from the Swagger FastAPI docs page with no need for a client.
- You can see and modify the contents of your Mongo database from the Mongo Express UI.