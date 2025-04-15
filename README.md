
# SkillSync Resume Analyzer

A web application that analyzes resumes against job descriptions to help job seekers optimize their applications.

## Features

- Upload resume PDF
- Enter job description
- Get analysis of matching and missing keywords
- Receive suggestions for resume improvement

## Project Structure

- `/src` - React frontend
- `/backend` - Python Flask backend for resume analysis

## Frontend Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Start the Python server:
   ```
   python app.py
   ```

## How It Works

1. Upload your resume PDF
2. Enter or paste a job description
3. Click "Analyze Resume"
4. View the analysis results showing:
   - Matching keywords
   - Missing keywords
   - Customized suggestions

## Technologies Used

- Frontend: React, TypeScript, Tailwind CSS, shadcn/ui
- Backend: Python, Flask, NLTK, PyPDF2
