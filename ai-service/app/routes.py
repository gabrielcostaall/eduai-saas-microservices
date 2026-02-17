import os

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.config import OPENAI_API_KEY
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.models import Message
from app.deps import get_db

from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage, AssistantMessage
from azure.core.credentials import AzureKeyCredential

endpoint = "https://models.github.ai/inference"
model = "openai/gpt-4.1-mini"
token = os.environ["GITHUB_TOKEN"]

router = APIRouter()

client = ChatCompletionsClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(token),
)


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    user_message = Message(role="user", content=request.message)
    db.add(user_message)
    db.commit()

     
    history = db.query(Message).order_by(Message.created_at.asc()).all()

    
    messages_for_model = [
        SystemMessage("Você é um tutor educacional que explica de forma simples.")
    ]

    for msg in history:
        if msg.role == "user":
            messages_for_model.append(UserMessage(msg.content))
        else:
            messages_for_model.append(AssistantMessage(msg.content))
            
    response = client.complete(
    messages=messages_for_model,
    model=model
    )
    answer = response.choices[0].message.content

    
    assistant_message = Message(role="assistant", content=answer)
    db.add(assistant_message)
    db.commit()

    return {"response": answer}

    

@router.get("/messages")
def get_messages(db: Session = Depends(get_db)):
    messages = db.query(Message).order_by(Message.created_at.asc()).all()
    return messages

    
