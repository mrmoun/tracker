export interface Trade {
  id: number;
  symbol: string;
  date: string;
  value: number;
  accumulatedValue: number;
}

export interface ParsedData {
  trades: Trade[];
  chartData: {
    date: string;
    value: number;
    accumulatedValue: number;
    symbol: string;
    id: number;
    isInitialInvestment?: boolean;
  }[];
  initialInvestment: number;
}