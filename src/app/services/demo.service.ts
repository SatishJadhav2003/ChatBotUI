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
LIMIT 10;`,        insight: 'The sales data reveals strong performance in electronics and home appliances over the last 30 days. The iPhone 15 leads with $125,000 in total sales, followed by Samsung TV at $98,000. This represents a 15% increase compared to the previous month, indicating positive market trends. The average transaction value of $1,250 suggests customers are making significant purchases.',
        data: [
          { product_name: 'iPhone 15', total_sales: 125000, transaction_count: 100, avg_sale_amount: 1250 },
          { product_name: 'Samsung TV 55"', total_sales: 98000, transaction_count: 70, avg_sale_amount: 1400 },
          { product_name: 'MacBook Pro', total_sales: 87500, transaction_count: 50, avg_sale_amount: 1750 },
          { product_name: 'PlayStation 5', total_sales: 76000, transaction_count: 152, avg_sale_amount: 500 },
          { product_name: 'Air Fryer Deluxe', total_sales: 65000, transaction_count: 325, avg_sale_amount: 200 },
          { product_name: 'Wireless Headphones', total_sales: 54000, transaction_count: 180, avg_sale_amount: 300 },
          { product_name: 'Smart Watch', total_sales: 48000, transaction_count: 160, avg_sale_amount: 300 },
          { product_name: 'Gaming Chair', total_sales: 42000, transaction_count: 84, avg_sale_amount: 500 }
        ],
        chart_data: {
          render_mode: 'frontend',
          chart_type: 'bar',
          chart_config: {
            labels: ['iPhone 15', 'Samsung TV 55"', 'MacBook Pro', 'PlayStation 5', 'Air Fryer Deluxe', 'Wireless Headphones', 'Smart Watch', 'Gaming Chair'],
            datasets: [{
              label: 'Total Sales ($)',
              data: [125000, 98000, 87500, 76000, 65000, 54000, 48000, 42000],
              backgroundColor: '#3B82F6',
              borderColor: '#1D4ED8',
              borderWidth: 1
            }],
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Top Products by Sales (Last 30 Days)'
                }
              },
              // scales: {
              //   y: {
              //     beginAtZero: true,
              //     ticks: {
              //       callback: function(value: any) {
              //         return '$' + value.toLocaleString();
              //       }
              //     }
              //   }
              // }
            }
          }
        }
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
LIMIT 15;`,        insight: 'Customer analysis shows a diverse user base with varying engagement levels. Top customers have lifetime values ranging from $2,500 to $15,000. The data indicates that 68% of customers are repeat buyers, with an average of 3.2 orders per customer. Recent activity suggests strong customer retention, particularly among premium segment buyers.',
        data: [
          { customer_id: 1001, first_name: 'John', last_name: 'Smith', email: 'j.smith@email.com', total_orders: 12, lifetime_value: 15000, last_order_date: '2025-05-28' },
          { customer_id: 1002, first_name: 'Sarah', last_name: 'Johnson', email: 's.johnson@email.com', total_orders: 8, lifetime_value: 12500, last_order_date: '2025-06-01' },
          { customer_id: 1003, first_name: 'Michael', last_name: 'Brown', email: 'm.brown@email.com', total_orders: 6, lifetime_value: 9800, last_order_date: '2025-05-30' },
          { customer_id: 1004, first_name: 'Emily', last_name: 'Davis', email: 'e.davis@email.com', total_orders: 5, lifetime_value: 7200, last_order_date: '2025-06-02' },
          { customer_id: 1005, first_name: 'Robert', last_name: 'Wilson', email: 'r.wilson@email.com', total_orders: 4, lifetime_value: 5600, last_order_date: '2025-05-25' }
        ],
        chart_data: {
          render_mode: 'frontend',
          chart_type: 'pie',
          chart_config: {
            labels: ['High Value ($10K+)', 'Medium Value ($5K-$10K)', 'Regular Value (<$5K)'],
            datasets: [{
              label: 'Customer Segments by Lifetime Value',
              data: [2, 2, 1],
              backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
              borderColor: ['#059669', '#D97706', '#DC2626'],
              borderWidth: 2
            }],
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Customer Segmentation by Lifetime Value'
                },
                legend: {
                  position: 'bottom'
                }
              }
            }
          }
        }
      };
    }    if (lowerQuestion.includes('inventory') || lowerQuestion.includes('stock')) {
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
        ],
        chart_data: {
          render_mode: 'frontend',
          chart_type: 'stacked_bar',
          chart_config: {
            labels: ['iPhone 15', 'Gaming Headset', 'Bluetooth Speaker', 'Smart Watch', 'Laptop Stand'],
            datasets: [
              {
                label: 'Current Stock',
                data: [5, 8, 12, 45, 85],
                backgroundColor: '#EF4444'
              },
              {
                label: 'Available Capacity',
                data: [95, 42, 63, 35, 15],
                backgroundColor: '#10B981'
              }
            ],
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Inventory Levels vs Capacity'
                },
                legend: {
                  position: 'top'
                }
              },
              scales: {
                x: {
                  stacked: true
                },
                y: {
                  stacked: true,
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Stock Units'
                  }
                }
              }
            }
          }
        }
      };
    }

    if (lowerQuestion.includes('trends') || lowerQuestion.includes('analytics') || lowerQuestion.includes('time')) {
      return {
        status: 'valid',
        message: null,
        sql_query: `SELECT 
    DATE_FORMAT(order_date, '%Y-%m') as month,
    COUNT(*) as total_orders,
    SUM(order_total) as total_revenue,
    AVG(order_total) as avg_order_value
FROM orders
WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
GROUP BY DATE_FORMAT(order_date, '%Y-%m')
ORDER BY month;`,
        insight: 'Trend analysis over the last 6 months shows steady growth in both order volume and revenue. Monthly revenue has increased by 23% from January to May 2025, with average order value rising from $145 to $178. The data indicates strong business momentum with consistent month-over-month growth, particularly in March and April.',
        data: [
          { month: '2024-12', total_orders: 1250, total_revenue: 181250, avg_order_value: 145 },
          { month: '2025-01', total_orders: 1340, total_revenue: 194620, avg_order_value: 145 },
          { month: '2025-02', total_orders: 1420, total_revenue: 216840, avg_order_value: 153 },
          { month: '2025-03', total_orders: 1580, total_revenue: 253440, avg_order_value: 160 },
          { month: '2025-04', total_orders: 1650, total_revenue: 280500, avg_order_value: 170 },
          { month: '2025-05', total_orders: 1720, total_revenue: 305920, avg_order_value: 178 }
        ],
        chart_data: {
          render_mode: 'frontend',
          chart_type: 'line',
          chart_config: {
            labels: ['Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025'],            datasets: [
              {
                label: 'Total Orders',
                data: [1250, 1340, 1420, 1580, 1650, 1720]
              },
              {
                label: 'Total Revenue ($)',
                data: [181250, 194620, 216840, 253440, 280500, 305920]
              }
            ],
            options: {
              responsive: true,
              interaction: {
                mode: 'index',
                intersect: false,
              },
              plugins: {
                title: {
                  display: true,
                  text: 'Order Volume and Revenue Trends (6 Months)'
                },
                legend: {
                  position: 'top'
                }
              },
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Month'
                  }
                },
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  title: {
                    display: true,
                    text: 'Number of Orders'
                  },
                  beginAtZero: true
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  title: {
                    display: true,
                    text: 'Revenue ($)'
                  },
                  beginAtZero: true,
                  grid: {
                    drawOnChartArea: false,
                  },
                  ticks: {
                    callback: function(value: any) {
                      return '$' + value.toLocaleString();
                    }
                  }
                }
              }
            }
          }
        }
      };
    }

    if (lowerQuestion.includes('backend') || lowerQuestion.includes('image') || lowerQuestion.includes('report')) {
      return {
        status: 'valid',
        message: null,
        sql_query: `SELECT 
    category,
    COUNT(*) as product_count,
    AVG(price) as avg_price,
    SUM(inventory.current_stock) as total_stock
FROM products p
JOIN inventory i ON p.product_id = i.product_id
GROUP BY category
ORDER BY product_count DESC;`,
        insight: 'Category analysis shows Electronics leading with 45 products, followed by Home & Garden with 32 products. Average pricing varies significantly across categories, with Electronics having the highest average price at $350. The data suggests opportunities for expansion in underrepresented categories.',
        data: [
          { category: 'Electronics', product_count: 45, avg_price: 350, total_stock: 1250 },
          { category: 'Home & Garden', product_count: 32, avg_price: 85, total_stock: 890 },
          { category: 'Sports & Outdoors', product_count: 28, avg_price: 125, total_stock: 650 },
          { category: 'Books & Media', product_count: 24, avg_price: 25, total_stock: 1450 },
          { category: 'Fashion', product_count: 20, avg_price: 65, total_stock: 780 }
        ],        chart_data: {
          render_mode: 'backend',
          chart_type: 'image',
          chart_config: {
            image_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLAAAASwCAYAAABVz8cBAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAIABJREFUeJzs3Xm4JVdd9/vPr7Z5781kJmEKhCmAAhKQQVBBUFFRUEEQFRQHvOq9er3X4dHrjOP1Ou...', // Truncated for brevity - this would be a full base64 encoded chart image
            alt_text: 'Category Distribution Chart - Product count by category with pricing analysis',
            title: 'Product Categories Overview - Generated by Backend Analytics Engine'
          }
        }
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
