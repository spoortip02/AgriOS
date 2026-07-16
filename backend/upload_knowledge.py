import os
from pinecone import Pinecone
from knowledge_base import KNOWLEDGE_BASE
from dotenv import load_dotenv

load_dotenv()

def upload_to_pinecone():
    api_key = os.getenv("PINECONE_API_KEY")
    index_host = os.getenv("PINECONE_INDEX_HOST")
    
    if not api_key or not index_host:
        print("❌ Missing PINECONE_API_KEY or PINECONE_INDEX_HOST")
        return
    
    pc = Pinecone(api_key=api_key)
    index = pc.Index(host=index_host)
    
    print(f"Uploading {len(KNOWLEDGE_BASE)} knowledge chunks to Pinecone...")
    
    # Upload in batches
    records = []
    for item in KNOWLEDGE_BASE:
        records.append({
            "id": item["id"],
            "text": item["text"],
            "category": item["category"],
            "crop": item["crop"],
            "type": item["type"]
        })
    
    # Upsert to Pinecone
    index.upsert_records(
        namespace="agrios",
        records=records
    )
    
    print(f"✅ Successfully uploaded {len(records)} records to Pinecone!")
    print("Knowledge base is ready for RAG queries.")

if __name__ == "__main__":
    upload_to_pinecone()