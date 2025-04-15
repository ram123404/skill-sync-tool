
from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from frontend

# Download necessary NLTK data
nltk.download('punkt')
nltk.download('stopwords')

@app.route('/analyze', methods=['POST'])
def analyze_resume():
    try:
        if 'resume' not in request.files or 'jobDescription' not in request.form:
            return jsonify({'error': 'Missing resume file or job description'}), 400
        
        # Get resume file and job description
        resume_file = request.files['resume']
        job_description = request.form['jobDescription']
        
        # Validate file is PDF
        if not resume_file.filename.endswith('.pdf'):
            return jsonify({'error': 'Please upload a PDF file'}), 400
        
        # Extract text from PDF
        resume_text = extract_text_from_pdf(resume_file)
        
        # Analyze the resume against job description
        analysis_result = compare_resume_to_job(resume_text, job_description)
        
        return jsonify(analysis_result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def extract_text_from_pdf(pdf_file):
    """Extract text content from uploaded PDF file"""
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def compare_resume_to_job(resume_text, job_description):
    """Compare resume text with job description to find matches and gaps"""
    # Convert texts to lowercase for better matching
    resume_text = resume_text.lower()
    job_description = job_description.lower()
    
    # Extract keywords from job description
    job_keywords = extract_keywords(job_description)
    
    # Find matched and missing keywords
    matched_keywords = []
    missing_keywords = []
    
    for keyword in job_keywords:
        if keyword in resume_text:
            matched_keywords.append(keyword)
        else:
            missing_keywords.append(keyword)
    
    # Generate suggestions based on missing keywords
    suggestions = generate_suggestions(missing_keywords)
    
    return {
        'matched_keywords': matched_keywords,
        'missing_keywords': missing_keywords,
        'suggestions': suggestions
    }

def extract_keywords(text):
    """Extract relevant keywords from text"""
    # Tokenize text
    tokens = word_tokenize(text)
    
    # Remove stopwords and punctuation
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word.isalpha() and word not in stop_words and len(word) > 3]
    
    # Find common technical skills and requirements (simplified version)
    common_skills = ["python", "javascript", "react", "node", "java", "c++", "sql", 
                    "database", "frontend", "backend", "fullstack", "devops", "agile", 
                    "testing", "api", "rest", "cloud", "aws", "azure", "docker", 
                    "kubernetes", "microservices", "git", "linux", "windows", 
                    "communication", "teamwork", "leadership", "problem solving", 
                    "analytics", "design", "architecture", "security", "networking",
                    "html", "css", "typescript", "angular", "vue", "django", "flask",
                    "express", "mongodb", "nosql", "mysql", "postgresql", "oracle", 
                    "project management", "scrum", "kanban", "ci/cd", "testing", 
                    "quality assurance", "machine learning", "ai", "data science",
                    "blockchain", "mobile", "ios", "android", "react native", "flutter"]
    
    # Find skills in the job description
    extracted_keywords = []
    for skill in common_skills:
        if skill in text and skill not in extracted_keywords:
            extracted_keywords.append(skill)
    
    # Also extract phrases like "X years of experience"
    experience_matches = re.findall(r'(\d+)\s*(?:\+\s*)?years?\s+(?:of\s+)?experience', text)
    if experience_matches:
        years = max([int(y) for y in experience_matches])
        extracted_keywords.append(f"{years}+ years experience")
    
    # Extract education requirements
    education_terms = ["bachelor", "master", "phd", "degree", "bs", "ms", "ba", "ma"]
    for term in education_terms:
        if term in text and "education" not in extracted_keywords:
            extracted_keywords.append("education")
            break
    
    return extracted_keywords

def generate_suggestions(missing_keywords):
    """Generate suggestions based on missing keywords"""
    suggestions = []
    
    if not missing_keywords:
        return ["Your resume matches well with the job description!"]
    
    if len(missing_keywords) > 0:
        suggestions.append(f"Consider adding these missing keywords to your resume: {', '.join(missing_keywords[:3])}")
    
    # Generate specific suggestions based on common categories
    tech_skills = ["python", "javascript", "react", "java", "sql", "aws", "docker"]
    soft_skills = ["communication", "teamwork", "leadership", "problem solving"]
    
    tech_missing = [skill for skill in tech_skills if skill in missing_keywords]
    soft_missing = [skill for skill in soft_skills if skill in missing_keywords]
    
    if tech_missing:
        suggestions.append(f"Highlight technical skills like {', '.join(tech_missing)} in a dedicated Skills section")
    
    if soft_missing:
        suggestions.append("Include examples of soft skills in your work experience descriptions")
    
    if "experience" in ' '.join(missing_keywords):
        suggestions.append("Quantify your achievements with metrics and numbers to demonstrate experience")
    
    if len(suggestions) < 3:
        suggestions.append("Use industry-standard terminology that matches the job description")
    
    return suggestions

if __name__ == '__main__':
    app.run(debug=True, port=5000)
