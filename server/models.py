from pydantic import BaseModel
from datetime import date

class LLM(BaseModel):
    company: str
    category: str
    release_date: str
    model_name: str
    num_million_parameters: int
