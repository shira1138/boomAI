

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests


app = FastAPI(title="Boom AI - General Business Solutions")
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add security headers middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Cache-Control"] = "no-store"
        return response
app.add_middleware(SecurityHeadersMiddleware)


# Request models
class BusinessProblemRequest(BaseModel):
    problem: str

class AnalyticsRequest(BaseModel):
    data: list

class AutomationRequest(BaseModel):
    task: str

class ForecastRequest(BaseModel):
    historical_data: list


# Universal AI-powered endpoint
class AskAnythingRequest(BaseModel):
    question: str

@app.post("/ask")
def ask_anything(request: AskAnythingRequest):
    # Return a sample answer for testing frontend-backend connection
    sample_answer = f"Sample answer for: {request.question}"
    return {"answer": sample_answer}

# General business problem solver
@app.post("/solve")
def solve_business_problem(request: BusinessProblemRequest):
    solution = f"AI solution for: {request.problem}"
    return {"solution": solution}

# Analytics endpoint
@app.post("/analytics")
def business_analytics(request: AnalyticsRequest):
    # Placeholder: return basic stats
    if not request.data:
        return {"error": "No data provided."}
    stats = {
        "count": len(request.data),
        "sum": sum(request.data),
        "average": sum(request.data) / len(request.data)
    }
    return {"analytics": stats}

# Automation endpoint
@app.post("/automate")
def automate_task(request: AutomationRequest):
    # Placeholder: echo the task
    result = f"Task '{request.task}' automated successfully."
    return {"result": result}

# Forecasting endpoint
@app.post("/forecast")
def forecast(request: ForecastRequest):
    # Placeholder: simple trend
    if not request.historical_data:
        return {"error": "No historical data provided."}
    trend = "upward" if request.historical_data[-1] > request.historical_data[0] else "downward"
    return {"forecast": f"Predicted trend is {trend}."}

@app.get("/")
def root():
    return {"message": "Welcome to Boom AI - General Business Solutions API"}
