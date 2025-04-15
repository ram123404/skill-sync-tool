
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileUp, FileText, Sparkles, ArrowRight, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-12">
        <section className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              How ResumeSync Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Optimize your resume in three simple steps
            </p>
          </div>
          
          <div className="grid gap-12 mb-16">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3 flex justify-center">
                <div className="p-6 bg-primary/10 rounded-full">
                  <FileUp className="h-12 w-12 text-primary" />
                </div>
              </div>
              <div className="md:w-2/3">
                <h2 className="text-2xl font-semibold mb-4">1. Upload Your Resume</h2>
                <p className="text-muted-foreground mb-4">
                  Start by uploading your current resume in PDF format. Our tool will scan it to identify the skills, experiences, and keywords it contains.
                </p>
                <p className="text-sm text-muted-foreground">
                  Supported format: PDF only
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <ChevronDown className="h-8 w-8 text-muted-foreground" />
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3 flex justify-center md:order-last">
                <div className="p-6 bg-primary/10 rounded-full">
                  <FileText className="h-12 w-12 text-primary" />
                </div>
              </div>
              <div className="md:w-2/3">
                <h2 className="text-2xl font-semibold mb-4">2. Enter Job Description</h2>
                <p className="text-muted-foreground mb-4">
                  Copy and paste the job description you're interested in. The more detailed the job listing, the better our analysis will be.
                </p>
                <p className="text-sm text-muted-foreground">
                  Tip: Include the full job description with requirements and responsibilities.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <ChevronDown className="h-8 w-8 text-muted-foreground" />
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3 flex justify-center">
                <div className="p-6 bg-primary/10 rounded-full">
                  <Sparkles className="h-12 w-12 text-primary" />
                </div>
              </div>
              <div className="md:w-2/3">
                <h2 className="text-2xl font-semibold mb-4">3. Get Personalized Insights</h2>
                <p className="text-muted-foreground mb-4">
                  Our algorithm will analyze both documents and provide you with:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
                  <li>Keywords you've already included in your resume</li>
                  <li>Important keywords missing from your resume</li>
                  <li>Specific suggestions to improve your resume's match rate</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  All processing happens on your device - your data never leaves your computer.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted p-8 rounded-lg mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-center">Ready to optimize your resume?</h2>
            <div className="flex justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is my data secure?</AccordionTrigger>
                <AccordionContent>
                  Yes, all processing happens locally on your device. Your resume and job descriptions are never sent to our servers or stored in any database.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>How accurate is the analysis?</AccordionTrigger>
                <AccordionContent>
                  Our tool uses advanced NLP techniques to identify relevant keywords and provide meaningful suggestions. While no tool can guarantee a perfect match, ResumeSync significantly improves your resume's compatibility with ATS systems.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I use this for any industry?</AccordionTrigger>
                <AccordionContent>
                  Yes! ResumeSync works for any industry or job type. The tool analyzes the specific job description you provide, so the recommendations are always tailored to the position you're applying for.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>Do I need to create an account?</AccordionTrigger>
                <AccordionContent>
                  No, ResumeSync doesn't require you to create an account or provide any personal information. Simply upload your resume, paste the job description, and get your results instantly.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>Is there a limit to how many resumes I can optimize?</AccordionTrigger>
                <AccordionContent>
                  No limits! You can use ResumeSync as many times as you need, for as many different job applications as you want.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
