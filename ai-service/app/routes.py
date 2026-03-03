import os
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from openai import OpenAI;

from azure.ai.inference.models import SystemMessage, UserMessage, AssistantMessage

router = APIRouter()


model = "openai/gpt-oss-20b"
client = OpenAI(
    api_key=os.environ["GROQ_API_KEY"],
    base_url="https://api.groq.com/openai/v1",
)



class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]



@router.post("/generate")
async def generate(request: ChatRequest):

    formatted_messages = []

    for msg in request.messages:
        if msg.role == "system":
            formatted_messages.append(SystemMessage(msg.content))
        elif msg.role == "user":
            formatted_messages.append(UserMessage(msg.content))
        elif msg.role == "assistant":
            formatted_messages.append(AssistantMessage(msg.content))

    response = client.chat.completions.create(
        messages=formatted_messages,
        model=model
    )

    answer = response.choices[0].message.content

    return {"answer": answer}