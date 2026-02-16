import os

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from openai import OpenAI
from app.config import OPENAI_API_KEY
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.models import Interaction
from app.deps import get_db

from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential

endpoint = "https://models.github.ai/inference"
model = "openai/gpt-4.1-mini"
token = os.environ["GITHUB_TOKEN"]

router = APIRouter()

#client = OpenAI(api_key=OPENAI_API_KEY)
client = ChatCompletionsClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(token),
)


class QuestionRequest(BaseModel):
    question: str


@router.post("/ask")
async def ask_ai(data: QuestionRequest, db: Session = Depends(get_db)):
    response = client.complete(
    messages=[
        SystemMessage("Você é um tutor educacional que explica de forma simples."),
        UserMessage(data.question),
    ],
    model=model
    )
    answer = response.choices[0].message.content
    
    interaction = Interaction(question=data.question, answer=answer)
    db.add(interaction)
    db.commit()
    db.refresh(interaction)

    return {
        "id": interaction.id,
        "question": data.question,
        "answer": answer
    }

    

    # response = client.chat.completions.create(
    #     model="gpt-4o-mini",
    #     messages=[
    #         {"role": "system", "content": "Você é um tutor educacional que explica de forma simples."},
    #         {"role": "user", "content": data.question},
    #     ]
    # )

    # return {
    #     "question": data.question,
    #     "answer": response.choices[0].message.content
    # }
@router.get("/history")
def get_history(db: Session = Depends(get_db)):
    interactions = db.query(Interaction).order_by(Interaction.created_at.desc()).all()

    return [
        {
            "id": i.id,
            "question": i.question,
            "answer": i.answer,
            "created_at": i.created_at
        }
        for i in interactions
    ]

    
