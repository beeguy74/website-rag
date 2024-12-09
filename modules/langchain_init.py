from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os
# from langchain_cohere import CohereEmbeddings


load_dotenv()

openrouter_api_key=os.environ["OPENROUTER_API_KEY"]
# cohere_api_key=os.environ["COHERE_API_KEY"]


def get_llm(model_name: str = "openai/gpt-4o-mini"):
    return ChatOpenAI(
        model=model_name,
        temperature=0.6,
        openai_api_key=openrouter_api_key,
        openai_api_base="https://openrouter.ai/api/v1"
    )

# def get_embeddings(model_name: str = "embed-multilingual-light-v3.0"):
#     return CohereEmbeddings(
#         model=model_name,
#         cohere_api_key=cohere_api_key,
#     )