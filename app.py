from fastapi import FastAPI
from os import getenv

app = FastAPI()
MY_KEY = getenv("MY_KEY")

@app.get("/")
def greet_json():
    return {"Hello": "World! My key is: " + MY_KEY}

