import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage, ChatResponse } from '../../services/chat.service';
import { MessageComponent } from '../message/message.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
    messages: ChatMessage[] = [];
  currentMessage: string = '';
  isLoading: boolean = false;
  connectionError: boolean = false;
  isDemoMode: boolean = false;
  apiUrl: string = '';
  private shouldScrollToBottom: boolean = false;

  constructor(private chatService: ChatService) {
    // Get API URL from environment or service
    this.apiUrl = this.chatService.getApiUrl();
  }
  ngOnInit(): void {
    // Load messages from localStorage if available
    this.loadMessagesFromStorage();
    // Initialize demo mode
    this.isDemoMode = this.chatService.isDemoMode();
    
    // Make component accessible for testing (development only)
    if (!environment.production) {
      (window as any).chatComponent = this;
      console.log('🧪 Development mode: chatComponent available on window object');
      console.log('💡 Test chart parsing with: window.chatComponent.testChartDataParsing()');
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }  onEnterKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (!keyboardEvent.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  toggleDemoMode(): void {
    this.isDemoMode = !this.isDemoMode;
    this.chatService.setDemoMode(this.isDemoMode);
    this.connectionError = false;
  }
  sendMessage(): void {
    if (!this.currentMessage.trim() || this.isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: this.generateId(),
      type: 'user',
      content: this.currentMessage.trim(),
      timestamp: new Date()
    };

    const botMessage: ChatMessage = {
      id: this.generateId(),
      type: 'bot',
      content: '',
      timestamp: new Date(),
      isLoading: true
    };

    this.messages.push(userMessage, botMessage);
    this.shouldScrollToBottom = true;
    
    const questionToSend = this.currentMessage.trim().replace(/FY/g, 'Financial Year'); // Replace FY with Financial Year
    this.currentMessage = '';
    this.isLoading = true;
    this.connectionError = false;

    this.chatService.sendMessage(questionToSend).subscribe({
      next: (response: ChatResponse) => {
        this.handleSuccessResponse(botMessage, response);
      },
      error: (error) => {
        this.handleErrorResponse(botMessage, error);
      }
    });
  }
  sendSampleQuestion(question: string): void {
    this.currentMessage = question.replace(/FY/g, 'Financial Year');
    this.sendMessage();
  }

  private handleSuccessResponse(botMessage: ChatMessage, response: ChatResponse): void {
    botMessage.isLoading = false;
    botMessage.response = response;
    botMessage.content = response.insight || 'Response received';
    this.isLoading = false;
    this.connectionError = false;
    this.shouldScrollToBottom = true;
    this.saveMessagesToStorage();
  }

  private handleErrorResponse(botMessage: ChatMessage, error: any): void {
    botMessage.isLoading = false;
    botMessage.response = {
      status: 'error',
      message: error.message || 'Failed to connect to the server. Please check your connection and try again.',
      sql_query: '',
      insight: '',
      data: []
    };
    botMessage.content = 'Error occurred';
    this.isLoading = false;
    this.connectionError = true;
    this.shouldScrollToBottom = true;
    this.saveMessagesToStorage();
  }

  clearChat(): void {
    this.messages = [];
    this.saveMessagesToStorage();
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id;
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.warn('Could not scroll to bottom:', err);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveMessagesToStorage(): void {
    try {
      const messagesToSave = this.messages.map(msg => ({
        ...msg,
        isLoading: false // Don't save loading state
      }));
      localStorage.setItem('chatMessages', JSON.stringify(messagesToSave));
    } catch (error) {
      console.warn('Could not save messages to localStorage:', error);
    }
  }
  private loadMessagesFromStorage(): void {
    try {
      const saved = localStorage.getItem('chatMessages');
      if (saved) {
        this.messages = JSON.parse(saved);
        this.shouldScrollToBottom = true;
      }
    } catch (error) {
      console.warn('Could not load messages from localStorage:', error);
    }
  }  // Test method for demonstrating chart_data string parsing
  // Can be called from browser console: window.chatComponent.testChartDataParsing()
  public testChartDataParsing(): ChatResponse {
    console.log('🧪 Testing chart_data string parsing...');
    
    // Example API response with chart_data as string (like your backend returns)
    const mockApiResponseWithStringChartData = {
      status: 'valid',
      message: null,
      sql_query: 'SELECT product_name, SUM(sales) FROM sales GROUP BY product_name',
      insight: 'This is a test of chart_data string parsing functionality',
      data: [
        { product_name: 'Test Product A', total_sales: 1000 },
        { product_name: 'Test Product B', total_sales: 1500 }
      ],
      chart_data: JSON.stringify({
        render_mode: 'frontend',
        chart_type: 'bar',
        chart_config: {
          labels: ['Test Product A', 'Test Product B'],
          datasets: [{
            label: 'Sales ($)',
            data: [1000, 1500],
            backgroundColor: '#3B82F6'
          }],
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Test Chart - Parsed from String'
              }
            }
          }
        }
      })    };

    // Test the parsing using parseApiResponse directly
    const result = this.chatService.parseApiResponse(mockApiResponseWithStringChartData);
    
    console.log('✅ Parsing test completed!');
    console.log('📊 Check console logs above for detailed parsing results');
    
    return result;
  }

  // Test method for demonstrating property normalization fix
  // Can be called from browser console: window.chatComponent.testPropertyNormalization()
  public testPropertyNormalization(): ChatResponse {
    console.log('🔧 Testing property normalization fix...');
    console.log('🐛 This simulates the exact error you encountered:');
    console.log('   - chart_data comes as object (not string)');
    console.log('   - API uses lowercase property names (backgroundcolor, bordercolor, etc.)');
    console.log('   - Chart.js expects camelCase (backgroundColor, borderColor, etc.)');
    
    // Exact API response format that was causing the error
    const mockApiResponseWithObjectChartData = {
      status: 'valid',
      message: null,
      sql_query: 'SELECT product_name, SUM(sales) FROM sales GROUP BY product_name',
      insight: 'Property normalization test - fixing backgroundcolor → backgroundColor',
      data: [
        { product_name: 'coffee table', total_sales: 14600.0 },
        { product_name: 'desk chair', total_sales: 11301.5 }
      ],
      // This is an OBJECT (not string) with incorrect property names
      chart_data: {
        render_mode: 'frontend',
        chart_type: 'bar',
        chart_config: {
          labels: ["coffee table", "desk chair", "smartphone", "laptop", "headphones", "bookshelf"],
          datasets: [{
            label: 'total sales amount',
            data: [14600.0, 11301.5, 10400.5, 9801.0, 6300.5, 2400.75],
            // WRONG PROPERTY NAMES (as returned by API)
            backgroundcolor: '#3b82f6',
            bordercolor: '#1d4ed8',
            borderwidth: 1
          }],
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'top selling products by sales amount'
              }
            }
          }
        }
      }
    };

    console.log('📥 Input (API format with wrong property names):', mockApiResponseWithObjectChartData.chart_data);

    // Test the parsing and normalization
    const result = this.chatService.parseApiResponse(mockApiResponseWithObjectChartData);
    
    console.log('📤 Output (normalized for Chart.js):', result.chart_data);
    console.log('✅ Property normalization test completed!');
    console.log('🎯 Check that backgroundcolor → backgroundColor, bordercolor → borderColor, etc.');
    
    return result;
  }
}
