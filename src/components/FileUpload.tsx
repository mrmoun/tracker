import React, { useState, useRef } from 'react';
import { Upload, FileUp, AlertCircle } from 'lucide-react';
import { parseExcelFile } from '../utils/dataUtils';
import { ParsedData } from '../types';

interface FileUploadProps {
  onDataParsed: (data: ParsedData) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  initialInvestment: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onDataParsed, 
  isLoading, 
  setIsLoading,
  initialInvestment 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        throw new Error('Please upload an Excel file (.xlsx or .xls)');
      }
      
      const data = await parseExcelFile(file, initialInvestment);
      onDataParsed(data);
    } catch (err) {
      setError((err as Error).message || 'Error processing file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-8 ${
          dragActive ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
        } transition-colors duration-200 flex flex-col items-center justify-center cursor-pointer`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleChange}
          className="hidden"
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin mb-3">
              <Upload size={36} className="text-blue-600" />
            </div>
            <p className="text-gray-600">Processing file...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <FileUp 
              size={36} 
              className={`${dragActive ? 'text-blue-600' : 'text-gray-400'} mb-3 transition-colors duration-200`} 
            />
            <p className="text-gray-600 mb-2 text-center">
              Drag and drop your Excel file here, or click to browse
            </p>
            <p className="text-gray-500 text-sm text-center">
              Your file should contain SYMBOL, M/D/YY, H:MM AM/PM, and value columns
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
          <AlertCircle size={18} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;