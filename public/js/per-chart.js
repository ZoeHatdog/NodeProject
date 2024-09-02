

async function fetchData('chartId') {
    try {
        console.log(`Fetching data for ${chartId}`); // Log the chartId being fetched
        const response = await fetch(`/per-chart-data?chartID=${chartId}`);
        const data = await response.json();
        console.log('Fetched Data:', data); // Check if data is fetched correctly
        return data;
    } catch (error) {
        console.error(`Error fetching data for ${chartId}:`, error);
        return [];
    }
}


async function createEducationalChart(chartId, canvasId, label) {
    const data = await fetchData(chartId);
    console.log('Data for Educational Chart:', data);
  
    const departments = data.map(item => item.department);
    const counts = data.map(item => item.count);
  
    console.log('Departments:', departments);
    console.log('Counts:', counts);
  
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: departments,
            datasets: [{
                label: label,
                data: counts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgb(75, 192, 192)',
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
                        text: 'Department'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Count'
                    }
                }
            }
        }
    });
}

async function createJobGradeChart(chartId, canvasId, label) {
    const data = await fetchData('chart2');
    console.log('Data for Job Grade Chart:', data);
  
    const jobGrades = data.map(item => item.job_grade);
    const counts = data.map(item => item.count);
  
    console.log('Job Grades:', jobGrades);
    console.log('Counts:', counts);
  
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: jobGrades,
            datasets: [{
                label: label,
                data: counts,
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgb(255, 159, 64)',
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
                        text: 'Job Grade'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Count'
                    }
                }
            }
        }
    });
}
document.addEventListener('DOMContentLoaded', function () {
    createEducationalChart('chart1', 'chart1', 'Educational Attainment by Department');
    createJobGradeChart('chart2', 'chart2', 'Job Grade by Department');
});

