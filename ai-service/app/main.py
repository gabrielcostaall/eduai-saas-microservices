from fastapi import FastAPI
from app.routes import router

from app.database import engine
from app.models import Base
import time



app = FastAPI(
    title="EduAI - AI Service",
    version="2.0"
)

app.include_router(router)

@app.on_event("startup")
def startup():
    retries = 5
    while retries > 0:
        try:
            print("Tentando conectar ao banco...")
            Base.metadata.create_all(bind=engine)
            print("Banco conectado e tabelas criadas!")
            break
        except Exception as e:
            print("Banco ainda não pronto, tentando novamente...")
            retries -= 1
            if retries == 0:
                print(e)
            time.sleep(3)

    if retries == 0:
        print("Não foi possível conectar ao banco")

@app.get("/")
def health_check():
    return {"status": "AI Service is running"}
