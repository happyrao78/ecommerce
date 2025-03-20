from fastapi import FastAPI,  HTTPException
from pydantic import BaseModel
import os
from main import *
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

class QuestionRequest(BaseModel):
    question: str


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

@app.get("/")
def root():
    return {"message": "Backend working fine!"}



@app.post("/ask-question")
async def ask_question(question_request: QuestionRequest):
    try:
        txt_file_path = "data.txt"  # Path to the extracted text file
        answer = ask_aura_question(question_request.question, txt_file_path)

        if answer.startswith("Error"):
            raise HTTPException(status_code=500, detail=answer)

        # Return only the answer without any TTS API integration
        return {
            "answer": answer
        }

    except Exception as e:
        print(f"Error in ask_question: {str(e)}")  # Print error to console for debugging
        raise HTTPException(status_code=500, detail=str(e))