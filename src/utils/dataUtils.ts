import { read, utils } from 'xlsx';
import { ParsedData, Trade } from '../types';

export const parseExcelFile = async (file: File, initialInvestment: number): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = utils.sheet_to_json(worksheet);
        
        if (jsonData.length === 0) {
          throw new Error('No data found in Excel file');
        }
        
        // Check if the required columns exist
        const firstRow = jsonData[0] as Record<string, any>;
        const requiredColumns = ['SYMBOL', 'DateTime', 'value'];
        for (const column of requiredColumns) {
          if (!Object.keys(firstRow).some(key => key === column)) {
            throw new Error(`Required column '${column}' not found in Excel file`);
          }
        }
        
        // Filter out rows without SYMBOL values and map data to our format
        const trades: Trade[] = jsonData
          .filter((row: Record<string, any>) => row['SYMBOL'] && String(row['SYMBOL']).trim() !== '')
          .map((row: Record<string, any>, index: number) => {
            // Parse the date from M/D/YY H:MM AM/PM format
            const dateStr = String(row['DateTime'] || '');
            
            // Split into date and time parts, handling potential missing data
            const [datePart = '', timePart = ''] = dateStr.split(' ');
            if (!datePart || !timePart) {
              throw new Error(`Invalid date format in row ${index + 1}. Expected format: M/D/YY H:MM AM/PM`);
            }

            // Parse date components
            const [month, day, shortYear] = datePart.split('/');
            const fullYear = '20' + shortYear; // Assuming years are in the 2000s

            // Parse time components
            const [time = '', period = ''] = timePart.split(' ');
            const [hours = '', minutes = ''] = time.split(':');

            // Convert to 24-hour format if PM
            let hour = parseInt(hours);
            if (!isNaN(hour)) {
              const upperPeriod = period.toUpperCase();
              if (upperPeriod === 'PM' && hour !== 12) {
                hour += 12;
              } else if (upperPeriod === 'AM' && hour === 12) {
                hour = 0;
              }
            } else {
              throw new Error(`Invalid hour format in row ${index + 1}`);
            }

            const date = new Date(
              parseInt(fullYear),
              parseInt(month) - 1, // Month is 0-based
              parseInt(day),
              hour,
              parseInt(minutes)
            );
            
            if (isNaN(date.getTime())) {
              throw new Error(`Invalid date format in row ${index + 1}. Expected format: M/D/YY H:MM AM/PM`);
            }
            
            return {
              id: index + 1,
              symbol: String(row['SYMBOL']),
              date: date.toISOString(),
              value: Number(row['value']),
              accumulatedValue: 0, // Will be calculated below
            };
          });

        if (trades.length === 0) {
          throw new Error('No valid trades found after filtering empty symbols');
        }
        
        // Sort trades by date
        trades.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        // Calculate accumulated value starting from initial investment
        let accumulatedValue = initialInvestment;
        trades.forEach(trade => {
          accumulatedValue += trade.value;
          trade.accumulatedValue = accumulatedValue;
        });
        
        // Create chart data with initial investment point
        const firstTradeDate = trades[0]?.date || new Date().toISOString();
        const chartData = [
          {
            date: new Date(firstTradeDate),
            value: initialInvestment,
            accumulatedValue: initialInvestment,
            symbol: 'INITIAL',
            id: 0,
            isInitialInvestment: true
          },
          ...trades.map(trade => ({
            date: trade.date,
            value: trade.value,
            accumulatedValue: trade.accumulatedValue,
            symbol: trade.symbol,
            id: trade.id,
            isInitialInvestment: false
          }))
        ];
        
        resolve({ trades, chartData, initialInvestment });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const saveDataToLocalStorage = (data: ParsedData) => {
  localStorage.setItem('tradingData', JSON.stringify(data));
};

export const getDataFromLocalStorage = (): ParsedData | null => {
  const data = localStorage.getItem('tradingData');
  return data ? JSON.parse(data) : null;
};