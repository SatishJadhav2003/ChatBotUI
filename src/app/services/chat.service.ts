import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ChatRequest {
  query: string;
}

export interface ChartData {
  render_mode: 'frontend' | 'backend';
  chart_type?: string;
  chart_image?: string; // base64 encoded image for backend mode
  chart_config?: {
    labels?: string[];
    datasets?: ChartDataset[];
    options?: any;
    // Backend chart specific properties
    image_data?: string;
    alt_text?: string;
    title?: string;
  };
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number; // For line charts
  yAxisID?: string; // For dual y-axis charts
}

export interface ChatResponse {
  status: string;
  message: string | null;
  sql_query: string;
  insight: string;
  data: any[];
  chart_data?: ChartData;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  response?: ChatResponse;
  isLoading?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getApiUrl(): string {
    return this.apiUrl;
  }

  sendMessage(query: string): Observable<ChatResponse> {
    const payload: ChatRequest = { query };
    
    return this.http.post<any>(`${this.apiUrl}`, {query})
      .pipe(
        map(response => this.parseApiResponse(response)),
        catchError(this.handleError)
      );
  }

  private parseApiResponse(response: any): ChatResponse {
    const parsedResponse: ChatResponse = {
      status: response.status || 'unknown',
      message: response.message || null,
      sql_query: response.sql_query || '',
      insight: response.insight || '',
      data: response.data || [],
      chart_data: undefined
    };

    // Handle chart_data parsing if present
    if (response.chart_data) {
      let chartData: ChartData | null = null;

      if (typeof response.chart_data === 'string') {
        // Try standard JSON parsing first
        try {
          chartData = JSON.parse(response.chart_data);
        } catch (parseError) {
          // If standard parsing fails, try to fix malformed JSON
          try {
            const fixedJson = this.fixMalformedJson(response.chart_data);
            chartData = JSON.parse(fixedJson);
          } catch (fixError) {
            // If JSON fixing also fails, try to reconstruct from raw data
            chartData = this.reconstructChartFromApiData(response);
            if (!chartData) {
              console.warn('Failed to parse chart_data:', response.chart_data);
            }
          }
        }
      } else if (typeof response.chart_data === 'object') {
        // chart_data is already an object
        chartData = response.chart_data;
      }

      // Validate and set chart data
      if (chartData && this.isValidChartData(chartData)) {
        // Normalize property names for Chart.js compatibility
        parsedResponse.chart_data = this.normalizeChartDataProperties(chartData);
      } else if (chartData) {
        console.warn('chart_data does not match expected structure:', chartData);
        delete parsedResponse.chart_data;
      }
    }

    // Ensure data is parsed if it's a string (some APIs might return it as a string)
    if (response.data && typeof response.data === 'string') {
      try {
        parsedResponse.data = JSON.parse(response.data);
      } catch (error) {
        console.warn('Failed to parse data JSON string:', error);
        // Keep original data if parsing fails
        parsedResponse.data = response.data;
      }
    }

    // Ensure data is an array
    if (!Array.isArray(parsedResponse.data)) {
      parsedResponse.data = [];
    }

    return parsedResponse;
  }
  private isValidChartData(data: any): boolean {
    // Basic validation for ChartData structure
    if (!data || typeof data !== 'object') {
      return false;
    }

    // Check for required render_mode
    if (!data.render_mode || (data.render_mode !== 'frontend' && data.render_mode !== 'backend')) {
      return false;
    }    // Validate frontend chart structure
    if (data.render_mode === 'frontend') {
      const validChartTypes = ['pie', 'line', 'bar', 'stacked_bar', 'donut', 'doughnut', 'area'];
      
      if (!data.chart_type || !validChartTypes.includes(data.chart_type)) {
        return false;
      }

      // Should have chart_config for frontend charts
      if (!data.chart_config) {
        return false;
      }
    }

    // Validate backend chart structure
    if (data.render_mode === 'backend') {
      if (!data.chart_config || !data.chart_config.image_data) {
        return false;
      }
    }

    return true;
  }

  private normalizeChartDataProperties(data: ChartData): ChartData {
    // Create a deep copy to avoid mutating the original
    const normalized = JSON.parse(JSON.stringify(data));

    // For frontend charts, normalize the dataset properties
    if (normalized.render_mode === 'frontend' && normalized.chart_config && normalized.chart_config.datasets) {
      normalized.chart_config.datasets = normalized.chart_config.datasets.map((dataset: any) => {
        // Normalize property names from API format to Chart.js format
        const normalizedDataset = { ...dataset };
        
        // Map backgroundcolor -> backgroundColor
        if (dataset.backgroundcolor) {
          normalizedDataset.backgroundColor = dataset.backgroundcolor;
          delete normalizedDataset.backgroundcolor;
        }
        
        // Map bordercolor -> borderColor
        if (dataset.bordercolor) {
          normalizedDataset.borderColor = dataset.bordercolor;
          delete normalizedDataset.bordercolor;
        }
        
        // Map borderwidth -> borderWidth
        if (dataset.borderwidth) {
          normalizedDataset.borderWidth = dataset.borderwidth;
          delete normalizedDataset.borderwidth;
        }
        
        // Map pointbackgroundcolor -> pointBackgroundColor
        if (dataset.pointbackgroundcolor) {
          normalizedDataset.pointBackgroundColor = dataset.pointbackgroundcolor;
          delete normalizedDataset.pointbackgroundcolor;
        }
        
        // Map pointbordercolor -> pointBorderColor
        if (dataset.pointbordercolor) {
          normalizedDataset.pointBorderColor = dataset.pointbordercolor;
          delete normalizedDataset.pointbordercolor;
        }
        
        // Map pointborderwidth -> pointBorderWidth
        if (dataset.pointborderwidth) {
          normalizedDataset.pointBorderWidth = dataset.pointborderwidth;
          delete normalizedDataset.pointborderwidth;
        }
        
        return normalizedDataset;
      });
    }

    return normalized;
  }

  private fixMalformedJson(malformedJson: string): string {
    // Remove newlines and normalize whitespace - crucial for API format
    let fixed = malformedJson
      .replace(/\n/g, ' ')           // Replace newlines with spaces
      .replace(/\r/g, ' ')           // Replace carriage returns
      .replace(/\t/g, ' ')           // Replace tabs
      .replace(/\s+/g, ' ')          // Replace multiple spaces with single space
      .trim();
    
    // Fix unquoted property names - more comprehensive pattern matching
    // Handle patterns: word: or word : (with optional space before colon)
    fixed = fixed.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
    
    // Fix single quotes to double quotes for string values
    // Handle simple string values: 'value' -> "value"
    fixed = fixed.replace(/:\s*'([^']*?)'/g, ': "$1"');
    
    // Handle array elements with single quotes - more comprehensive
    // Pattern: ['item1', 'item2', 'item3'] 
    fixed = fixed.replace(/\[([^\]]*)\]/g, (match, content) => {
      // Only process if content contains single quotes
      if (content.includes("'")) {
        // Replace single quotes with double quotes within array content
        const fixedContent = content.replace(/'/g, '"');
        return `[${fixedContent}]`;
      }
      return match; // Return unchanged if no single quotes
    });
    
    // Handle truncated data arrays
    const truncatedPatterns = [
      /,\s*(\d+\.)\s*$/,                    // ends with ", 31302."
      /,\s*(\d+)\s*$/,                      // ends with ", 31302"
      /,\s*(\d+\.\d*)\s*$/,                 // ends with ", 31302.80"
    ];
    
    let wasTruncated = false;
    for (const pattern of truncatedPatterns) {
      if (pattern.test(fixed)) {
        fixed = fixed.replace(pattern, '');
        fixed = fixed.replace(/,\s*$/, '');
        fixed = fixed.trim();
        wasTruncated = true;
        break;
      }
    }
    
    // If we found truncation, ensure proper closure
    if (wasTruncated) {
      const openBrackets = (fixed.match(/\[/g) || []).length;
      const closeBrackets = (fixed.match(/\]/g) || []).length;
      const openBraces = (fixed.match(/\{/g) || []).length;
      const closeBraces = (fixed.match(/\}/g) || []).length;
      
      // Close missing brackets/braces
      for (let i = 0; i < (openBrackets - closeBrackets); i++) {
        fixed += ']';
      }
      for (let i = 0; i < (openBraces - closeBraces); i++) {
        fixed += '}';
      }
    }
    
    // Clean up trailing commas and empty elements
    fixed = fixed.replace(/,(\s*[\]}])/g, '$1');   // Remove trailing commas
    fixed = fixed.replace(/,\s*,/g, ',');          // Remove double commas
    
    // Final bracket/brace balancing check
    const finalOpenBrackets = (fixed.match(/\[/g) || []).length;
    const finalCloseBrackets = (fixed.match(/\]/g) || []).length;
    const finalOpenBraces = (fixed.match(/\{/g) || []).length;
    const finalCloseBraces = (fixed.match(/\}/g) || []).length;
    
    // Add missing closing brackets/braces if needed
    for (let i = 0; i < (finalOpenBrackets - finalCloseBrackets); i++) {
      fixed += ']';
    }
    for (let i = 0; i < (finalOpenBraces - finalCloseBraces); i++) {
      fixed += '}';
    }
    
    return fixed;
  }

  /**
   * Reconstruct chart data from raw API data when JSON parsing fails
   */
  private reconstructChartFromApiData(response: any): ChartData | null {
    try {
      // Check if we have the raw data array to reconstruct from
      if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
        return null;
      }
      
      // Extract common patterns from the raw data
      const dataArray = response.data;
      const firstRecord = dataArray[0];
      
      // Try to identify time-series data patterns
      if (firstRecord.Year && firstRecord.Month && firstRecord.MonthName) {
        // Monthly sales data pattern
        const labels = dataArray.map((record: any) => {
          const monthYear = `${record.MonthName} ${record.Year}`;
          return monthYear;
        });
        
        const values = dataArray.map((record: any) => {
          // Try different possible value field names
          return record.TotalSales || record.Sales || record.Value || record.Amount || 0;
        });
        
        return {
          render_mode: 'frontend',
          chart_type: 'line',
          chart_config: {
            labels: labels,
            datasets: [{
              label: 'Total Sales',
              data: values
            }]
          }
        };
      }
      
      // Try to identify other common patterns
      // Pattern: objects with name/value pairs
      const keys = Object.keys(firstRecord);
      if (keys.length >= 2) {
        // Look for text field (for labels) and number field (for data)
        const textField = keys.find(key => typeof firstRecord[key] === 'string');
        const numberField = keys.find(key => typeof firstRecord[key] === 'number');
        
        if (textField && numberField) {
          const labels = dataArray.map((record: any) => record[textField]);
          const values = dataArray.map((record: any) => record[numberField]);
          
          return {
            render_mode: 'frontend',
            chart_type: 'line',
            chart_config: {
              labels: labels,
              datasets: [{
                label: numberField.replace(/([A-Z])/g, ' $1').trim(), // Convert camelCase to readable
                data: values
              }]
            }
          };
        }
      }
      
      return null;
      
    } catch (error) {
      console.warn('Failed to reconstruct chart data:', error);
      return null;
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    if (environment.enableDebugLogging) {
      console.error('Chat service error:', errorMessage);
    }
    return throwError(() => new Error(errorMessage));
  }
}