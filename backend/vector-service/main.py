from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from typing import List

app = FastAPI(title="Vector Embedding Service")

# Load the Vietnamese embedding model
# Note: The first time this runs, it will download the model (~400-500MB)
model_name = "AITeamVN/Vietnamese_Embedding_v2"
model = SentenceTransformer(model_name)

class EmbedRequest(BaseModel):
    text: str

class EmbedResponse(BaseModel):
    vector: List[float]

@app.post("/embed", response_model=EmbedResponse)
async def get_embedding(req: EmbedRequest):
    # Encode the text
    embeddings = model.encode(req.text)
    # Convert numpy array to list of floats
    return {"vector": embeddings.tolist()}

@app.get("/health")
async def health_check():
    return {"status": "ok", "model": model_name}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
