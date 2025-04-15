
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

interface JobDescriptionProps {
  onDescriptionChange: (description: string) => void;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ onDescriptionChange }) => {
  const [description, setDescription] = useState('');
  const [showExample, setShowExample] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    onDescriptionChange(e.target.value);
  };

  const exampleDescription = `Job Title: Frontend Developer

Responsibilities:
- Develop and maintain responsive web applications using React.js
- Collaborate with UI/UX designers to implement intuitive interfaces
- Write clean, efficient, and maintainable code
- Optimize applications for maximum speed and scalability
- Troubleshoot and debug issues in frontend applications

Requirements:
- 2+ years of experience with React.js
- Strong proficiency in JavaScript, HTML, and CSS
- Experience with responsive design and CSS frameworks like Tailwind
- Familiarity with RESTful APIs and modern frontend build pipelines
- Knowledge of state management solutions (Redux, Context API)
- Bachelor's degree in Computer Science or related field preferred`;

  const useExample = () => {
    setDescription(exampleDescription);
    onDescriptionChange(exampleDescription);
    setShowExample(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="jobDescription" className="text-base font-medium">
          Job Description
        </Label>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center text-xs gap-1 h-7 px-2"
          onClick={() => setShowExample(!showExample)}
        >
          <Lightbulb className="h-3.5 w-3.5" />
          <span>{showExample ? 'Hide' : 'Show'} Example</span>
        </Button>
      </div>
      
      {showExample && (
        <div className="bg-accent/50 p-3 rounded-md text-sm relative">
          <pre className="whitespace-pre-wrap font-sans text-xs text-muted-foreground">
            {exampleDescription}
          </pre>
          <div className="flex justify-end mt-2">
            <Button size="sm" variant="outline" onClick={useExample}>
              Use This Example
            </Button>
          </div>
        </div>
      )}
      
      <Textarea
        id="jobDescription"
        value={description}
        onChange={handleChange}
        placeholder="Paste the job description here..."
        className="min-h-[200px] resize-y"
      />
    </div>
  );
};

export default JobDescription;
