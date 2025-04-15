
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertTriangle, ArrowUpCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export interface ResultsData {
  matched_keywords: string[];
  missing_keywords: string[];
  suggestions: string[];
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

  return (
    <div className="space-y-4 animate-fade-in">
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
