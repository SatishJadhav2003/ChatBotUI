import { Injectable } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
  pointBackgroundColor?: string | string[];
  pointBorderColor?: string | string[];
  pointRadius?: number;
  pointHoverRadius?: number;
}

export interface ChartConfig {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ProcessedChartData {
  type: ChartType;
  config: ChartConfiguration;
}

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  // Official professional color palette
  private readonly OFFICIAL_COLORS = {
    primary: '#2563EB',      // Professional Blue
    secondary: '#10B981',    // Professional Green
    accent: '#F59E0B',       // Professional Amber
    danger: '#EF4444',       // Professional Red
    purple: '#8B5CF6',       // Professional Purple
    cyan: '#06B6D4',         // Professional Cyan
    orange: '#F97316',       // Professional Orange
    pink: '#EC4899',         // Professional Pink
    gray: '#6B7280'          // Professional Gray
  };

  private readonly COLOR_PALETTE = [
    this.OFFICIAL_COLORS.primary,
    this.OFFICIAL_COLORS.secondary,
    this.OFFICIAL_COLORS.accent,
    this.OFFICIAL_COLORS.danger,
    this.OFFICIAL_COLORS.purple,
    this.OFFICIAL_COLORS.cyan,
    this.OFFICIAL_COLORS.orange,
    this.OFFICIAL_COLORS.pink,
    this.OFFICIAL_COLORS.gray
  ];

  private readonly DARKER_COLOR_PALETTE = [
    '#1D4ED8', // Darker Blue
    '#059669', // Darker Green
    '#D97706', // Darker Amber
    '#DC2626', // Darker Red
    '#7C3AED', // Darker Purple
    '#0891B2', // Darker Cyan
    '#EA580C', // Darker Orange
    '#DB2777', // Darker Pink
    '#4B5563'  // Darker Gray
  ];

  constructor() {
    // Register Chart.js components and datalabels plugin
    Chart.register(...registerables, ChartDataLabels);
  }

  /**
   * Process chart data and return Chart.js configuration
   */
  processChartData(chartType: string, chartConfig: ChartConfig): ProcessedChartData {
    switch (chartType.toLowerCase()) {
      case 'line':
        return this.processLineChart(chartConfig);
      case 'bar':
        return this.processBarChart(chartConfig);
      case 'pie':
        return this.processPieChart(chartConfig);
      case 'stacked_bar':
        return this.processStackedBarChart(chartConfig);
      default:
        console.warn(`Chart type '${chartType}' not yet implemented, using default bar chart`);
        return this.processBarChart(chartConfig);
    }
  }

  /**
   * Process Line Chart with professional styling
   */
  private processLineChart(chartConfig: ChartConfig): ProcessedChartData {
    const datasets = chartConfig.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: this.getColorWithOpacity(this.COLOR_PALETTE[index % this.COLOR_PALETTE.length], 0.1),
      borderColor: this.COLOR_PALETTE[index % this.COLOR_PALETTE.length],
      borderWidth: 3,
      fill: true,
      tension: 0.4, // Smooth curves
      pointBackgroundColor: this.COLOR_PALETTE[index % this.COLOR_PALETTE.length],
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: this.COLOR_PALETTE[index % this.COLOR_PALETTE.length],
      pointHoverBorderColor: '#FFFFFF',
      pointHoverBorderWidth: 3
    }));

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: chartConfig.labels,
        datasets: datasets
      },      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20,              font: {
                family: "'Inter', 'Segoe UI', 'system-ui', sans-serif",
                size: 14,
                weight: 500
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            borderColor: this.OFFICIAL_COLORS.primary,
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              title: (context) => {
                return `${context[0].label}`;
              },
              label: (context) => {
                const value = this.formatNumber(context.parsed.y);
                return `${context.dataset.label}: ${value}`;
              }
            }
          },          datalabels: {
            display: true, // Show labels for all data points
            backgroundColor: (context: any) => {
              // Create gradient-like effect with dataset colors
              const color = this.COLOR_PALETTE[context.datasetIndex % this.COLOR_PALETTE.length];
              return color;
            },
            color: '#FFFFFF',
            borderColor: '#FFFFFF',
            borderWidth: 1,            borderRadius: 4,
            padding: {
              top: 3.5,
              bottom: 3.5,
              left: 5.5,
              right: 5.5
            },
            font: {
              family: "'Inter', 'Segoe UI', 'system-ui', sans-serif",
              size: 9,
              weight: 'bold'
            },
            formatter: (value: number, context: any) => {
              // Add dataset label for better context
              const formattedValue = this.formatNumber(value);
              return formattedValue;
            },            anchor: 'end',
            align: 'top',
            offset: 5,
            clip: false,
            // Enhanced styling for better visibility
            textAlign: 'center'
          }
        },
        scales: {
          x: {
            display: true,            title: {
              display: chartConfig.labels.length > 0,
              text: 'Categories',
              font: {
                family: "'Inter', 'Segoe UI', 'system-ui', sans-serif",
                size: 14,
                weight: 600
              },
              color: '#374151'
            },
            grid: {
              display: true,
              color: 'rgba(156, 163, 175, 0.2)',
              lineWidth: 1
            },
            ticks: {
              font: {
                family: "'Inter', 'Segoe UI', 'system-ui', sans-serif",
                size: 12
              },
              color: '#6B7280',
              maxRotation: 45
            }
          },
          y: {
            display: true,
            beginAtZero: true,            title: {
              display: true,
              text: 'Values',
              font: {
                family: "'Inter', 'Segoe UI', 'system-ui', sans-serif",
                size: 14,
                weight: 600
              },
              color: '#374151'
            },
            grid: {
              display: true,
              color: 'rgba(156, 163, 175, 0.2)',
              lineWidth: 1
            },
            ticks: {
              font: {
                family: "'Inter', 'Segoe UI', 'system-ui', sans-serif",
                size: 12
              },
              color: '#6B7280',
              callback: (value) => {
                return this.formatNumber(value as number);
              }
            }
          }
        },
        elements: {
          point: {
            hoverRadius: 8,
            hitRadius: 10
          }
        }
      }
    };

    return {
      type: 'line',
      config: config
    };
  }

  /**
   * Process Bar Chart (placeholder - will be implemented later)
   */
  private processBarChart(chartConfig: ChartConfig): ProcessedChartData {
    console.log('Bar chart processing - to be implemented later');
    // For now, return a basic configuration
    return {
      type: 'bar',
      config: {
        type: 'bar',
        data: {
          labels: chartConfig.labels,
          datasets: chartConfig.datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      }
    };
  }

  /**
   * Process Pie Chart (placeholder - will be implemented later)
   */
  private processPieChart(chartConfig: ChartConfig): ProcessedChartData {
    console.log('Pie chart processing - to be implemented later');
    // For now, return a basic configuration
    return {
      type: 'pie',
      config: {
        type: 'pie',
        data: {
          labels: chartConfig.labels,
          datasets: chartConfig.datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      }
    };
  }

  /**
   * Process Stacked Bar Chart (placeholder - will be implemented later)
   */
  private processStackedBarChart(chartConfig: ChartConfig): ProcessedChartData {
    console.log('Stacked bar chart processing - to be implemented later');
    // For now, return a basic configuration
    return {
      type: 'bar',
      config: {
        type: 'bar',
        data: {
          labels: chartConfig.labels,
          datasets: chartConfig.datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { stacked: true },
            y: { stacked: true }
          }
        }
      }
    };
  }

  /**
   * Helper method to get color with opacity
   */
  private getColorWithOpacity(color: string, opacity: number): string {
    // Convert hex to rgba
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  /**
   * Helper method to format numbers
   */
  private formatNumber(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    } else if (value % 1 === 0) {
      return value.toString();
    } else {
      return value.toFixed(1);
    }
  }

  /**
   * Get available colors for external use
   */
  getColorPalette(): string[] {
    return [...this.COLOR_PALETTE];
  }

  /**
   * Get darker colors for external use
   */
  getDarkerColorPalette(): string[] {
    return [...this.DARKER_COLOR_PALETTE];
  }
}
