import React from 'react';
import { FileSpreadsheet, ArrowDown } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 mt-8">
      <div className="bg-blue-50 rounded-full p-4 mb-4">
        <FileSpreadsheet size={48} className="text-blue-800" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">No Trading Data Uploaded</h2>
      <p className="text-gray-600 text-center max-w-md mb-4">
        Upload an Excel file containing your trading data to visualize your performance and analyze trades.
      </p>
      <div className="text-blue-700 flex items-center animate-bounce">
        <ArrowDown size={20} className="mr-1" />
        <span>Upload Below</span>
      </div>
    </div>
  );
};

export default EmptyState;