import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, BarChart3, Table } from 'lucide-react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import TradeChart from './components/TradeChart';
import TradeDetails from './components/TradeDetails';
import EmptyState from './components/EmptyState';
import { ParsedData, Trade } from './types';
import { saveDataToLocalStorage, getDataFromLocalStorage } from './utils/dataUtils';

function App() {
  const [data, setData] = useState<ParsedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [showTradeDetails, setShowTradeDetails] = useState(false);

  useEffect(() => {
    // Load data from localStorage on component mount
    const savedData = getDataFromLocalStorage();
    if (savedData) {
      setData(savedData);
    }
  }, []);

  const handleDataParsed = (parsedData: ParsedData) => {
    setData(parsedData);
    saveDataToLocalStorage(parsedData);
  };

  const handlePointClick = (trade: Trade) => {
    setSelectedTrade(trade);
    setShowTradeDetails(true);
  };

  const handleCloseTradeDetails = () => {
    setShowTradeDetails(false);
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all data?")) {
      setData(null);
      localStorage.removeItem('tradingData');
    }
  };

  const handleShowAllTrades = () => {
    setSelectedTrade(null);
    setShowTradeDetails(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {data ? (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <BarChart3 size={24} className="text-blue-800 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">Trading Performance</h2>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleShowAllTrades}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100 transition-colors flex items-center"
                  >
                    <Table size={16} className="mr-2" />
                    View All Trades
                  </button>
                  <button
                    onClick={handleClearData}
                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-sm hover:bg-red-100 transition-colors"
                  >
                    Clear Data
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Total Trades:</span> {data.trades.length}
                </p>
                <p className={`text-lg font-semibold ${
                  data.trades[data.trades.length - 1].accumulatedValue >= 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  Total Performance: {
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(data.trades[data.trades.length - 1].accumulatedValue)
                  }
                </p>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-2">
                  Click on any point in the chart to see detailed trade information
                </p>
                <TradeChart 
                  data={data.chartData} 
                  onPointClick={handlePointClick} 
                />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <FileSpreadsheet size={24} className="text-blue-800 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Upload New Data</h2>
              </div>
              <FileUpload 
                onDataParsed={handleDataParsed} 
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <EmptyState />
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <FileSpreadsheet size={24} className="text-blue-800 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Upload Trading Data</h2>
              </div>
              <FileUpload 
                onDataParsed={handleDataParsed} 
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          </div>
        )}
      </main>
      
      {showTradeDetails && data && (
        <TradeDetails 
          trades={data.trades}
          selectedTrade={selectedTrade}
          onClose={handleCloseTradeDetails}
        />
      )}
      
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          TradeTracker © {new Date().getFullYear()} - Track and analyze your trading performance
        </div>
      </footer>
    </div>
  );
}

export default App;