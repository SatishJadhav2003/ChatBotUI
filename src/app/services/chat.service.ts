import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { DemoService } from './demo.service';

export interface ChatRequest {
  query: string;
}

export interface ChatResponse {
  status: string;
  message: string | null;
  sql_query: string;
  insight: string;
  data: any[];
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
  private demoMode = false; // Set to true to use demo mode without backend by default

  constructor(
    private http: HttpClient,
    private demoService: DemoService
  ) { }

  setDemoMode(enabled: boolean): void {
    this.demoMode = enabled;
  }

  isDemoMode(): boolean {
    return this.demoMode;
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  sendMessage(query: string): Observable<ChatResponse> {
    if (this.demoMode) {
      return this.demoService.processQuestion(query);
    }

    const payload: ChatRequest = { query };
    
    return this.http.post<any>(`${this.apiUrl}`, {query})
      .pipe(
        catchError(this.handleError)
      );
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
