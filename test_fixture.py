"""Fixture file for testing detect_ai_apis.py — contains deliberate API calls."""
import os

# ── OpenAI ──────────────────────────────────────────────
import openai

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def summarize(text: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": f"Summarize: {text}"}],
    )
    return response.choices[0].message.content

def get_embedding(text: str) -> list:
    response = client.embeddings.create(model="text-embedding-3-small", input=text)
    return response.data[0].embedding

def generate_image(prompt: str) -> str:
    result = client.images.generate(model="dall-e-3", prompt=prompt, n=1)
    return result.data[0].url

# ── Anthropic ───────────────────────────────────────────
from anthropic import Anthropic

ac = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def classify_sentiment(text: str) -> str:
    msg = ac.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=64,
        messages=[{"role": "user", "content": f"Classify sentiment of: {text}"}],
    )
    return msg.content[0].text

# ── Cohere ──────────────────────────────────────────────
import cohere

co = cohere.Client(api_key=os.getenv("COHERE_API_KEY"))

def translate_text(text: str) -> str:
    return co.generate(model="command", prompt=f"Translate to French: {text}").generations[0].text

def embed_docs(docs: list) -> list:
    return co.embed(texts=docs, model="embed-english-v3.0").embeddings

# ── Google GenAI ────────────────────────────────────────
import google.generativeai as genai

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-pro")

def answer_question(question: str) -> str:
    return model.generate_content(question).text

# ── Mistral (commercial) ────────────────────────────────
from mistralai import MistralClient

mc = MistralClient(api_key=os.getenv("MISTRAL_API_KEY"))

def chat_mistral(prompt: str) -> str:
    return mc.chat(model="mistral-large", messages=[{"role": "user", "content": prompt}])

# ── Azure OpenAI ────────────────────────────────────────
from openai import AzureOpenAI

az = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    azure_endpoint=os.getenv("AZURE_ENDPOINT"),
    api_version="2024-02-01",
)

def azure_chat(prompt: str) -> str:
    resp = az.chat.completions.create(model="gpt-4", messages=[{"role": "user", "content": prompt}])
    return resp.choices[0].message.content

# ── AWS Bedrock ─────────────────────────────────────────
import boto3

bedrock = boto3.client("bedrock-runtime", region_name="us-east-1")

def bedrock_generate(prompt: str) -> str:
    body = json.dumps({"prompt": prompt, "max_tokens": 256})
    resp = bedrock.invoke_model(modelId="anthropic.claude-v2", body=body)
    return json.loads(resp["body"].read())["completion"]
