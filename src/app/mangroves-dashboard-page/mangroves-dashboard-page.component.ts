import { Component, AfterViewInit } from '@angular/core';

declare var Chart: any;

@Component({
  selector: 'app-mangroves-dashboard-page',
  templateUrl: './mangroves-dashboard-page.component.html',
  styleUrls: ['./mangroves-dashboard-page.component.css']
})
export class MangrovesDashboardPageComponent implements AfterViewInit {
  infoCards = [
    { title: 'Total Mangrove Area', value: '1,373.5 Ha' },
    { title: 'Avg. Annual Loss', value: '253.4 Ha' },
    { title: 'Blue Carbon Stored', value: '42.6 Mt CO₂' },
    { title: 'Restoration Sites', value: '233.3 Ha' },
  ];

  timestamps: string[] = ['05:18', '05:19', '05:20', '05:21', '05:22', '05:23', '05:24', '05:25', '05:26', '05:27'];
  charts: { [key: string]: any } = {};

  ngAfterViewInit(): void {
    this.initializeCharts();
    this.updateDatasets();
    setInterval(() => this.updateDatasets(), 60000);
  }

  initializeCharts(): void {
    const timeLabels = this.generateTimeLabels(5, 5); // Last 5 time points, 5-minute interval
    const fullLabels = this.generateTimeLabels(10, 5); // For 10-point datasets
  
    this.charts['temperatureSalinityChart'] = new Chart('temperatureSalinityChart', {
      type: 'line',
      data: {
        labels: timeLabels,
        datasets: [
          {
            label: 'Temperature (°C)',
            data: [28.5, 28.7, 28.6, 28.8, 28.9],
            borderColor: '#ff6384',
            backgroundColor: 'rgba(255,99,132,0.2)',
            fill: false,
            tension: 0.4
          },
          {
            label: 'Salinity (ppt)',
            data: [30, 31, 30.5, 31.2, 30.8],
            borderColor: '#36a2eb',
            backgroundColor: 'rgba(54,162,235,0.2)',
            fill: false,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        },
        scales: {
          y: {
            title: { display: true, text: 'Value' }
          },
          x: {
            title: { display: true, text: 'Time' }
          }
        }
      }
    });
  
    this.charts['soilMoistureChart'] = new Chart('soilMoistureChart', {
      type: 'line',
      data: {
        labels: timeLabels,
        datasets: [{
          label: 'Soil Moisture',
          data: [45, 47, 46, 48, 49],
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          tension: 0.4,
          fill: true
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  
    this.charts['waterLevelChart'] = new Chart('waterLevelChart', {
      type: 'bar',
      data: {
        labels: timeLabels,
        datasets: [{
          label: 'Water Level',
          data: [1.2, 1.4, 1.5, 1.3, 1.6],
          backgroundColor: '#03a9f4'
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  
    this.charts['co2Chart'] = new Chart('co2Chart', {
      type: 'doughnut',
      data: {
        labels: ['CO₂ (Current)', 'Remaining Capacity'],
        datasets: [{
          label: 'CO₂ Concentration',
          data: [420, 580],
          backgroundColor: ['#ff7043', '#eeeeee']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  
    this.charts['windSpeedChart'] = new Chart('windSpeedChart', {
      type: 'radar',
      data: {
        labels: ['North', 'East', 'South', 'West'],
        datasets: [{
          label: 'Wind Speed (m/s)',
          data: [2.5, 3.2, 2.8, 3.5],
          backgroundColor: 'rgba(33, 150, 243, 0.2)',
          borderColor: '#2196f3'
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  
    this.charts['salinityChart'] = new Chart('salinityChart', {
      type: 'line',
      data: {
        labels: fullLabels,
        datasets: [{
          label: 'Salinity (ppt)',
          data: [32.0, 34.4, 27.5, 29.1, 28.3, 30.5, 20.8, 31.4, 32.9, 30.6],
          borderColor: '#267a57',
          backgroundColor: 'rgba(38,122,87,0.1)',
          fill: true,
          tension: 0.4
        }]
      }
    });
  
    this.charts['phChart'] = new Chart('phChart', {
      type: 'line',
      data: {
        labels: fullLabels,
        datasets: [{
          label: 'Soil pH',
          data: [5.88, 6.31, 7.49, 7.77, 5.53, 5.51, 7.81, 7.64, 6.18, 6.73],
          borderColor: '#3e8e41',
          backgroundColor: 'rgba(62,142,65,0.1)',
          fill: true,
          tension: 0.4
        }]
      }
    });
  
    this.charts['tidalChart'] = new Chart('tidalChart', {
      type: 'bar',
      data: {
        labels: fullLabels,
        datasets: [{
          label: 'Tidal Amplitude (m)',
          data: [2.04, 0.66, 1.78, 1.67, 2.05, 0.70, 1.22, 2.30, 0.99, 0.52],
          backgroundColor: '#267a57'
        }]
      }
    });
  
    this.charts['rainfallChart'] = new Chart('rainfallChart', {
      type: 'bar',
      data: {
        labels: fullLabels,
        datasets: [{
          label: 'Rainfall (mm)',
          data: [49, 34, 25, 6, 14, 35, 7, 2, 10, 30],
          backgroundColor: '#3cba9f'
        }]
      }
    });
  
    this.charts['radiationChart'] = new Chart('radiationChart', {
      type: 'line',
      data: {
        labels: fullLabels,
        datasets: [{
          label: 'Solar Radiation (W/m²)',
          data: [534, 873, 512, 813, 388, 457, 677, 177, 833, 177],
          borderColor: '#ffcc00',
          backgroundColor: 'rgba(255,204,0,0.2)',
          fill: true,
          tension: 0.4
        }]
      }
    });
  
    this.charts['tempChart'] = new Chart('tempChart', {
      type: 'line',
      data: {
        labels: fullLabels,
        datasets: [{
          label: 'Air Temperature (°C)',
          data: [31.1, 27.6, 24.8, 31.4, 25.4, 32.5, 27.5, 32.5, 30.4, 32.7],
          borderColor: '#ff5733',
          backgroundColor: 'rgba(255,87,51,0.1)',
          fill: true,
          tension: 0.4
        }]
      }
    });
  
    this.charts['leafDensityChart'] = new Chart('leafDensityChart', {
      type: 'radar',
      data: {
        labels: ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E'],
        datasets: [{
          label: 'Leaf Density (%)',
          data: [91, 69, 98, 74, 86],
          backgroundColor: 'rgba(38,122,87,0.2)',
          borderColor: '#267a57'
        }]
      }
    });
  
    this.charts['sedimentChart'] = new Chart('sedimentChart', {
      type: 'doughnut',
      data: {
        labels: ['Zone A', 'Zone B', 'Zone C', 'Zone D'],
        datasets: [{
          label: 'Sediment Rate (kg/m²/day)',
          data: [3.0, 2.4, 2.5, 2.0],
          backgroundColor: ['#267a57', '#3cba9f', '#ffcc00', '#ff5733']
        }]
      }
    });
  }
  
  // Time label generator
  generateTimeLabels(count: number, intervalMinutes: number): string[] {
    const now = new Date();
    const labels: string[] = [];
  
    for (let i = count - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * intervalMinutes * 60000);
      labels.push(time.toTimeString().slice(0, 5));
    }
  
    return labels;
  }
  

  updateDatasets(): void {
    this.shiftLabelsAndData('temperatureSalinityChart', 2, [
      { min: 28, max: 30 },  // Temperature
      { min: 25, max: 35 }   // Salinity
    ]);
  
    this.shiftLabelsAndData('soilMoistureChart', 1, [{ min: 45, max: 55 }]);
    this.shiftLabelsAndData('waterLevelChart', 1, [{ min: 1.0, max: 1.7 }]);
    this.shiftLabelsAndData('salinityChart', 1, [{ min: 25, max: 35 }]);
    this.shiftLabelsAndData('phChart', 1, [{ min: 5.0, max: 8.0 }]);
    this.shiftLabelsAndData('tidalChart', 1, [{ min: 0.5, max: 2.5 }]);
    this.shiftLabelsAndData('rainfallChart', 1, [{ min: 0, max: 50 }]);
    this.shiftLabelsAndData('radiationChart', 1, [{ min: 100, max: 1000 }]);
    this.shiftLabelsAndData('tempChart', 1, [{ min: 24, max: 33 }]);
  
    // Special charts with radial or doughnut don't use timestamps
    const updateDataOnly = (chartKey: string, datasetIndex: number, min: number, max: number, count: number) => {
      if (this.charts[chartKey]) {
        this.charts[chartKey].data.datasets[datasetIndex].data =
          Array.from({ length: count }, () => +(Math.random() * (max - min) + min).toFixed(1));
        this.charts[chartKey].update();
      }
    };
  
    updateDataOnly('windSpeedChart', 0, 2.0, 4.0, 4);
    updateDataOnly('leafDensityChart', 0, 60, 100, 5);
    updateDataOnly('sedimentChart', 0, 1.5, 3.5, 4);
  
    if (this.charts['co2Chart']) {
      const current = +(Math.random() * (450 - 400) + 400).toFixed(1);
      this.charts['co2Chart'].data.datasets[0].data = [current, +(1000 - current).toFixed(1)];
      this.charts['co2Chart'].update();
    }
  }

  getCurrentTime(): string {
    const now = new Date();
    return now.toTimeString().substring(0, 5); // HH:MM format
  }
  
  shiftLabelsAndData(chartKey: string, datasetCount: number, valueRanges: { min: number, max: number }[]): void {
    const chart = this.charts[chartKey];
    if (!chart) return;
  
    // Shift labels
    chart.data.labels.push(this.getCurrentTime());
    chart.data.labels.shift();
  
    // Shift data for each dataset
    for (let i = 0; i < datasetCount; i++) {
      const newVal = +(Math.random() * (valueRanges[i].max - valueRanges[i].min) + valueRanges[i].min).toFixed(1);
      chart.data.datasets[i].data.push(newVal);
      chart.data.datasets[i].data.shift();
    }
  
    chart.update();
  }
  
}
