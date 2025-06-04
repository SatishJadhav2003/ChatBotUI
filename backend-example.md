# Python Backend API Example

This is an example Python backend API that the Angular chatbot UI can integrate with.

## Required Endpoint

### POST `/api/process-question`

**Example using FastAPI:**

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

# Enable CORS for Angular development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    question: str

class ProcessResponse(BaseModel):
    status: str
    message: str = None
    sql_query: str
    insight: str
    data: list

@app.post("/api/process-question", response_model=ProcessResponse)
async def process_question(request: QuestionRequest):
    try:
        # Your AI/ML processing logic here
        question = request.question
        
        # Example response - replace with your actual logic
        if "sales" in question.lower():
            return ProcessResponse(
                status="valid",
                message=None,
                sql_query="SELECT product_name, SUM(sales_amount) as total_sales FROM sales GROUP BY product_name ORDER BY total_sales DESC LIMIT 10;",
                insight="Based on the sales data, the top-performing products show a clear preference for electronics and home appliances. The seasonal trends indicate higher sales during Q4.",
                data=[
                    {"product_name": "iPhone 15", "total_sales": 125000},
                    {"product_name": "Samsung TV", "total_sales": 98000},
                    {"product_name": "MacBook Pro", "total_sales": 87500},
                    {"product_name": "PlayStation 5", "total_sales": 76000},
                    {"product_name": "Air Fryer", "total_sales": 65000}
                ]
            )
        elif "error" in question.lower():
            return ProcessResponse(
                status="error",
                message="Unable to process this type of question. Please try a different query.",
                sql_query="",
                insight="",
                data=[]
            )
        else:
            return ProcessResponse(
                status="valid",
                message=None,
                sql_query="SELECT COUNT(*) as total_records FROM main_table;",
                insight="This is a general query that returns basic information about your dataset. The data shows standard metrics and patterns.",
                data=[
                    {"total_records": 1000},
                    {"category": "General", "value": "Sample Data"}
                ]
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Setup Instructions

1. **Install Dependencies:**
```bash
pip install fastapi uvicorn
```

2. **Run the Server:**
```bash
python main.py
```

3. **Test the API:**
```bash
curl -X POST "http://localhost:8000/api/process-question" \
     -H "Content-Type: application/json" \
     -d '{"question": "Show me sales data"}'
```

## Integration with Angular UI

Make sure your Python API is running on `http://localhost:8000` before starting the Angular application, or update the API URL in the Angular service:

```typescript
// In src/app/services/chat.service.ts
private readonly apiUrl = 'http://localhost:8000/api';
```

## Example Questions to Test

- "Show me sales data"
- "What are the revenue trends?"
- "Display customer information"
- "Generate an error" (to test error handling)

The chatbot UI will display the response in a structured format with insights, SQL queries, and data tables.
