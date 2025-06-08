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
  }  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }onEnterKey(event: Event): void {
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
    };    this.messages.push(userMessage, botMessage);
    // this.shouldScrollToBottom = true; // Auto-scroll disabled
    
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
    this.currentMessage = question.replace(/FY/gi, 'Financial Year');
    this.sendMessage();
  }

  private handleSuccessResponse(botMessage: ChatMessage, response: ChatResponse): void {
    botMessage.isLoading = false;    botMessage.response = response;
    botMessage.content = response.insight || 'Response received';
    this.isLoading = false;
    this.connectionError = false;
    // this.shouldScrollToBottom = true; // Auto-scroll disabled
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
    };    botMessage.content = 'Error occurred';
    this.isLoading = false;
    this.connectionError = true;
    // this.shouldScrollToBottom = true; // Auto-scroll disabled
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
      const container = this.messagesContainer.nativeElement;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
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
      const saved = localStorage.getItem('chatMessages');      if (saved) {
        this.messages = JSON.parse(saved);
        this.shouldScrollToBottom = true; // Auto-scroll on page load/refresh
      }
    } catch (error) {
      console.warn('Could not load messages from localStorage:', error);
    }  }
}
