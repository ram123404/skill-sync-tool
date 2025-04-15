
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Sparkles, Zap, Lightbulb, CheckCircle, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-12">
        <section className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              About ResumeSync
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our mission is to help job seekers optimize their resumes and land their dream jobs.
            </p>
          </div>
          
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                ResumeSync was born from a simple observation: many qualified candidates were being filtered out by Applicant Tracking Systems (ATS) simply because their resumes weren't optimized for keyword matching.
              </p>
              <p className="text-muted-foreground">
                We built this tool to level the playing field, making it easier for job seekers to tailor their resumes to specific job descriptions without needing to be experts in ATS algorithms or keyword optimization.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-6">Our Values</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-4 flex justify-center">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-center mb-2">Accessibility</h3>
                    <p className="text-sm text-center text-muted-foreground">
                      We believe career tools should be accessible to everyone, regardless of their background.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-4 flex justify-center">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Lock className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-center mb-2">Privacy</h3>
                    <p className="text-sm text-center text-muted-foreground">
                      Your data stays on your device. We don't store your resumes or job descriptions.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-4 flex justify-center">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Lightbulb className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-center mb-2">Innovation</h3>
                    <p className="text-sm text-center text-muted-foreground">
                      We continuously improve our algorithms to provide the most accurate recommendations.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
              <p className="text-muted-foreground mb-4">
                ResumeSync uses Natural Language Processing (NLP) techniques to analyze your resume against job descriptions. The tool identifies matching keywords, highlights missing important terms, and provides actionable suggestions to improve your resume's compatibility with the job you're applying for.
              </p>
              <p className="text-muted-foreground">
                Unlike other tools, we process everything locally on your device - meaning your sensitive personal information never leaves your computer.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
