import os
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage, AssistantMessage
from azure.core.credentials import AzureKeyCredential

router = APIRouter()

endpoint = "https://models.github.ai/inference"
model = "openai/gpt-4.1-mini"
token = os.environ["GITHUB_TOKEN"]

client = ChatCompletionsClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(token),
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

    response = client.complete(
        messages=formatted_messages,
        model=model
    )

    answer = response.choices[0].message.content

    return {"answer": answer}