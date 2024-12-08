from fastapi import FastAPI
from os import getenv
from langchain_huggingface import HuggingFaceEmbeddings

app = FastAPI()
MY_KEY = getenv("MY_KEY")

embeddings = HuggingFaceEmbeddings(model_name="jinaai/jina-embeddings-v2-small-en")


@app.get("/embeddings")
def get_embeddings():
    test = embeddings.embed_query("Hello, world!")
    return {
        "embeddings": "This is the embeddings endpoint",
        "test": test
        }

@app.get("/")
def greet_json():
    return {"Hello": "World! My key is: " + MY_KEY}

