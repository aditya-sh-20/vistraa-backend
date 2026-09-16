import os
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.utils.cleanup import cleanup_old_patterns

app = FastAPI(
    title="Vistraa AI Microservice",
    description="Affective Computing & Procedural Fabric Pattern Engine",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration for Spring Boot & React Frontend IPC
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup Hook: Auto-clean old image patterns on boot
@app.on_event("startup")
def startup_event():
    cleanup_old_patterns(max_age_seconds=3600)

# Global Exception Interceptor
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "error",
            "message": "An internal error occurred within the Vistraa AI Engine.",
            "details": str(exc),
            "path": request.url.path
        }
    )

# Include API Router
app.include_router(api_router, prefix="/api/v1")

@app.get("/", tags=["Root"])
def root():
    return {"message": "Welcome to Vistraa AI Microservice"}