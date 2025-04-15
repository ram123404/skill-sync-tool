
import React, { useState, useRef, useCallback } from 'react';
import { FileUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const droppedFile = files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        onFileChange(droppedFile);
      } else {
        alert('Please upload a PDF file');
      }
    }
  }, [onFileChange]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        onFileChange(selectedFile);
      } else {
        alert('Please upload a PDF file');
      }
    }
  }, [onFileChange]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const removeFile = useCallback(() => {
    setFile(null);
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileChange]);

  return (
    <div
      className={cn(
        "file-drop-zone flex flex-col items-center justify-center cursor-pointer",
        isDragging && "active"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        className="hidden"
        accept=".pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      {!file ? (
        <>
          <FileUp className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">Upload your resume</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop your PDF file here, or click to browse
          </p>
          <Button variant="outline" className="mt-2">
            Select PDF file
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center p-3 px-5 bg-secondary rounded-lg">
            <div className="flex-1">
              <p className="font-medium truncate max-w-[200px] sm:max-w-[300px]">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-2 text-muted-foreground hover:text-destructive" 
              onClick={removeFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-primary mt-4">Resume uploaded successfully!</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
