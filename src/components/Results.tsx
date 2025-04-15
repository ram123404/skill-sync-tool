
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertTriangle, ArrowUpCircle, BookOpen, Briefcase, Gauge } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

export interface ResultsData {
  matched_keywords: string[];
  missing_keywords: string[];
  suggestions: string[];
  match_score?: number;
  missing_sections?: string[];
  experience_match?: {
    match: boolean;
    confidence: 'high' | 'medium' | 'low';
    message: string;
  };
  education_match?: {
    match: boolean;
    confidence: 'high' | 'medium' | 'low';
    message: string;
  };
  loading?: boolean;
  error?: string;
}

interface ResultsProps {
  data: ResultsData | null;
}

const Results: React.FC<ResultsProps> = ({ data }) => {
  if (!data) return null;
  
  if (data.error) {
    return (
      <Card className="border-destructive/30 bg-destructive/5 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Error
          </CardTitle>
          <CardDescription>
            Something went wrong while analyzing your resume.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive/90">{data.error}</p>
        </CardContent>
      </Card>
    );
  }

  if (data.loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <Card>
          <CardHeader>
            <div className="h-7 w-48 bg-muted rounded animate-pulse-slow"></div>
            <div className="h-4 w-32 bg-muted rounded animate-pulse-slow"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-6 w-20 bg-muted rounded animate-pulse-slow"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-7 w-56 bg-muted rounded animate-pulse-slow"></div>
            <div className="h-4 w-36 bg-muted rounded animate-pulse-slow"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 w-24 bg-muted rounded animate-pulse-slow"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Helper function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  // Helper function to get progress bar color based on score
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-success';
    if (score >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  // Helper function to get badge color based on match status
  const getMatchBadgeColor = (match: boolean) => {
    return match 
      ? "bg-success/20 text-success-foreground border-success/40 hover:bg-success/30" 
      : "bg-destructive/20 text-destructive-foreground border-destructive/40 hover:bg-destructive/30";
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Match Score Card */}
      {typeof data.match_score !== 'undefined' && (
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/50 pb-2">
            <CardTitle className="flex items-center">
              <Gauge className="mr-2 h-5 w-5 text-primary" />
              Resume Match Score
            </CardTitle>
            <CardDescription>
              How well your resume matches this job description
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-muted">
                <span className={`text-4xl font-bold ${getScoreColor(data.match_score)}`}>
                  {data.match_score}%
                </span>
              </div>
            </div>
            <Progress 
              value={data.match_score} 
              className="h-2 w-full mb-2" 
              indicatorClassName={getProgressColor(data.match_score)} 
            />
            <p className="text-center text-sm mt-2 text-muted-foreground">
              {data.match_score >= 80 ? (
                "Excellent match! Your resume is well-aligned with this job."
              ) : data.match_score >= 60 ? (
                "Good match! With a few improvements, your resume could stand out more."
              ) : (
                "Your resume needs significant improvements to match this job better."
              )}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Requirements Match Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Experience Match */}
        {data.experience_match && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Briefcase className="mr-2 h-5 w-5" />
                Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Badge 
                  variant="outline" 
                  className={`self-start ${getMatchBadgeColor(data.experience_match.match)}`}
                >
                  {data.experience_match.match ? "Meets Requirements" : "Does Not Meet Requirements"}
                </Badge>
                <p className="text-sm mt-2">{data.experience_match.message}</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Education Match */}
        {data.education_match && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <BookOpen className="mr-2 h-5 w-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Badge 
                  variant="outline" 
                  className={`self-start ${getMatchBadgeColor(data.education_match.match)}`}
                >
                  {data.education_match.match ? "Meets Requirements" : "Does Not Meet Requirements"}
                </Badge>
                <p className="text-sm mt-2">{data.education_match.message}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Matched Keywords */}
      <Card className="border-success/30 bg-success/5">
        <CardHeader>
          <CardTitle className="flex items-center text-success">
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Matched Keywords
          </CardTitle>
          <CardDescription>
            Great job! Your resume already includes these important keywords.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.matched_keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.matched_keywords.map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-success/20 text-success-foreground border-success/40 font-medium px-3 py-1 rounded-full hover:bg-success/30 transition-colors"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No matching keywords found. Try optimizing your resume.</p>
          )}
        </CardContent>
      </Card>

      {/* Missing Keywords */}
      <Card className="border-warning/30 bg-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center text-warning">
            <XCircle className="mr-2 h-5 w-5" />
            Missing Keywords
          </CardTitle>
          <CardDescription>
            Consider adding these keywords to improve your resume's match rate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.missing_keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.missing_keywords.map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-warning/20 text-warning-foreground border-warning/40 font-medium px-3 py-1 rounded-full hover:bg-warning/30 transition-colors"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Impressive! Your resume includes all important keywords.</p>
          )}
        </CardContent>
      </Card>

      {/* Missing Sections Card */}
      {data.missing_sections && data.missing_sections.length > 0 && (
        <Card className="border-warning/30 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center text-warning">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Missing Sections
            </CardTitle>
            <CardDescription>
              Your resume should include these important sections.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.missing_sections.map((section, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-warning/20 text-warning-foreground border-warning/40 font-medium px-3 py-1 rounded-full hover:bg-warning/30 transition-colors"
                >
                  {section}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggestions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ArrowUpCircle className="mr-2 h-5 w-5 text-primary" />
            Optimization Suggestions
          </CardTitle>
          <CardDescription>
            Here's how you can improve your resume for this job.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.suggestions.length > 0 ? (
            <ul className="space-y-3">
              {data.suggestions.map((suggestion, index) => (
                <li 
                  key={index} 
                  className="flex items-start p-3 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors"
                >
                  <span className="text-primary mr-3 mt-1">•</span>
                  <span className="flex-1">{suggestion}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">No specific suggestions at this time. Your resume appears well-optimized for this job!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
