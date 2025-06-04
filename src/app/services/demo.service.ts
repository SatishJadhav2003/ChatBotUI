import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ChatResponse } from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class DemoService {

  constructor() { }

  processQuestion(question: string): Observable<ChatResponse> {
    // Simulate API delay
    return of(this.generateDemoResponse(question)).pipe(
      delay(1000 + Math.random() * 2000) // Random delay between 1-3 seconds
    );
  }

  private generateDemoResponse(question: string): ChatResponse {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('sales') || lowerQuestion.includes('revenue')) {
      return {
        status: 'valid',
        message: null,
        sql_query: `SELECT 
    p.product_name, 
    SUM(s.sales_amount) as total_sales,
    COUNT(s.sale_id) as transaction_count,
    AVG(s.sales_amount) as avg_sale_amount
FROM sales s
JOIN products p ON s.product_id = p.product_id
WHERE s.sale_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY p.product_name
ORDER BY total_sales DESC
LIMIT 10;`,
        insight: 'The sales data reveals strong performance in electronics and home appliances over the last 30 days. The iPhone 15 leads with $125,000 in total sales, followed by Samsung TV at $98,000. This represents a 15% increase compared to the previous month, indicating positive market trends. The average transaction value of $1,250 suggests customers are making significant purchases.',
        data: [
          { product_name: 'iPhone 15', total_sales: 125000, transaction_count: 100, avg_sale_amount: 1250 },
          { product_name: 'Samsung TV 55"', total_sales: 98000, transaction_count: 70, avg_sale_amount: 1400 },
          { product_name: 'MacBook Pro', total_sales: 87500, transaction_count: 50, avg_sale_amount: 1750 },
          { product_name: 'PlayStation 5', total_sales: 76000, transaction_count: 152, avg_sale_amount: 500 },
          { product_name: 'Air Fryer Deluxe', total_sales: 65000, transaction_count: 325, avg_sale_amount: 200 },
          { product_name: 'Wireless Headphones', total_sales: 54000, transaction_count: 180, avg_sale_amount: 300 },
          { product_name: 'Smart Watch', total_sales: 48000, transaction_count: 160, avg_sale_amount: 300 },
          { product_name: 'Gaming Chair', total_sales: 42000, transaction_count: 84, avg_sale_amount: 500 }
        ]
      };
    }

    if (lowerQuestion.includes('customer') || lowerQuestion.includes('user')) {
      return {
        status: 'valid',
        message: null,
        sql_query: `SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email,
    COUNT(o.order_id) as total_orders,
    SUM(o.order_total) as lifetime_value,
    MAX(o.order_date) as last_order_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id
ORDER BY lifetime_value DESC
LIMIT 15;`,
        insight: 'Customer analysis shows a diverse user base with varying engagement levels. Top customers have lifetime values ranging from $2,500 to $15,000. The data indicates that 68% of customers are repeat buyers, with an average of 3.2 orders per customer. Recent activity suggests strong customer retention, particularly among premium segment buyers.',
        data: [
          { customer_id: 1001, first_name: 'John', last_name: 'Smith', email: 'j.smith@email.com', total_orders: 12, lifetime_value: 15000, last_order_date: '2025-05-28' },
          { customer_id: 1002, first_name: 'Sarah', last_name: 'Johnson', email: 's.johnson@email.com', total_orders: 8, lifetime_value: 12500, last_order_date: '2025-06-01' },
          { customer_id: 1003, first_name: 'Michael', last_name: 'Brown', email: 'm.brown@email.com', total_orders: 6, lifetime_value: 9800, last_order_date: '2025-05-30' },
          { customer_id: 1004, first_name: 'Emily', last_name: 'Davis', email: 'e.davis@email.com', total_orders: 5, lifetime_value: 7200, last_order_date: '2025-06-02' },
          { customer_id: 1005, first_name: 'Robert', last_name: 'Wilson', email: 'r.wilson@email.com', total_orders: 4, lifetime_value: 5600, last_order_date: '2025-05-25' }
        ]
      };
    }

    if (lowerQuestion.includes('inventory') || lowerQuestion.includes('stock')) {
      return {
        status: 'valid',
        message: null,
        sql_query: `SELECT 
    p.product_name,
    p.category,
    i.current_stock,
    i.minimum_stock,
    i.maximum_stock,
    CASE 
        WHEN i.current_stock <= i.minimum_stock THEN 'Low Stock'
        WHEN i.current_stock >= i.maximum_stock THEN 'Overstocked'
        ELSE 'Normal'
    END as stock_status
FROM products p
JOIN inventory i ON p.product_id = i.product_id
ORDER BY 
    CASE 
        WHEN i.current_stock <= i.minimum_stock THEN 1
        WHEN i.current_stock >= i.maximum_stock THEN 2
        ELSE 3
    END,
    i.current_stock ASC;`,
        insight: 'Inventory analysis reveals several critical stock situations. 15 products are currently below minimum stock levels, requiring immediate reordering. Electronics category shows the highest turnover rate, while home appliances maintain steady inventory levels. The system recommends prioritizing restocking for high-demand items like smartphones and gaming accessories.',
        data: [
          { product_name: 'iPhone 15', category: 'Electronics', current_stock: 5, minimum_stock: 20, maximum_stock: 100, stock_status: 'Low Stock' },
          { product_name: 'Gaming Headset', category: 'Gaming', current_stock: 8, minimum_stock: 15, maximum_stock: 50, stock_status: 'Low Stock' },
          { product_name: 'Bluetooth Speaker', category: 'Electronics', current_stock: 12, minimum_stock: 25, maximum_stock: 75, stock_status: 'Low Stock' },
          { product_name: 'Smart Watch', category: 'Wearables', current_stock: 45, minimum_stock: 20, maximum_stock: 80, stock_status: 'Normal' },
          { product_name: 'Laptop Stand', category: 'Accessories', current_stock: 85, minimum_stock: 30, maximum_stock: 100, stock_status: 'Normal' }
        ]
      };
    }

    if (lowerQuestion.includes('error') || lowerQuestion.includes('test error')) {
      return {
        status: 'error',
        message: 'This is a demo error message. The system encountered an issue processing your request. In a real application, this could be due to database connectivity issues, invalid query parameters, or server errors.',
        sql_query: '',
        insight: '',
        data: []
      };
    }

    // Default response for general questions
    return {
      status: 'valid',
      message: null,
      sql_query: `SELECT 
    'General Query' as query_type,
    COUNT(*) as total_records,
    MIN(created_date) as earliest_record,
    MAX(created_date) as latest_record
FROM main_database_table
WHERE status = 'active';`,
      insight: 'This is a general response to your question. The system has processed your query and returned basic information about the dataset. For more specific insights, try asking about sales data, customer information, inventory levels, or specific metrics you\'re interested in analyzing.',
      data: [
        { query_type: 'General Query', total_records: 10457, earliest_record: '2024-01-01', latest_record: '2025-06-04' },
        { metric: 'Database Health', status: 'Excellent', last_updated: '2025-06-04 08:30:00' },
        { metric: 'Data Completeness', percentage: 98.5, total_fields: 234 },
        { metric: 'Query Performance', avg_response_time: '0.234s', optimization_level: 'High' }
      ]
    };
  }
}
