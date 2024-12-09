from fastapi import FastAPI, Request
from os import getenv
from langchain_huggingface import HuggingFaceEmbeddings
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()
MY_KEY = getenv("MY_KEY")

embeddings = HuggingFaceEmbeddings(model_name="jinaai/jina-embeddings-v2-small-en")

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.post("/receive-embeddings")
async def receive_embeddings(request: Request):
    data = await request.json()
    embeddings = data.get("embeddings")
    # Process the embeddings as needed
    return {"status": "OK"}

@app.get("/embeddings")
def get_embeddings(input: str):
    result = embeddings.embed_query(input)
    return {
        "embeddings": result,
        "test": "testtext"
        }

@app.get("/", response_class=HTMLResponse)
def get_index():
    with open("static/index.html") as f:
        return f.read()

