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
    if (!sql) return '';
    return sql;
    // Don't escape HTML since we're creating HTML output
    // Just clean up the input first
    let formattedSql = sql.trim();
    
    // SQL syntax highlighting - fix the regex patterns
    return formattedSql
      // SQL Keywords (including multi-word keywords)
      .replace(/\b(SELECT|FROM|WHERE|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|OUTER JOIN|FULL JOIN|ON|GROUP BY|ORDER BY|HAVING|LIMIT|TOP|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|INDEX|AS|DISTINCT|COUNT|SUM|AVG|MAX|MIN|AND|OR|NOT|IN|EXISTS|BETWEEN|LIKE|IS|NULL|UNION|ALL|ANY|SOME)\b/gi, 
        '<span class="sql-keyword">$1</span>')
      // String literals (single quotes)
      .replace(/('[^']*')/g, '<span class="sql-string">$1</span>')
      // String literals (double quotes and square brackets)
      .replace(/("[^"]*")/g, '<span class="sql-string">$1</span>')
      .replace(/(\[[^\]]*\])/g, '<span class="sql-string">$1</span>')
      // Numbers
      .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="sql-number">$1</span>')
      // Comments
      .replace(/(--[^\n\r]*)/g, '<span class="sql-comment">$1</span>');
  }

  highlightInsightText(text: string): string {
    if (!text) return '';
    
    // Clean up the text first
    let highlightedText = text.trim();
    
    // Highlight numeric values (currency, percentages, numbers with commas)
    highlightedText = highlightedText
      .replace(/(\$\s*[\d,]+\.?\d*|\b\d{1,3}(?:,\d{3})*(?:\.\d+)?%?|\b\d+\.\d+%?|\b\d+%?)/g, 
        '<strong class="text-blue-600 font-semibold">$1</strong>');
    
    // Highlight important business terms and entities (capitalized words/phrases)
    highlightedText = highlightedText
      .replace(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g, 
        '<strong class="text-gray-800 font-medium">$1</strong>');
    
    // Highlight comparative and analytical terms
    const comparativeTerms = [
      'highest', 'lowest', 'most', 'least', 'top', 'bottom', 
      'best', 'worst', 'significant', 'substantially', 'dramatically', 
      'increase', 'decrease', 'growth', 'decline', 'improved', 'decreased',
      'leading', 'trailing', 'outperforming', 'underperforming',
      'peak', 'minimum', 'maximum', 'average', 'total', 'sum'
    ];
    
    const pattern = '\\b(' + comparativeTerms.join('|') + ')\\b';
    highlightedText = highlightedText
      .replace(new RegExp(pattern, 'gi'), 
        '<em class="text-green-600 font-medium italic">$1</em>');
    
    // Highlight time periods and dates
    highlightedText = highlightedText
      .replace(/\b(\d{4}|\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\b|\b(?:Q[1-4])\b|\b(?:fiscal|calendar) year\b)/gi,
        '<span class="text-purple-600 font-medium">$1</span>');
    
    return highlightedText;
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