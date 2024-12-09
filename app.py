from fastapi import FastAPI, Request
from os import getenv
from langchain_huggingface import HuggingFaceEmbeddings
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from modules.langchain_init import get_llm
from modules.soup_extractor import bs4_extractor
from langchain_community.document_loaders import WebBaseLoader, RecursiveUrlLoader
from langchain_core.vectorstores import InMemoryVectorStore
from langchain import hub

app = FastAPI()
MY_KEY = getenv("MY_KEY")

embeddings = HuggingFaceEmbeddings(model_name="jinaai/jina-embeddings-v2-small-en")
llm = get_llm()

def create_loader(url:str):
    return RecursiveUrlLoader(
        # "https://book.cairo-lang.org/",
        url,
        extractor=bs4_extractor,
        max_depth=2,
    )
    
loader = {}

docs = []

my_vector_store = {}

prompt = hub.pull("rlm/rag-prompt")

def simple_rag(question, prompt):
    retrieved_docs = my_vector_store.similarity_search(question)
    docs_content = "\n\n".join(doc.page_content for doc in retrieved_docs)
    prompt = prompt.invoke({"question": question, "context": docs_content})
    return llm.invoke(prompt)

app.mount("/static", StaticFiles(directory="static", html=True), name="static")

@app.post("/receive-embeddings")
async def receive_embeddings(request: Request):
    data = await request.json()
    embeddings = data.get("embeddings")
    # Process the embeddings as needed
    return {"status": "OK"}

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    message = data.get("message")
    # Process the message and generate a reply
    response = simple_rag(message, prompt)
    reply = response.content
    return {"reply": reply}

@app.get("/embeddings")
def get_embeddings(input: str):
    loader = create_loader(input)
    docs = loader.load()
    my_vector_store = InMemoryVectorStore.from_documents(docs, embeddings)

    return {
        "embeddings": [],
        "test": "testtext"
        }

@app.get("/", response_class=HTMLResponse)
def get_index():
    return FileResponse(path="/app/static/index.html", media_type="text/html")

