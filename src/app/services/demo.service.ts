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

    // Test exact API format with string chart_data (like your API)
    if (lowerQuestion.includes('api test') || lowerQuestion.includes('test api')) {
      return {
        status: 'valid',
        message: null,
        sql_query: 'SELECT r.region_name AS RegionName, SUM(s.amount) AS TotalSales FROM regions r JOIN sales s ON r.region_id = s.region_id GROUP BY r.region_name ORDER BY TotalSales DESC;',
        insight: 'The West region leads in sales with $92,007.85, followed by East at $76,906.80, Central at $76,207.10, North at $75,407.35, and South at $74,008.10.',
        // THIS IS THE EXACT FORMAT YOUR API RETURNS - STRING WITH NEWLINES
        chart_data: "{\n    render_mode: 'frontend',\n    chart_type: 'bar',\n    chart_config: {\n        labels: ['west', 'east', 'central', 'north', 'south'],\n        datasets: [{\n            label: 'total sales',\n            data: [92007.85, 76906.80, 76207.10, 75407.35, 74008.10]\n        }]\n    }\n}",
        data: [
          {'RegionName': 'West', 'TotalSales': 92007.85},
          {'RegionName': 'East', 'TotalSales': 76906.80},
          {'RegionName': 'Central', 'TotalSales': 76207.10},
          {'RegionName': 'North', 'TotalSales': 75407.35},
          {'RegionName': 'South', 'TotalSales': 74008.10}
        ]
      } as any; // Use 'as any' to allow string chart_data in demo
    }    if (lowerQuestion.includes('bar chart') || lowerQuestion.includes('test bar')) {
      return {
        status: 'valid',
        message: null,
        sql_query: `SELECT 
    department,
    COUNT(*) as employee_count,
    AVG(salary) as avg_salary,
    SUM(budget_allocated) as total_budget
FROM employees e
JOIN departments d ON e.dept_id = d.dept_id
GROUP BY department
ORDER BY employee_count DESC;`,
        insight: 'Department analysis shows Technology leading with 45 employees, followed by Sales with 38 employees. The data reveals balanced workforce distribution across key business areas. Technology department also has the highest average salary at $95K, reflecting the competitive tech talent market. Total budget allocation aligns with departmental priorities and headcount.',
        data: [
          { department: 'Technology', employee_count: 45, avg_salary: 95000, total_budget: 2850000 },
          { department: 'Sales', employee_count: 38, avg_salary: 78000, total_budget: 2280000 },
          { department: 'Marketing', employee_count: 25, avg_salary: 72000, total_budget: 1400000 },
          { department: 'Operations', employee_count: 32, avg_salary: 68000, total_budget: 1600000 },
          { department: 'Finance', employee_count: 18, avg_salary: 85000, total_budget: 1200000 },
          { department: 'HR', employee_count: 12, avg_salary: 75000, total_budget: 800000 }
        ],
        chart_data: {
          render_mode: 'frontend',
          chart_type: 'bar',
          chart_config: {
            labels: ['Technology', 'Sales', 'Marketing', 'Operations', 'Finance', 'HR'],
            datasets: [{
              label: 'Employee Count',
              data: [45, 38, 25, 32, 18, 12]
            }]
          }
        }
      };
    }

    if (lowerQuestion.includes('pie chart') || lowerQuestion.includes('test pie')) {
      return {
        status: 'valid',
        message: null,
        sql_query: `SELECT 
    product_category,
    SUM(sales_amount) as category_sales,
    COUNT(*) as transaction_count,
    AVG(sales_amount) as avg_transaction
FROM sales s
JOIN products p ON s.product_id = p.product_id
WHERE s.sale_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
GROUP BY product_category
ORDER BY category_sales DESC;`,
        insight: 'Product category sales analysis for the last 90 days shows Electronics dominating with 42.5% of total sales ($340K), followed by Home & Garden at 23.8% ($190K). The data reveals strong consumer demand for technology products, with Gaming representing an emerging category at 15.2% market share. Fashion and Books maintain steady but smaller market positions.',
        data: [
          { product_category: 'Electronics', category_sales: 340000, transaction_count: 1200, avg_transaction: 283.33 },
          { product_category: 'Home & Garden', category_sales: 190000, transaction_count: 950, avg_transaction: 200.00 },
          { product_category: 'Gaming', category_sales: 122000, transaction_count: 680, avg_transaction: 179.41 },
          { product_category: 'Fashion', category_sales: 95000, transaction_count: 750, avg_transaction: 126.67 },
          { product_category: 'Books', category_sales: 53000, transaction_count: 1100, avg_transaction: 48.18 }
        ],        chart_data: {
          render_mode: 'frontend',
          chart_type: 'pie',
          chart_config: {
            labels: ['Electronics', 'Home & Garden', 'Gaming', 'Fashion', 'Books'],
            datasets: [{
              label: 'Sales by Category',
              data: [340000, 190000, 122000, 95000, 53000]
            }]
          }
        }
      };
    }

    if (lowerQuestion.includes('donut chart') || lowerQuestion.includes('test donut')) {
      return {
        status: 'valid',
        message: null,
        sql_query: `SELECT 
    region_name,
    SUM(order_value) as total_revenue,
    COUNT(order_id) as order_count,
    AVG(order_value) as avg_order_value,
    SUM(profit_margin) as total_profit
FROM orders o
JOIN regions r ON o.region_id = r.region_id
WHERE o.order_date >= DATE_SUB(CURDATE(), INTERVAL 180 DAY)
GROUP BY region_name
ORDER BY total_revenue DESC;`,
        insight: 'Regional revenue distribution analysis for the last 6 months reveals North America leading with 35.2% of total revenue ($421K), followed by Europe at 28.7% ($344K). Asia-Pacific shows strong growth at 22.1% ($265K), indicating expanding market presence. Latin America and Middle East/Africa represent emerging markets with 9.8% and 4.2% respectively, presenting significant growth opportunities.',
        data: [
          { region_name: 'North America', total_revenue: 421000, order_count: 1580, avg_order_value: 266.46, total_profit: 84200 },
          { region_name: 'Europe', total_revenue: 344000, order_count: 1290, avg_order_value: 266.67, total_profit: 68800 },
          { region_name: 'Asia-Pacific', total_revenue: 265000, order_count: 1050, avg_order_value: 252.38, total_profit: 53000 },
          { region_name: 'Latin America', total_revenue: 117000, order_count: 520, avg_order_value: 225.00, total_profit: 23400 },
          { region_name: 'Middle East/Africa', total_revenue: 51000, order_count: 240, avg_order_value: 212.50, total_profit: 10200 }
        ],
        chart_data: {
          render_mode: 'frontend',
          chart_type: 'donut',
          chart_config: {
            labels: ['North America', 'Europe', 'Asia-Pacific', 'Latin America', 'Middle East/Africa'],
            datasets: [{
              label: 'Revenue by Region',
              data: [421000, 344000, 265000, 117000, 51000]
            }]
          }
        }      };
    }    if (lowerQuestion.includes('multi area') || lowerQuestion.includes('test multi area')) {
      return {
        status: 'valid',
        message: null,
        sql_query: `SELECT 
    CONCAT(YEAR(order_date), '-', LPAD(MONTH(order_date), 2, '0')) as month_year,
    SUM(CASE WHEN region = 'North America' THEN order_value ELSE 0 END) as north_america_sales,
    SUM(CASE WHEN region = 'Europe' THEN order_value ELSE 0 END) as europe_sales,
    SUM(CASE WHEN region = 'Asia Pacific' THEN order_value ELSE 0 END) as asia_pacific_sales
FROM orders o
JOIN regions r ON o.region_id = r.region_id
WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY YEAR(order_date), MONTH(order_date)
ORDER BY order_date;`,
        insight: 'Multi-region sales analysis shows North America consistently leading with steady growth, followed by Europe and Asia Pacific. The area chart visualization clearly demonstrates seasonal patterns across all regions, with Q4 showing the strongest performance globally. North America grew 22% year-over-year, Europe 18%, and Asia Pacific 25%, indicating strong expansion in all markets.',
        data: [
          { month_year: '2024-01', north_america_sales: 42000, europe_sales: 32000, asia_pacific_sales: 21000 },
          { month_year: '2024-02', north_america_sales: 39000, europe_sales: 29000, asia_pacific_sales: 21000 },
          { month_year: '2024-03', north_america_sales: 48000, europe_sales: 35000, asia_pacific_sales: 25000 },
          { month_year: '2024-04', north_america_sales: 50000, europe_sales: 37000, asia_pacific_sales: 25000 },
          { month_year: '2024-05', north_america_sales: 52000, europe_sales: 38000, asia_pacific_sales: 28000 },
          { month_year: '2024-06', north_america_sales: 55000, europe_sales: 40000, asia_pacific_sales: 30000 },
          { month_year: '2024-07', north_america_sales: 58000, europe_sales: 42000, asia_pacific_sales: 32000 },
          { month_year: '2024-08', north_america_sales: 56000, europe_sales: 41000, asia_pacific_sales: 31000 },
          { month_year: '2024-09', north_america_sales: 59000, europe_sales: 43000, asia_pacific_sales: 33000 },
          { month_year: '2024-10', north_america_sales: 62000, europe_sales: 45000, asia_pacific_sales: 35000 },
          { month_year: '2024-11', north_america_sales: 64000, europe_sales: 46000, asia_pacific_sales: 35000 },
          { month_year: '2024-12', north_america_sales: 56000, europe_sales: 42000, asia_pacific_sales: 30000 }
        ],
        chart_data: {
          render_mode: 'frontend',
          chart_type: 'area',
          chart_config: {
            labels: ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024'],
            datasets: [
              {
                label: 'North America',
                data: [42000, 39000, 48000, 50000, 52000, 55000, 58000, 56000, 59000, 62000, 64000, 56000]
              },
              {
                label: 'Europe',
                data: [32000, 29000, 35000, 37000, 38000, 40000, 42000, 41000, 43000, 45000, 46000, 42000]
              },
              {
                label: 'Asia Pacific',
                data: [21000, 21000, 25000, 25000, 28000, 30000, 32000, 31000, 33000, 35000, 35000, 30000]
              }
            ]
          }
        }
      };
    }

    if (lowerQuestion.includes('area chart') || lowerQuestion.includes('test area')) {
      return {
        status: 'valid',
        message: null,
        sql_query: `SELECT 
    CONCAT(YEAR(order_date), '-', LPAD(MONTH(order_date), 2, '0')) as month_year,
    SUM(order_value) as monthly_revenue,
    COUNT(order_id) as monthly_orders,
    AVG(order_value) as avg_monthly_order,
    SUM(profit_margin) as monthly_profit
FROM orders 
WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY YEAR(order_date), MONTH(order_date)
ORDER BY order_date;`,
        insight: 'Monthly revenue trend analysis over the past 12 months shows steady growth with seasonal peaks in November ($145K) and December ($128K) driven by holiday shopping. The lowest performance was in February ($89K), typical for post-holiday periods. Overall trend indicates 18% year-over-year growth with consistent customer acquisition.',
        data: [
          { month_year: '2024-01', monthly_revenue: 95000, monthly_orders: 420, avg_monthly_order: 226.19, monthly_profit: 19000 },
          { month_year: '2024-02', monthly_revenue: 89000, monthly_orders: 380, avg_monthly_order: 234.21, monthly_profit: 17800 },
          { month_year: '2024-03', monthly_revenue: 108000, monthly_orders: 465, avg_monthly_order: 232.26, monthly_profit: 21600 },
          { month_year: '2024-04', monthly_revenue: 112000, monthly_orders: 485, avg_monthly_order: 230.93, monthly_profit: 22400 },
          { month_year: '2024-05', monthly_revenue: 118000, monthly_orders: 510, avg_monthly_order: 231.37, monthly_profit: 23600 },
          { month_year: '2024-06', monthly_revenue: 125000, monthly_orders: 535, avg_monthly_order: 233.64, monthly_profit: 25000 },
          { month_year: '2024-07', monthly_revenue: 132000, monthly_orders: 565, avg_monthly_order: 233.63, monthly_profit: 26400 },
          { month_year: '2024-08', monthly_revenue: 128000, monthly_orders: 550, avg_monthly_order: 232.73, monthly_profit: 25600 },
          { month_year: '2024-09', monthly_revenue: 135000, monthly_orders: 580, avg_monthly_order: 232.76, monthly_profit: 27000 },
          { month_year: '2024-10', monthly_revenue: 142000, monthly_orders: 605, avg_monthly_order: 234.71, monthly_profit: 28400 },
          { month_year: '2024-11', monthly_revenue: 145000, monthly_orders: 620, avg_monthly_order: 233.87, monthly_profit: 29000 },
          { month_year: '2024-12', monthly_revenue: 128000, monthly_orders: 545, avg_monthly_order: 234.86, monthly_profit: 25600 }
        ],
        chart_data: {
          render_mode: 'frontend',
          chart_type: 'area',
          chart_config: {
            labels: ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024', 'Jul 2024', 'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024'],
            datasets: [{
              label: 'Monthly Revenue',
              data: [95000, 89000, 108000, 112000, 118000, 125000, 132000, 128000, 135000, 142000, 145000, 128000]
            }]
          }
        }
      };
    }

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
              data: [125000, 98000, 87500, 76000, 65000, 54000, 48000, 42000]
            }]
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
