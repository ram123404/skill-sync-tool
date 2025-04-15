
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import JobDescription from '@/components/JobDescription';
import Results, { ResultsData } from '@/components/Results';

const Index = () => {
  const { toast } = useToast();
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ResultsData | null>(null);

  const handleFileChange = (file: File | null) => {
    setResume(file);
    // Reset results when a new file is uploaded
    setResults(null);
  };

  const handleDescriptionChange = (description: string) => {
    setJobDescription(description);
    // Reset results when description changes
    setResults(null);
  };

  const validateInputs = () => {
    if (!resume) {
      toast({
        title: "Resume Required",
        description: "Please upload your resume PDF first.",
        variant: "destructive",
      });
      return false;
    }

    if (!jobDescription.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please enter or paste the job description.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleAnalyze = async () => {
    if (!validateInputs()) return;

    setIsAnalyzing(true);
    setResults({ matched_keywords: [], missing_keywords: [], suggestions: [], loading: true });

    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('results-section');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);

    // This is a mock API call that would be replaced with a real backend call
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Mock response data for frontend testing
      const mockResults: ResultsData = {
        matched_keywords: [
          "React.js", "JavaScript", "HTML", "CSS", "Responsive design", 
          "Frontend", "UI", "Optimization"
        ],
        missing_keywords: [
          "Tailwind CSS", "Redux", "RESTful APIs", "Context API", "Build pipelines"
        ],
        suggestions: [
          "Highlight your experience with responsive design and CSS frameworks like Tailwind.",
          "Include specific examples of React.js projects you've worked on.",
          "Mention your experience with state management like Redux or Context API.",
          "Add details about working with RESTful APIs in your projects.",
          "Showcase your knowledge of modern frontend build pipelines."
        ]
      };
      
      // Set the results
      setResults(mockResults);
      
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed successfully!",
      });
    } catch (error) {
      setResults({
        matched_keywords: [],
        missing_keywords: [],
        suggestions: [],
        error: "Failed to analyze your resume. Please try again later."
      });
      
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your resume.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <section className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Optimize Your Resume for Job Success
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your resume and job description to get instant suggestions for improving your match rate.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">1. Upload Your Resume</h2>
              <FileUpload onFileChange={handleFileChange} />
              <div className="mt-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p>Only PDF files are supported.</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">2. Enter Job Description</h2>
              <JobDescription onDescriptionChange={handleDescriptionChange} />
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <Button 
              size="lg" 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resume || !jobDescription.trim()}
              className="gap-2"
            >
              <Sparkles className="h-5 w-5" />
              {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              All processing is done locally - your data stays private.
            </p>
          </div>
        </section>
        
        {results && (
          <section id="results-section" className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-center">Analysis Results</h2>
              <p className="text-center text-muted-foreground mt-2">
                Here's how your resume matches the job description
              </p>
            </div>
            <Results data={results} />
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
