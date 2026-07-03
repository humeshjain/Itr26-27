from fastapi import FastAPI;
from database import engine
from sqlalchemy import text;

app=FastAPI()

@app.get("/")

def read_root():
    return{"Message":"Hello World"}

@app.get("/health")
def health_check():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    
    return {"message":"Connected"}
