
import azure.functions as func
import datetime
import json
import logging
import io
import os
import PyPDF2
import re
import nltk
import spacy
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = func.FunctionApp()

# Download necessary NLTK data
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger')

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    # If model not found, download it
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

@app.route(route="analyze", methods=["POST"])
def analyze(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Resume analysis function processed a request.')
    
    try:
        # Get resume file and job description from the request
        form_data = req.form
        files = req.files
        
        if 'resume' not in files or 'jobDescription' not in form_data:
            return func.HttpResponse(
                json.dumps({'error': 'Missing resume file or job description'}),
                status_code=400,
                mimetype="application/json"
            )
        
        # Get resume file and job description
        resume_file = files.get('resume')
        job_description = form_data.get('jobDescription')
        
        # Validate file is PDF
        if not resume_file.filename.endswith('.pdf'):
            return func.HttpResponse(
                json.dumps({'error': 'Please upload a PDF file'}),
                status_code=400,
                mimetype="application/json"
            )
        
        # Extract text from PDF
        resume_text = extract_text_from_pdf(resume_file)
        
        # Analyze the resume against job description
        analysis_result = analyze_resume_comprehensively(resume_text, job_description)
        
        return func.HttpResponse(
            json.dumps(analysis_result),
            status_code=200,
            mimetype="application/json"
        )
    
    except Exception as e:
        logging.error(f"Error during analysis: {str(e)}")
        return func.HttpResponse(
            json.dumps({'error': str(e)}),
            status_code=500,
            mimetype="application/json"
        )

# ... keep existing code (all the helper functions remain unchanged)
def extract_text_from_pdf(pdf_file):
    """Extract text content from uploaded PDF file"""
    try:
        file_bytes = pdf_file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        logging.error(f"Error extracting PDF text: {str(e)}")
        raise Exception("Could not extract text from the PDF. Please ensure it's a valid PDF file.")

def analyze_resume_comprehensively(resume_text, job_description):
    """Comprehensive resume analysis using multiple NLP techniques"""
    # Process texts with spaCy for better entity recognition
    resume_doc = nlp(resume_text)
    job_doc = nlp(job_description)
    
    # 1. Extract skills, experience, education and other entities
    resume_entities = extract_entities(resume_doc)
    job_entities = extract_entities(job_doc)
    
    # 2. Extract technical skills and domain-specific keywords
    job_keywords = extract_keywords_by_domain(job_description)
    
    # 3. Find matched and missing keywords with context awareness
    matched_keywords, missing_keywords = find_keyword_matches(resume_text.lower(), job_keywords)
    
    # 4. Calculate overall match score
    match_score = calculate_match_score(matched_keywords, missing_keywords)
    
    # 5. Extract experience level requirements
    experience_requirements = extract_experience_requirements(job_description)
    
    # 6. Extract education requirements
    education_requirements = extract_education_requirements(job_description)
    
    # 7. Generate personalized suggestions
    suggestions = generate_personalized_suggestions(
        matched_keywords, 
        missing_keywords, 
        resume_text, 
        job_description,
        resume_entities,
        job_entities,
        experience_requirements,
        education_requirements
    )
    
    # 8. Extract key sections that might be missing in the resume
    missing_sections = identify_missing_sections(resume_text)
    
    return {
        'matched_keywords': matched_keywords,
        'missing_keywords': missing_keywords,
        'match_score': match_score,
        'suggestions': suggestions,
        'missing_sections': missing_sections,
        'experience_match': check_experience_match(resume_text, experience_requirements),
        'education_match': check_education_match(resume_entities.get('education', []), education_requirements)
    }

def extract_entities(doc):
    """Extract various entities from spaCy document"""
    entities = {
        'skills': [],
        'experience': [],
        'education': [],
        'companies': [],
        'job_titles': []
    }
    
    # Extract entities from the document
    for ent in doc.ents:
        if ent.label_ == "ORG":
            entities['companies'].append(ent.text)
        elif ent.label_ == "PRODUCT" or ent.label_ == "WORK_OF_ART":
            # These often contain technical skills or tools
            if len(ent.text) > 3 and ent.text.lower() not in [s.lower() for s in entities['skills']]:
                entities['skills'].append(ent.text)
    
    # Look for educational information
    education_patterns = ["degree", "bachelor", "master", "phd", "bs", "ms", "ba", "diploma", "certification"]
    edu_sentences = [sent for sent in doc.sents if any(edu_term in sent.text.lower() for edu_term in education_patterns)]
    
    for sent in edu_sentences:
        entities['education'].append(sent.text.strip())
    
    # Look for job titles
    job_title_patterns = ["engineer", "developer", "manager", "director", "specialist", "analyst", "consultant", "designer"]
    for chunk in doc.noun_chunks:
        if any(title in chunk.text.lower() for title in job_title_patterns) and len(chunk.text) < 50:
            entities['job_titles'].append(chunk.text.strip())
    
    # Deduplicate lists
    for key in entities:
        entities[key] = list(set(entities[key]))
    
    return entities

def extract_keywords_by_domain(text):
    """Extract relevant keywords by domain from text"""
    # Define domains and their associated keywords
    domains = {
        'software_development': [
            "python", "javascript", "java", "c++", "c#", "ruby", "php", "swift", "kotlin", "typescript", 
            "react", "angular", "vue", "node", "django", "flask", "spring", "express", "laravel", 
            "html", "css", "sass", "less", "bootstrap", "tailwind", "material-ui", "responsive design",
            "restful api", "graphql", "soap", "microservices", "monolith", "serverless", 
            "git", "svn", "github", "gitlab", "bitbucket", "ci/cd", "jenkins", "travis", "circle ci",
            "agile", "scrum", "kanban", "waterfall", "jira", "confluence", "trello", "asana",
            "oop", "functional programming", "design patterns", "solid principles", "mvc", "mvvm",
            "tdd", "bdd", "unit testing", "integration testing", "end-to-end testing", "jest", "pytest", "junit",
            "debugging", "refactoring", "code review", "pair programming", "technical documentation"
        ],
        'data_science': [
            "python", "r", "sql", "tableau", "power bi", "excel", "pandas", "numpy", "scipy", "matplotlib", 
            "seaborn", "scikit-learn", "tensorflow", "keras", "pytorch", "machine learning", "deep learning", 
            "neural networks", "nlp", "computer vision", "time series analysis", "regression", "classification", 
            "clustering", "dimensionality reduction", "feature engineering", "data cleaning", "data visualization", 
            "statistics", "probability", "hypothesis testing", "a/b testing", "etl", "big data", "hadoop", 
            "spark", "kafka", "airflow", "data warehouse", "data lake", "data mining", "predictive modeling",
            "forecasting", "anomaly detection", "recommendation systems", "reinforcement learning"
        ],
        'marketing': [
            "digital marketing", "content marketing", "seo", "sem", "ppc", "google ads", "facebook ads", 
            "social media marketing", "email marketing", "affiliate marketing", "influencer marketing", 
            "brand management", "market research", "customer segmentation", "customer journey", "sales funnel", 
            "conversion rate optimization", "analytics", "google analytics", "facebook pixel", "utm parameters", 
            "a/b testing", "copywriting", "content strategy", "editorial calendar", "blogging", "lead generation", 
            "marketing automation", "hubspot", "mailchimp", "constant contact", "marketo", "hootsuite", "buffer", 
            "canva", "adobe creative suite", "video marketing", "podcast marketing", "public relations"
        ],
        'finance': [
            "accounting", "bookkeeping", "financial analysis", "financial modeling", "financial reporting", 
            "budgeting", "forecasting", "variance analysis", "cost accounting", "tax preparation", "audit", 
            "compliance", "risk management", "financial statements", "balance sheet", "income statement", 
            "cash flow statement", "ratio analysis", "liquidity", "solvency", "profitability", "quickbooks", 
            "xero", "sage", "sap", "oracle financials", "microsoft dynamics", "excel", "pivot tables", 
            "vlookup", "macros", "investment analysis", "portfolio management", "equity valuation", 
            "discounted cash flow", "capital budgeting", "wacc", "banking", "lending", "underwriting"
        ],
        'healthcare': [
            "patient care", "clinical experience", "medical terminology", "electronic health records", "ehr", 
            "epic", "cerner", "meditech", "allscripts", "icd-10", "cpt coding", "hipaa", "patient safety", 
            "quality improvement", "care coordination", "case management", "discharge planning", "medication administration", 
            "vital signs", "assessment", "treatment planning", "patient education", "infection control", 
            "sterilization", "medical equipment", "diagnostic procedures", "therapeutic procedures", "rehabilitation", 
            "acute care", "primary care", "specialty care", "emergency care", "telehealth", "medical research", 
            "clinical trials", "healthcare compliance", "healthcare policy", "healthcare administration", "billing", "coding"
        ],
        'education': [
            "curriculum development", "lesson planning", "classroom management", "student assessment", 
            "differentiated instruction", "special education", "individualized education plan", "iep", 
            "learning management system", "lms", "canvas", "blackboard", "google classroom", "educational technology", 
            "e-learning", "blended learning", "remote teaching", "formative assessment", "summative assessment", 
            "rubrics", "student engagement", "behavior management", "parent communication", "student advising", 
            "educational psychology", "child development", "adolescent development", "group facilitation", 
            "project-based learning", "inquiry-based learning", "cooperative learning", "bloom's taxonomy", 
            "universal design for learning", "udl", "common core standards", "state standards", "accreditation"
        ],
        'project_management': [
            "project planning", "project scheduling", "project execution", "project monitoring", "project closing", 
            "scope management", "time management", "cost management", "quality management", "resource management", 
            "risk management", "communication management", "stakeholder management", "procurement management", 
            "pmp", "prince2", "agile", "scrum", "kanban", "waterfall", "hybrid", "ms project", "primavera", 
            "jira", "asana", "trello", "basecamp", "gantt charts", "pert charts", "wbs", "critical path method", 
            "earned value management", "kpis", "project governance", "project documentation", "status reporting", 
            "issue resolution", "change management", "benefits realization", "lessons learned", "project portfolio management"
        ],
        'customer_service': [
            "customer support", "client relations", "call center", "help desk", "technical support", 
            "customer retention", "customer satisfaction", "customer experience", "complaint resolution", 
            "conflict resolution", "de-escalation", "active listening", "empathy", "patience", "communication skills", 
            "problem-solving", "product knowledge", "service recovery", "crm", "salesforce", "zendesk", 
            "freshdesk", "live chat", "ticketing system", "phone etiquette", "email communication", 
            "social media support", "customer feedback", "customer surveys", "nps", "csat", "first call resolution", 
            "average handle time", "quality assurance", "service level agreements", "sla", "customer onboarding"
        ],
    }
    
    # Process the text
    processed_text = text.lower()
    
    # Find all domain-specific keywords in the text
    found_keywords = []
    
    # First, try to detect which domain the job is most related to
    domain_counts = {}
    for domain, keywords in domains.items():
        count = 0
        for keyword in keywords:
            if keyword in processed_text:
                count += 1
        domain_counts[domain] = count
    
    # Sort domains by relevance
    sorted_domains = sorted(domain_counts.items(), key=lambda x: x[1], reverse=True)
    
    # Get keywords from top 3 most relevant domains
    primary_domains = [domain for domain, count in sorted_domains[:3] if count > 0]
    
    for domain in primary_domains:
        for keyword in domains[domain]:
            # Use regex to find whole word matches only
            if re.search(r'\b' + re.escape(keyword) + r'\b', processed_text):
                found_keywords.append(keyword)
    
    # Add common skills across all fields
    common_skills = [
        "leadership", "teamwork", "communication", "written communication", "verbal communication",
        "presentation skills", "public speaking", "interpersonal skills", "problem solving",
        "critical thinking", "analytical skills", "detail oriented", "organization",
        "time management", "multitasking", "prioritization", "decision making",
        "adaptability", "flexibility", "creativity", "innovation"
    ]
    
    for skill in common_skills:
        if re.search(r'\b' + re.escape(skill) + r'\b', processed_text):
            found_keywords.append(skill)
    
    # Extract experience requirements (e.g., "5+ years")
    experience_matches = re.findall(r'(\d+)\s*(?:\+\s*)?years?\s+(?:of\s+)?experience', processed_text)
    if experience_matches:
        years = max([int(y) for y in experience_matches])
        found_keywords.append(f"{years}+ years experience")
    
    # Extract education requirements
    education_patterns = [
        r"bachelor'?s degree", r"master'?s degree", r"phd", r"doctoral degree", 
        r"high school diploma", r"associate'?s degree", r"certificate"
    ]
    
    for pattern in education_patterns:
        if re.search(pattern, processed_text):
            match = re.search(pattern, processed_text).group(0)
            found_keywords.append(match)
    
    # Remove duplicates
    found_keywords = list(set(found_keywords))
    
    return found_keywords

def find_keyword_matches(resume_text, job_keywords):
    """Find matched and missing keywords with context awareness"""
    matched = []
    missing = []
    
    for keyword in job_keywords:
        # Use regex for more accurate matching (whole word match)
        if re.search(r'\b' + re.escape(keyword.lower()) + r'\b', resume_text):
            matched.append(keyword)
        else:
            # Check for potential synonyms or related terms
            if is_synonym_present(keyword, resume_text):
                matched.append(keyword)
            else:
                missing.append(keyword)
    
    return matched, missing

def is_synonym_present(keyword, text):
    """Check if a synonym of the keyword is present in the text"""
    # Dictionary of common synonyms in professional contexts
    synonyms = {
        "develop": ["code", "program", "engineer", "implement", "build"],
        "analyze": ["examine", "investigate", "assess", "evaluate", "review"],
        "manage": ["oversee", "supervise", "direct", "lead", "coordinate"],
        "communication": ["interpersonal", "articulate", "verbal", "present", "write"],
        "problem solving": ["troubleshoot", "debug", "resolve", "solution"],
        "leadership": ["guide", "direct", "mentor", "influence"],
        "teamwork": ["collaboration", "cooperative", "cross-functional"],
        # Add more as needed
    }
    
    # Check if keyword is in our synonym dictionary
    if keyword.lower() in synonyms:
        for synonym in synonyms[keyword.lower()]:
            if re.search(r'\b' + re.escape(synonym.lower()) + r'\b', text):
                return True
    
    return False

def calculate_match_score(matched_keywords, missing_keywords):
    """Calculate overall match score based on matched and missing keywords"""
    total_keywords = len(matched_keywords) + len(missing_keywords)
    if total_keywords == 0:
        return 0
    
    # Base score from percentage of matched keywords
    base_score = (len(matched_keywords) / total_keywords) * 100
    
    # Weight some keywords higher than others (e.g., technical skills might be more important)
    # This is a simplified implementation - a real system would have a more nuanced approach
    weighted_score = base_score
    
    return round(weighted_score)

def extract_experience_requirements(job_description):
    """Extract experience requirements from job description"""
    experience_info = {
        'years': 0,
        'has_requirement': False,
        'description': ''
    }
    
    # Look for mentions of years of experience
    experience_patterns = [
        r'(\d+)[\+]?\s+years?\s+(?:of\s+)?experience',
        r'experience\s*:?\s*(\d+)[\+]?\s+years?',
        r'minimum\s+(?:of\s+)?(\d+)[\+]?\s+years?\s+(?:of\s+)?experience',
        r'at\s+least\s+(\d+)[\+]?\s+years?\s+(?:of\s+)?experience'
    ]
    
    for pattern in experience_patterns:
        matches = re.findall(pattern, job_description.lower())
        if matches:
            # Convert all matches to integers and find the maximum
            years = max([int(y) for y in matches])
            experience_info['years'] = years
            experience_info['has_requirement'] = True
            experience_info['description'] = f"{years}+ years of experience required"
            break
    
    return experience_info

def extract_education_requirements(job_description):
    """Extract education requirements from job description"""
    education_info = {
        'level': 'none',
        'has_requirement': False,
        'description': ''
    }
    
    # Define education levels from highest to lowest
    education_levels = {
        'phd': ['phd', 'doctorate', 'doctoral degree'],
        'masters': ['master', 'ms', 'ma', 'msc', 'mba', 'master\'s'],
        'bachelors': ['bachelor', 'bs', 'ba', 'bsc', 'bachelor\'s', 'undergraduate degree'],
        'associates': ['associate', 'as', 'aa', 'associate\'s', 'associate degree'],
        'certificate': ['certificate', 'certification', 'diploma'],
        'high school': ['high school', 'hs', 'high school diploma', 'ged']
    }
    
    job_description_lower = job_description.lower()
    
    # Find the highest level of education mentioned
    for level, terms in education_levels.items():
        for term in terms:
            if re.search(r'\b' + re.escape(term) + r'\b', job_description_lower):
                education_info['level'] = level
                education_info['has_requirement'] = True
                
                # Extract the full context
                pattern = r'[^.!?]*\b' + re.escape(term) + r'\b[^.!?]*[.!?]'
                context_matches = re.findall(pattern, job_description_lower)
                
                if context_matches:
                    education_info['description'] = context_matches[0].strip()
                else:
                    education_info['description'] = f"{level.capitalize()} degree required"
                
                # Return after finding the highest level
                return education_info
    
    return education_info

def check_experience_match(resume_text, experience_requirements):
    """Check if resume appears to meet experience requirements"""
    if not experience_requirements['has_requirement']:
        return {
            'match': True,
            'confidence': 'high',
            'message': 'No specific experience requirement found in job description'
        }
    
    required_years = experience_requirements['years']
    
    # Look for experience mentions in resume
    experience_patterns = [
        r'(\d+)[\+]?\s+years?\s+(?:of\s+)?experience',
        r'(\d{4})\s*[-–]\s*(?:present|current|now|\d{4})',  # Date ranges like 2018-present
        r'(\d{4})\s*[-–]\s*(\d{4})'  # Date ranges like 2018-2022
    ]
    
    years_mentioned = []
    date_ranges = []
    
    for pattern in experience_patterns:
        if pattern.endswith('experience'):
            # Direct mentions of years of experience
            matches = re.findall(pattern, resume_text.lower())
            if matches:
                years_mentioned.extend([int(y) for y in matches])
        else:
            # Date ranges
            matches = re.findall(pattern, resume_text)
            if matches:
                for match in matches:
                    if isinstance(match, tuple):
                        if len(match) == 2 and match[1].lower() in ['present', 'current', 'now']:
                            # Calculate years from start year to current year
                            import datetime
                            current_year = datetime.datetime.now().year
                            start_year = int(match[0])
                            if start_year <= current_year:
                                years = current_year - start_year
                                date_ranges.append(years)
                        elif len(match) == 2:
                            # Calculate range between two years
                            start_year = int(match[0])
                            end_year = int(match[1])
                            if start_year <= end_year:
                                years = end_year - start_year
                                date_ranges.append(years)
    
    # Determine longest continuous experience
    max_years = 0
    if years_mentioned:
        max_years = max(years_mentioned)
    if date_ranges:
        max_years = max(max_years, max(date_ranges))
    
    # Determine if experience matches requirement
    if max_years >= required_years:
        return {
            'match': True,
            'confidence': 'high',
            'message': f'Resume indicates {max_years} years of experience, meeting the requirement of {required_years}+ years'
        }
    elif max_years > 0:
        return {
            'match': False,
            'confidence': 'medium',
            'message': f'Resume indicates {max_years} years of experience, which is less than the required {required_years}+ years'
        }
    else:
        return {
            'match': False,
            'confidence': 'low',
            'message': f'Could not determine years of experience from resume. Job requires {required_years}+ years'
        }

def check_education_match(education_entities, education_requirements):
    """Check if resume appears to meet education requirements"""
    if not education_requirements['has_requirement']:
        return {
            'match': True,
            'confidence': 'high',
            'message': 'No specific education requirement found in job description'
        }
    
    required_level = education_requirements['level']
    
    # Education level hierarchy for comparison
    education_hierarchy = {
        'phd': 5,
        'masters': 4,
        'bachelors': 3,
        'associates': 2,
        'certificate': 1,
        'high school': 0
    }
    
    required_value = education_hierarchy.get(required_level, 0)
    
    # Check education entities for matches
    education_keywords = {
        'phd': ['phd', 'doctorate', 'doctoral'],
        'masters': ['master', 'ms', 'ma', 'msc', 'mba'],
        'bachelors': ['bachelor', 'bs', 'ba', 'bsc', 'undergraduate'],
        'associates': ['associate', 'as', 'aa'],
        'certificate': ['certificate', 'certification', 'diploma'],
        'high school': ['high school', 'hs', 'ged']
    }
    
    # Find the highest education level in the resume
    highest_level = 'none'
    highest_value = -1
    
    for entity in education_entities:
        entity_lower = entity.lower()
        for level, keywords in education_keywords.items():
            if any(keyword in entity_lower for keyword in keywords):
                level_value = education_hierarchy.get(level, 0)
                if level_value > highest_value:
                    highest_level = level
                    highest_value = level_value
    
    # Compare resume education with requirements
    if highest_value >= required_value:
        return {
            'match': True,
            'confidence': 'high',
            'message': f'Resume indicates {highest_level.capitalize()} level education, meeting the {required_level.capitalize()} requirement'
        }
    elif highest_value > 0:
        return {
            'match': False,
            'confidence': 'medium',
            'message': f'Resume indicates {highest_level.capitalize()} level education, which is below the required {required_level.capitalize()} level'
        }
    else:
        return {
            'match': False,
            'confidence': 'low',
            'message': f'Could not determine education level from resume. Job requires {required_level.capitalize()} level'
        }

def generate_personalized_suggestions(matched_keywords, missing_keywords, resume_text, job_description, resume_entities, job_entities, experience_req, education_req):
    """Generate personalized suggestions based on comprehensive analysis"""
    suggestions = []
    
    # Suggestion 1: Missing keywords
    if missing_keywords:
        if len(missing_keywords) > 5:
            suggestions.append(f"Add these critical keywords to your resume: {', '.join(missing_keywords[:5])} and {len(missing_keywords) - 5} more.")
        else:
            suggestions.append(f"Add these critical keywords to your resume: {', '.join(missing_keywords)}.")
    
    # Suggestion 2: Experience match
    if experience_req['has_requirement']:
        exp_check = check_experience_match(resume_text, experience_req)
        if not exp_check['match']:
            suggestions.append(f"Highlight your experience more clearly. This job requires {experience_req['years']}+ years of experience.")
    
    # Suggestion 3: Education match
    if education_req['has_requirement']:
        edu_check = check_education_match(resume_entities.get('education', []), education_req)
        if not edu_check['match']:
            suggestions.append(f"Ensure your education section clearly shows your {education_req['level'].capitalize()} degree.")
    
    # Suggestion 4: Skills section
    if len(missing_keywords) > 0:
        suggestions.append("Create a dedicated 'Skills' section that highlights your technical and soft skills using keywords from the job description.")
    
    # Suggestion 5: Quantifiable achievements
    if "achiev" not in resume_text.lower() and "accomplish" not in resume_text.lower():
        suggestions.append("Add quantifiable achievements to demonstrate the impact of your work (e.g., 'increased efficiency by 20%').")
    
    # Suggestion 6: Action verbs
    action_verbs = ["implemented", "developed", "managed", "created", "designed", "coordinated", "analyzed", "resolved"]
    if not any(verb in resume_text.lower() for verb in action_verbs):
        suggestions.append("Use strong action verbs at the beginning of your bullet points (e.g., 'Implemented', 'Developed', 'Managed').")
    
    # Suggestion 7: Missing sections check
    missing_sections = identify_missing_sections(resume_text)
    if missing_sections:
        suggestions.append(f"Add these important sections to your resume: {', '.join(missing_sections)}.")
    
    # Suggestion 8: ATS optimization
    suggestions.append("Ensure your resume is ATS-friendly by using a clean format with standard section headings and avoiding tables or graphics.")
    
    # Additional suggestions if we have fewer than 5
    if len(suggestions) < 5:
        suggestions.append("Tailor your resume for each job application by customizing it to match the specific requirements in the job description.")
        
    if len(suggestions) < 5:
        suggestions.append("Keep your resume concise and focused, ideally fitting on 1-2 pages depending on your experience level.")
    
    return suggestions

def identify_missing_sections(resume_text):
    """Identify important sections that might be missing from the resume"""
    # Define important sections to check for
    important_sections = [
        "education", 
        "experience", 
        "work experience", 
        "professional experience",
        "skills", 
        "technical skills",
        "projects",
        "certifications", 
        "achievements"
    ]
    
    # Check which sections are missing
    missing_sections = []
    for section in important_sections:
        # Check for section headers (common formatting)
        patterns = [
            r'\b' + re.escape(section) + r'\b\s*:',  # "Education:" format
            r'\b' + re.escape(section) + r'\b\s*$',  # "Education" at end of line
            r'^\s*\b' + re.escape(section) + r'\b',  # "Education" at start of line
            r'[^a-zA-Z]' + re.escape(section) + r'[^a-zA-Z]'  # Section surrounded by non-letters
        ]
        
        if not any(re.search(pattern, resume_text, re.IGNORECASE | re.MULTILINE) for pattern in patterns):
            # For simplicity, group related sections
            if section in ["experience", "work experience", "professional experience"]:
                if "experience" not in missing_sections:
                    missing_sections.append("Experience")
            elif section in ["skills", "technical skills"]:
                if "Skills" not in missing_sections:
                    missing_sections.append("Skills")
            else:
                missing_sections.append(section.capitalize())
    
    # Remove duplicates due to grouping
    missing_sections = list(set(missing_sections))
    
    return missing_sections
