async function fetchData(chartId) {
    const response = await fetch(`/data?chartId=${chartId}`);
    const data = await response.json();
    console.log('Fetched Data:', data); // Check if data is fetched correctly
    return data;
  }
  
  async function createChart(chartId, canvasId, chartType, label, colorScheme) {
    const data = await fetchData(chartId);
    console.log('Data for Chart:', data);
  
    if (!data.length) {
        console.error('No data available for chart:', chartId);
        return;
    }
  
    const labels = data.map(item => item[label]);
    const values = data.map(item => item.count);
  
    console.log('Labels:', labels);
    console.log('Values:', values);
  
    const backgroundColors = labels.map(() => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgba(${r}, ${g}, ${b}, 0.6)`;
    });
  
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: values,
                backgroundColor: colorScheme || backgroundColors,
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const lbl = context.label || '';
                            const value = context.raw || 0;
                            return `${lbl}: ${value}`;
                        }
                    }
                }
            }
        }
    });
  }
  
  async function createBarChart(chartId, canvasId, label) {
    const data = await fetchData(chartId);
    console.log('Data for Bar Chart:', data);
  
    const departments = [...new Set(data.map(item => item.department))];
    const genders = [...new Set(data.map(item => item.gender))];
  
    console.log('Departments:', departments);
    console.log('Genders:', genders);
  
    const datasets = genders.map(gender => {
        return {
            label: gender,
            data: departments.map(department => {
                const item = data.find(d => d.department === department && d.gender === gender);
                return item ? item.count : 0;
            }),
            backgroundColor: gender === 'M' ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)',
            borderColor: gender === 'M' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        };
    });
  
    console.log('Datasets for Bar Chart:', datasets);
  
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: departments,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const lbl = context.dataset.label || '';
                            const value = context.raw || 0;
                            return `${lbl}: ${value}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Department'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of Employees'
                    }
                }
            }
        }
    });
  }
  
  async function createBarChartLOS(chartId, canvasId) {
    const data = await fetchData(chartId);
    console.log('Data for Length of Service Chart:', data);
  
    const serviceLengths = data.map(item => item.service_length);
    const counts = data.map(item => item.number_of_employees);
  
    console.log('Service Lengths:', serviceLengths);
    console.log('Counts:', counts);
  
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: serviceLengths,
            datasets: [{
                label: 'Number of Employees',
                data: counts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const lbl = context.label || '';
                            const value = context.raw || 0;
                            return `${lbl}: ${value}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Length of Service (Years)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of Employees'
                    }
                }
            }
        }
    });
  }
  /*
  async function createBarChartES(chartId, canvasId, xLabel, yLabel) {
      const data = await fetchData(chartId);
  
      const departments = Array.from(new Set(data.map(item => item.department)));
      const statuses = ['Regular', 'Probationary']; // Explicitly define the statuses
      const datasets = [];
  
      statuses.forEach(status => {
          const counts = departments.map(department => {
              const item = data.find(d => d.department === department && d.employment_status === status);
              return item ? item.count : 0;
          });
  
          datasets.push({
              label: status,
              data: counts,
              backgroundColor: status === 'Regular' ? 'rgba(255, 205, 86, 0.2)' : 'rgba(54, 162, 235, 0.2)', // Yellow for Regular, Blue for Probationary
              borderColor: status === 'Regular' ? 'rgba(255, 205, 86, 1)' : 'rgba(54, 162, 235, 1)', // Yellow for Regular, Blue for Probationary
              borderWidth: 1
          });
      });
  
      console.log('Datasets:', datasets); // Log the datasets to inspect them
  
      const ctx = document.getElementById(canvasId).getContext('2d');
      new Chart(ctx, {
          type: 'bar',
          data: {
              labels: departments,
              datasets: datasets
          },
          options: {
              responsive: true,
              plugins: {
                  legend: {
                      position: 'top',
                  },
                  tooltip: {
                      callbacks: {
                          label: function(context) {
                              const lbl = context.dataset.label || '';
                              const value = context.raw || 0;
                              return `${lbl}: ${value}`;
                          }
                      }
                  }
              },
              scales: {
                  x: {
                      title: {
                          display: true,
                          text: xLabel
                      }
                  },
                  y: {
                      title: {
                          display: true,
                          text: yLabel
                      },
                      beginAtZero: true // Ensure the y-axis starts from 0
                  }
              }
          }
      });
  }
  */
  
  
  
  async function createLineChart(chartId, canvasId, label) {
    const data = await fetchData(chartId);
    console.log('Data for Line Chart:', data);
  
    const years = data.map(item => item.year);
    const counts = data.map(item => item.number_of_employees);
  
    console.log('Years:', years);
    console.log('Counts:', counts);
  
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: label,
                data: counts,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const lbl = context.label || '';
                            const value = context.raw || 0;
                            return `${lbl}: ${value}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of Employees'
                    }
                }
            }
        }
    });
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    createChart('chart1', 'chart1', 'bar', 'age_range');
    createChart('chart2', 'chart2', 'pie', 'department');
    createLineChart('chart3', 'lineChartCanvas', 'Number of Added Employees Over Time');
    createBarChart('chart4', 'barChartCanvas', 'Department by Gender');
    createBarChartLOS('chart5', 'lengthOfServiceChart');
    //createBarChartES('chart6', 'employmentStatusChart', 'Department', 'Number of Employees');
  });
  