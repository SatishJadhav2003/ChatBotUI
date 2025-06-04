import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../services/chat.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {
  @Input() message!: ChatMessage;

  formatTime(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTableColumns(data: any[]): string[] {
    if (!data || data.length === 0) {
      return [];
    }
    return Object.keys(data[0]);
  }

  formatCellValue(value: any): string {
    if (value === null || value === undefined) {
      return '-';
    }
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return String(value);
  }

  formatSqlQuery(sql: string): string {
    // Basic SQL syntax highlighting
    return sql
      .replace(/\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP BY|ORDER BY|HAVING|LIMIT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|INDEX)\b/gi, 
        '<span class="sql-keyword">$1</span>')
      .replace(/('[^']*'|"[^"]*")/g, '<span class="sql-string">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="sql-number">$1</span>')
      .replace(/(--[^\n]*)/g, '<span class="sql-comment">$1</span>');
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
      console.log('Copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

  exportToCSV(data: any[]): void {
    if (!data || data.length === 0) {
      return;
    }

    const columns = this.getTableColumns(data);
    const csv = [
      columns.join(','),
      ...data.map(row => 
        columns.map(col => {
          const value = row[col];
          if (value === null || value === undefined) {
            return '';
          }
          // Escape commas and quotes
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
