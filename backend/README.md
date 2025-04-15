
# Resume Analyzer Backend

This Python Flask backend provides resume analysis functionality for the SkillSync tool.

## Setup

1. Make sure you have Python 3.8+ installed
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the server:
   ```
   python app.py
   ```
   
The server will start on http://localhost:5000

## API Endpoints

### POST /analyze
Analyzes a resume against a job description

**Request:**
- Form data with:
  - `resume`: PDF file
  - `jobDescription`: Text of job description

**Response:**
```json
{
  "matched_keywords": ["keyword1", "keyword2"],
  "missing_keywords": ["keyword3", "keyword4"],
  "suggestions": ["suggestion1", "suggestion2"]
}
```
