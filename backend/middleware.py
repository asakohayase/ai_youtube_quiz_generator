from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


def add_middleware(app: FastAPI) -> None:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],  # Adjust this to your frontend's URL
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
