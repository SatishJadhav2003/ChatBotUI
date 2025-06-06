import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartData } from '../../services/chat.service';
import { ChartService } from '../../services/chart.service';

// Register Chart.js components and datalabels plugin
Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() chartData!: ChartData;
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  chart: Chart | null = null;
  isError = false;
  errorMessage = '';

  constructor(private chartService: ChartService) { }

  ngOnInit(): void {
    if (!this.chartData) {
      this.isError = true;
      this.errorMessage = 'No chart data provided';
    }
  }
  ngAfterViewInit(): void {
    if (this.chartData && this.chartData.chart_config && this.chartData.chart_config.labels && this.chartData.chart_config.labels.length > 0) {
      if (this.chartData.render_mode === 'frontend') {
        this.renderFrontendChart();
      } else if (this.chartData.render_mode === 'backend') {
        this.handleBackendChart();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
  private renderFrontendChart(): void {
    try {
      if (!this.chartData.chart_config || !this.chartCanvas) {
        this.isError = true;
        this.errorMessage = 'Invalid chart configuration';
        return;
      }

      if (!this.validateChartData()) {
        this.isError = true;
        this.errorMessage = 'Invalid chart data structure';
        return;
      }

      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      if (!ctx) {
        this.isError = true;
        this.errorMessage = 'Could not get canvas context';
        return;
      }      // Use chart service to process the chart data
      const processedChart = this.chartService.processChartData(
        this.chartData.chart_type || 'bar',
        {
          labels: this.chartData.chart_config.labels || [],
          datasets: this.chartData.chart_config.datasets || []
        }
      );

      console.log(`🎨 Rendering ${this.chartData.chart_type} chart with processed configuration`);
      
      this.chart = new Chart(ctx, processedChart.config);
      
    } catch (error) {
      console.error('Error rendering chart:', error);
      this.isError = true;
      this.errorMessage = `Failed to render chart: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private handleBackendChart(): void {
    console.log('🖼️ Backend chart detected:', this.chartData);
    console.log('Backend chart rendering - to be implemented later');
    // For now, just log that we received a backend chart
    // Later we can implement image rendering if needed
  }

  private validateChartData(): boolean {
    if (!this.chartData.chart_config) {
      console.error('No chart_config provided');
      return false;
    }

    const config = this.chartData.chart_config;
    
    // Check labels
    if (!config.labels || !Array.isArray(config.labels)) {
      console.error('Invalid or missing labels:', config.labels);
      return false;
    }

    // Check datasets
    if (!config.datasets || !Array.isArray(config.datasets) || config.datasets.length === 0) {
      console.error('Invalid or missing datasets:', config.datasets);
      return false;
    }

    // Validate each dataset
    for (let i = 0; i < config.datasets.length; i++) {
      const dataset = config.datasets[i];
      if (!dataset.data || !Array.isArray(dataset.data)) {
        console.error(`Dataset ${i} has invalid data:`, dataset.data);
        return false;
      }
    }

    return true;
  }

  private getChartType(): ChartType {
    switch (this.chartData.chart_type) {
      case 'pie':
        return 'pie';
      case 'line':
        return 'line';
      case 'bar':
        return 'bar';
      case 'stacked_bar':
        return 'bar';
      default:
        return 'bar';
    }
  }
  downloadChart(): void {
    try {
      if (this.chartData.render_mode === 'frontend' && this.chart) {
        // Download Canvas Chart as PNG
        const canvas = this.chartCanvas.nativeElement;
        const link = document.createElement('a');
        link.download = `chart-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else if (this.chartData.render_mode === 'backend') {
        console.log('Backend chart download - to be implemented later');
      }
    } catch (error) {
      console.error('Error downloading chart:', error);
    }
  }

  getChartTitle(): string {
    if (this.chartData.chart_config?.datasets?.[0]?.label) {
      return this.chartData.chart_config.datasets[0].label;
    }
    return `${this.chartData.chart_type || 'Chart'} Visualization`;
  }
}
