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
    primary: '#118DFF',      // Professional Blue
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
  

  constructor() {
    // Register Chart.js components and datalabels plugin
    Chart.register(...registerables, ChartDataLabels);
  }
  /**
   * Process chart data and return Chart.js configuration
   */
  processChartData(chartType: string, chartConfig: ChartConfig): ProcessedChartData {
    console.log('🎨 ChartService - Processing chart type:', chartType);
    console.log('🎨 ChartService - Chart config received:', chartConfig);
    
    const normalizedChartType = chartType.toLowerCase();
    console.log('🎨 ChartService - Normalized chart type:', normalizedChartType);
      switch (normalizedChartType) {
      case 'line':
        console.log('✅ ChartService - Processing as LINE chart');
        return this.processLineChart(chartConfig);
      case 'bar':
        console.log('✅ ChartService - Processing as BAR chart');
        return this.processBarChart(chartConfig);
      case 'pie':
        console.log('✅ ChartService - Processing as PIE chart');
        return this.processPieChart(chartConfig);
      case 'donut':
        console.log('✅ ChartService - Processing as DONUT chart');
        return this.processDonutChart(chartConfig);      case 'doughnut':
        console.log('✅ ChartService - Processing as DOUGHNUT chart');
        return this.processDonutChart(chartConfig);
      case 'area':
        console.log('✅ ChartService - Processing as AREA chart');
        return this.processAreaChart(chartConfig);
      case 'stacked_bar':
        console.log('✅ ChartService - Processing as STACKED BAR chart');
        return this.processStackedBarChart(chartConfig);
      default:
        console.warn(`❌ ChartService - Chart type '${chartType}' not implemented, using default bar chart`);
        return this.processBarChart(chartConfig);
    }
  }

  /**
   * Process Line Chart with professional styling
   */  private processLineChart(chartConfig: ChartConfig): ProcessedChartData {
    const datasets = chartConfig.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: 'transparent', // No background fill for line charts
      borderColor: this.COLOR_PALETTE[index % this.COLOR_PALETTE.length],
      borderWidth: 3,
      fill: false, // Line charts should not be filled
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
            backgroundColor: '#DDFBFB',
            color: '#000000',
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
   * Process Bar Chart with professional styling
   */
  private processBarChart(chartConfig: ChartConfig): ProcessedChartData {
    const datasets = chartConfig.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: this.COLOR_PALETTE[index % this.COLOR_PALETTE.length],
      borderColor: this.COLOR_PALETTE[index % this.COLOR_PALETTE.length],
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false,
      hoverBackgroundColor: this.getColorWithOpacity(this.COLOR_PALETTE[index % this.COLOR_PALETTE.length], 0.8),
      hoverBorderColor: this.COLOR_PALETTE[index % this.COLOR_PALETTE.length],
      hoverBorderWidth: 3
    }));

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: chartConfig.labels,
        datasets: datasets
      },
      options: {
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
              padding: 20,
              font: {
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
            backgroundColor: '#DDFBFB',
            color: '#000000',
            borderColor: '#FFFFFF',
            borderWidth: 1,
            borderRadius: 4,
            padding: {
              top: 3,
              bottom: 3,
              left: 5,
              right: 5
            },
            font: {
              family: "'Inter', 'Segoe UI', 'system-ui', sans-serif",
              size: 8,
              weight: 'bold'
            },
            formatter: (value: number, context: any) => {
              return this.formatNumber(value);
            },
            anchor: 'end',
            align: 'top',
            offset: 4,
            clip: false,
            textAlign: 'center'
          }
        },
        scales: {
          x: {
            display: true,
            title: {
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
              display: false // Hide vertical grid lines for cleaner bar chart
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
            beginAtZero: true,
            title: {
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
          bar: {
            borderRadius: 6,
            borderSkipped: false
          }
        }
      }
    };

    return {
      type: 'bar',
      config: config
    };
  }  /**
   * Process Pie Chart with professional styling
   */
  private processPieChart(chartConfig: ChartConfig): ProcessedChartData {
    // Generate colors for all slices
    const colors = this.generateColorsForDataset(chartConfig.labels.length);
    
    const datasets = chartConfig.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: colors,
      borderColor: '#FFFFFF',
      borderWidth: 2,
      hoverBackgroundColor: colors.map((color: string) => this.getColorWithOpacity(color, 0.8)),
      hoverBorderColor: '#FFFFFF',
      hoverBorderWidth: 3
    }));

    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: chartConfig.labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              usePointStyle: true,
              padding: 15,
              font: {
                family: "'Inter', 'Segoe UI', 'system-ui', sans-serif",
                size: 12,
                weight: 500
              },
              generateLabels: function(chart: any) {
                const data = chart.data;
                if (data.labels && data.datasets.length) {
                  return data.labels.map((label: string, i: number) => {
                    const dataset = data.datasets[0];
                    const value = dataset.data[i] as number;
                    const total = (dataset.data as number[]).reduce((sum: number, val: number) => sum + val, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    const backgroundColors = dataset.backgroundColor as string[];
                    
                    return {
                      text: `${label} (${percentage}%)`,
                      fillStyle: backgroundColors ? backgroundColors[i] : '#118DFF',
                      strokeStyle: '#FFFFFF',
                      lineWidth: 2,
                      hidden: false,
                      index: i
                    };
                  });
                }
                return [];
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
                const value = this.formatNumber(context.parsed);
                const total = (context.dataset.data as number[]).reduce((sum, val) => sum + val, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return `${context.dataset.label}: ${value} (${percentage}%)`;
              }
            }
          },
          datalabels: {
            display: true,
            backgroundColor: '#DDFBFB',
            color: '#000000',
            borderColor: '#FFFFFF',
            borderWidth: 1,
            borderRadius: 4,
            padding: {
              top: 4,
              bottom: 4,
              left: 6,
              right: 6
            },
            font: {
              family: "'Inter', 'Segoe UI', 'system-ui', sans-serif",
              size: 10,
              weight: 'bold'
            },
            formatter: (value: number, context: any) => {
              const total = (context.dataset.data as number[]).reduce((sum: number, val: number) => sum + val, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${percentage}%`;
            },
            anchor: 'center',
            align: 'center',
            offset: 0,
            clip: false,
            textAlign: 'center'
          }
        },
        layout: {
          padding: {
            top: 20,
            bottom: 20,
            left: 20,
            right: 20
          }
        }
      }
    };    return {
      type: 'pie',
      config: config
    };
  }

  /**
   * Process Donut Chart with professional styling
   */
  private processDonutChart(chartConfig: ChartConfig): ProcessedChartData {
    // Generate colors for all slices
    const colors = this.generateColorsForDataset(chartConfig.labels.length);
    
    const datasets = chartConfig.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: colors,
      borderColor: '#FFFFFF',
      borderWidth: 2,
      hoverBackgroundColor: colors.map((color: string) => this.getColorWithOpacity(color, 0.8)),
      hoverBorderColor: '#FFFFFF',
      hoverBorderWidth: 3
    }));    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: chartConfig.labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              usePointStyle: true,
              padding: 15,
              font: {
                family: "'Inter', 'Segoe UI', 'system-ui', sans-serif",
                size: 12,
                weight: 500
              },
              generateLabels: function(chart: any) {
                const data = chart.data;
                if (data.labels && data.datasets.length) {
                  return data.labels.map((label: string, i: number) => {
                    const dataset = data.datasets[0];
                    const value = dataset.data[i] as number;
                    const total = (dataset.data as number[]).reduce((sum: number, val: number) => sum + val, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    const backgroundColors = dataset.backgroundColor as string[];
                    
                    return {
                      text: `${label} (${percentage}%)`,
                      fillStyle: backgroundColors ? backgroundColors[i] : '#118DFF',
                      strokeStyle: '#FFFFFF',
                      lineWidth: 2,
                      hidden: false,
                      index: i
                    };
                  });
                }
                return [];
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
                const value = this.formatNumber(context.parsed);
                const total = (context.dataset.data as number[]).reduce((sum, val) => sum + val, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return `${context.dataset.label}: ${value} (${percentage}%)`;
              }
            }
          },
          datalabels: {
            display: true,
            backgroundColor: '#DDFBFB',
            color: '#000000',
            borderColor: '#FFFFFF',
            borderWidth: 1,
            borderRadius: 4,
            padding: {
              top: 4,
              bottom: 4,
              left: 6,
              right: 6
            },
            font: {
              family: "'Inter', 'Segoe UI', 'system-ui', sans-serif",
              size: 10,
              weight: 'bold'
            },
            formatter: (value: number, context: any) => {
              const total = (context.dataset.data as number[]).reduce((sum: number, val: number) => sum + val, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${percentage}%`;
            },
            anchor: 'center',
            align: 'center',
            offset: 0,
            clip: false,
            textAlign: 'center'
          }        },
        layout: {
          padding: {
            top: 20,
            bottom: 20,
            left: 20,
            right: 20
          }
        }      }
    };

    // Add donut-specific cutout property
    (config as any).options.cutout = '50%';    return {
      type: 'doughnut',
      config: config
    };
  }
  /**
   * Process Area Chart with professional styling
   */
  private processAreaChart(chartConfig: ChartConfig): ProcessedChartData {
    const datasets = chartConfig.datasets.map((dataset, index) => {
      // For multi-dataset area charts, use different fill strategies
      let fillConfig;
      if (chartConfig.datasets.length === 1) {
        // Single dataset: fill to bottom (origin)
        fillConfig = 'origin';
      } else {
        // Multiple datasets: stack them or use different origins
        if (index === 0) {
          fillConfig = 'origin'; // First dataset fills to bottom
        } else {
          fillConfig = index - 1; // Subsequent datasets fill to previous dataset
        }
      }

      return {
        ...dataset,
        backgroundColor: this.getColorWithOpacity(this.COLOR_PALETTE[index % this.COLOR_PALETTE.length], 0.4),
        borderColor: this.COLOR_PALETTE[index % this.COLOR_PALETTE.length],
        borderWidth: 2,
        fill: fillConfig, // Dynamic fill configuration for multiple datasets
        tension: 0.4, // Smooth curves
        pointBackgroundColor: this.COLOR_PALETTE[index % this.COLOR_PALETTE.length],
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: this.COLOR_PALETTE[index % this.COLOR_PALETTE.length],
        pointHoverBorderColor: '#FFFFFF',
        pointHoverBorderWidth: 3
      };
    });    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: chartConfig.labels,
        datasets: datasets
      },
      options: {
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
              padding: 20,
              font: {
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
          },
          datalabels: {
            display: chartConfig.datasets.length === 1, // Only show labels for single dataset to avoid clutter
            backgroundColor: '#DDFBFB',
            color: '#000000',
            borderColor: '#FFFFFF',
            borderWidth: 1,
            borderRadius: 4,
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
              return this.formatNumber(value);
            },
            anchor: 'end',
            align: 'top',
            offset: 5,
            clip: false,
            textAlign: 'center'
          }
        },
        scales: {
          x: {
            display: true,
            title: {
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
            beginAtZero: true,
            title: {
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
            hoverRadius: 7,
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
   * Generate colors for dataset - uses official colors first, then random colors
   */
  private generateColorsForDataset(count: number): string[] {
    const colors: string[] = [];
    
    // First, use official colors
    for (let i = 0; i < count && i < this.COLOR_PALETTE.length; i++) {
      colors.push(this.COLOR_PALETTE[i]);
    }
    
    // If we need more colors, generate random professional colors
    for (let i = this.COLOR_PALETTE.length; i < count; i++) {
      colors.push(this.generateRandomProfessionalColor());
    }
    
    return colors;
  }

  /**
   * Generate a random professional color
   */
  private generateRandomProfessionalColor(): string {
    // Generate colors with good saturation and lightness for professional look
    const hue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.floor(Math.random() * 30); // 60-90%
    const lightness = 45 + Math.floor(Math.random() * 20);  // 45-65%
    
    // Convert HSL to RGB
    const c = (1 - Math.abs(2 * lightness / 100 - 1)) * saturation / 100;
    const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
    const m = lightness / 100 - c / 2;
    
    let r, g, b;
    if (hue >= 0 && hue < 60) {
      r = c; g = x; b = 0;
    } else if (hue >= 60 && hue < 120) {
      r = x; g = c; b = 0;
    } else if (hue >= 120 && hue < 180) {
      r = 0; g = c; b = x;
    } else if (hue >= 180 && hue < 240) {
      r = 0; g = x; b = c;
    } else if (hue >= 240 && hue < 300) {
      r = x; g = 0; b = c;
    } else {
      r = c; g = 0; b = x;
    }
    
    // Convert to hex
    const red = Math.round((r + m) * 255);
    const green = Math.round((g + m) * 255);
    const blue = Math.round((b + m) * 255);
    
    return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
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
}
