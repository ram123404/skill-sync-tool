
# Resume Analyzer Backend

This Python Flask backend provides comprehensive resume analysis functionality for the SkillSync tool.

## Features

- **Advanced PDF Text Extraction**: Reliably extracts text from various PDF resume formats
- **Multi-Domain Keyword Analysis**: Identifies relevant keywords across different industry domains
- **Experience & Education Matching**: Evaluates if your resume meets job requirements
- **Personalized Suggestions**: Provides tailored recommendations to improve your resume
- **Section Analysis**: Identifies missing resume sections important for your application
- **Semantic Matching**: Uses NLP to understand context and synonyms, not just exact matches

## Setup

1. Make sure you have Python 3.8+ installed
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Download required NLP models (automatic on first run):
   ```
   python -m spacy download en_core_web_sm
   ```
4. Run the server:
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
  "match_score": 75,
  "suggestions": ["suggestion1", "suggestion2"],
  "missing_sections": ["section1", "section2"],
  "experience_match": {
    "match": true,
    "confidence": "high",
    "message": "Resume indicates sufficient experience"
  },
  "education_match": {
    "match": true,
    "confidence": "high",
    "message": "Education requirements met"
  }
}
```

## Implementation Details

This backend uses:
- **spaCy**: For advanced NLP and entity recognition
- **NLTK**: For text processing and analysis
- **scikit-learn**: For text similarity calculations
- **PyPDF2**: For PDF processing
- **Flask**: For the web API interface
