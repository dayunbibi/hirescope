from fastapi import FastAPI

app = FastAPI(title="HireScope API")


@app.get("/")
def root():
    return {"message": "HireScope API is running"}


@app.get("/jobs")
def get_jobs():
    return []